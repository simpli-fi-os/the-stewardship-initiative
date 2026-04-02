-- ============================================
-- TSI Auth & Admin Schema
-- Migration 002: User profiles, admin roles, member approval tracking
-- ============================================

-- 1. PROFILES (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add auth columns to members
ALTER TABLE members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE members ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE members ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE members ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE members ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_approved_at ON members(approved_at);

-- 4. UPDATED_AT TRIGGER for profiles
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: users can update their own
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: admins can read all profiles in their org
CREATE POLICY "Admins read org profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
      AND p.org_id = profiles.org_id
    )
  );

-- Profiles: service role manages all
CREATE POLICY "Service role manages profiles" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Members: admins can update members in their org
CREATE POLICY "Admins manage org members" ON members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
      AND p.org_id = members.org_id
    )
  );

-- 6. AUTO-CREATE PROFILE ON SIGNUP
-- This function creates a profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. SEED: Make hunter.lott@simpli-fi-alpha.com a super_admin for Village Church
-- (Run after Hunter signs up, or update manually)
-- UPDATE profiles SET role = 'super_admin', org_id = 'a1b2c3d4-0000-0000-0000-000000000001' WHERE email = 'hunter.lott@simpli-fi-alpha.com';
