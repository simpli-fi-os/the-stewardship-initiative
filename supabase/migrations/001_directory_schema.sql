-- ============================================
-- TSI Directory Schema
-- Migration 001: Core tables, RLS, and seed data
-- ============================================

-- 1. ORGANIZATIONS
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  website_url TEXT,
  primary_color TEXT DEFAULT '#022C22',
  accent_color TEXT DEFAULT '#FDB833',
  tier TEXT DEFAULT 'seed' CHECK (tier IN ('seed', 'growth', 'whitelabel')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEMBERS
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  photo_url TEXT,
  bio TEXT,
  description TEXT,
  available BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SKILLS (predefined per org)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  icon TEXT,
  UNIQUE(org_id, name)
);

-- 4. MEMBER_SKILLS (join table)
CREATE TABLE member_skills (
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, skill_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_members_org_id ON members(org_id);
CREATE INDEX idx_members_approved ON members(approved);
CREATE INDEX idx_skills_org_id ON skills(org_id);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_organizations
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_members
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_skills ENABLE ROW LEVEL SECURITY;

-- ORGANIZATIONS: anyone can read
CREATE POLICY "Public read orgs" ON organizations
  FOR SELECT USING (true);

-- MEMBERS: public can read approved members only
CREATE POLICY "Public read approved members" ON members
  FOR SELECT USING (approved = true);

-- MEMBERS: anyone can insert (public form submission)
CREATE POLICY "Public insert members" ON members
  FOR INSERT WITH CHECK (true);

-- MEMBERS: service role can do everything (for admin)
CREATE POLICY "Service role manages members" ON members
  FOR ALL USING (auth.role() = 'service_role');

-- SKILLS: anyone can read
CREATE POLICY "Public read skills" ON skills
  FOR SELECT USING (true);

-- MEMBER_SKILLS: anyone can read
CREATE POLICY "Public read member_skills" ON member_skills
  FOR SELECT USING (true);

-- MEMBER_SKILLS: anyone can insert (during form submission)
CREATE POLICY "Public insert member_skills" ON member_skills
  FOR INSERT WITH CHECK (true);

-- ============================================
-- STORAGE: member-photos bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('member-photos', 'member-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read member photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'member-photos');

CREATE POLICY "Anyone can upload member photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'member-photos');

-- ============================================
-- SEED DATA: The Village Church
-- ============================================

-- Organization
INSERT INTO organizations (id, name, slug, description, logo_url, hero_image_url, website_url)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'The Village Church',
  'village-church',
  'Connecting needs with the giftedness of our church family.',
  'https://www.thevillagechurch.net/Themes/TheVillageChurch/Assets/Images/primary-logo-white.svg',
  'https://origin.thevillagechurch.net/GetImage.ashx?Guid=027908df-c101-4994-a244-13fcbbc118c9',
  'https://www.thevillagechurch.net'
);

-- Skills
INSERT INTO skills (id, org_id, name, color) VALUES
  ('50000000-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'Leadership', '#EF4444'),
  ('50000000-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'Teaching', '#3B82F6'),
  ('50000000-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 'Creative', '#8B5CF6'),
  ('50000000-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 'Admin', '#6B7280'),
  ('50000000-0000-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000001', 'Management', '#EAB308'),
  ('50000000-0000-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000001', 'Counseling', '#14B8A6'),
  ('50000000-0000-0000-0000-000000000007', 'a1b2c3d4-0000-0000-0000-000000000001', 'Home Repair', '#F97316'),
  ('50000000-0000-0000-0000-000000000008', 'a1b2c3d4-0000-0000-0000-000000000001', 'Tech', '#EC4899'),
  ('50000000-0000-0000-0000-000000000009', 'a1b2c3d4-0000-0000-0000-000000000001', 'Finance', '#22C55E');

-- Members (all approved + available for demo)
INSERT INTO members (id, org_id, name, title, description, bio, email, available, approved, featured) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000001', 'Matt Chandler', 'Elder, Lead Pastor', 'Offering guidance in leadership development, public speaking coaching, and theological resource recommendations.', 'Matt Chandler serves as the Lead Pastor of The Village Church in Flower Mound, Texas.', 'mchandler.tsi@example.com', true, true, true),
  ('b0000000-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000001', 'Maddie Clay', 'Events Coordinator', 'Expert in planning and executing large-scale events. Can help with logistics and vendor coordination.', 'Maddie Clay coordinates events for The Village Church, ensuring gatherings run smoothly.', 'mclay.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 'Josh Cockrum', 'High School Associate Minister', 'Passionate about mentoring high school students. Available for discipleship and student leadership training.', 'Josh Cockrum serves in the high school ministry, helping students grow in their faith.', 'jcockrum.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000001', 'Kayley Cockrum', 'Events Coordinator', 'Specializes in creating welcoming environments for church events. Can offer advice on decor and hospitality.', 'Kayley Cockrum works alongside the events team to create memorable and impactful experiences for the church community.', 'kcockrum.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000001', 'Frankie Colombo', 'Facilities Technician I', 'Skilled in general maintenance and repairs. Can help with basic plumbing, electrical, and carpentry tasks.', 'Frankie Colombo helps maintain the church facilities, ensuring a safe and functional environment.', 'fcolombo.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000001', 'Nick Crawford', 'Elder, Lead Pastor', 'Experienced in pastoral leadership and church planting strategy. Available for ministry coaching.', 'Nick Crawford serves as a lead pastor, focusing on church leadership and new ministry initiatives.', 'ncrawford.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000007', 'a1b2c3d4-0000-0000-0000-000000000001', 'Jenni David', 'Childcare Coordinator', 'Manages childcare services and volunteers. Can provide resources for family discipleship and parenting.', 'Jenni David coordinates the childcare ministry, providing a safe and nurturing environment for the youngest members of the church.', 'jdavid.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000008', 'a1b2c3d4-0000-0000-0000-000000000001', 'Laura Dunnican', 'Global Missions Mobilizer', 'Connects members with global missions opportunities. Guidance on cross-cultural ministry and support raising.', 'Laura Dunnican mobilizes the church for global missions, equipping and sending members worldwide.', 'ldunnican.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000009', 'a1b2c3d4-0000-0000-0000-000000000001', 'Bryan Eaton', 'Home Groups Minister', 'Oversees the Home Groups ministry. Can provide training for group leaders and curriculum resources.', 'Bryan Eaton is dedicated to fostering community and spiritual growth through the Home Groups ministry at The Village.', 'beaton.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000010', 'a1b2c3d4-0000-0000-0000-000000000001', 'Lindsey Eenigenburg', 'Executive Director, Engagement', 'Focuses on connecting members to the church community. Can help with strategic communication and engagement planning.', 'Lindsey Eenigenburg leads the engagement team, helping people get connected and involved in the life of the church.', 'leenigenburg.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000011', 'a1b2c3d4-0000-0000-0000-000000000001', 'Justin Elafros', 'Minister, Senior Director, Adult Ministries', 'Directs adult ministries, including classes and discipleship programs. Can offer curriculum development advice.', 'Justin Elafros provides leadership to all adult ministries, ensuring there are clear pathways for spiritual growth.', 'jelafros.tsi@example.com', true, true, false),
  ('b0000000-0000-0000-0000-000000000012', 'a1b2c3d4-0000-0000-0000-000000000001', 'Rachel Ellis', 'Missions Coordinator', 'Coordinates logistics for local and global missions efforts. Can help with trip planning and administrative support.', 'Rachel Ellis supports the missions ministry through administrative and logistical coordination, helping to advance the gospel locally and globally.', 'rellis.tsi@example.com', true, true, false);

-- Member photos (using existing imgix URLs)
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=dc2ef162-0e17-4de5-a0ce-f4c469c53118' WHERE id = 'b0000000-0000-0000-0000-000000000001';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=b723bd3c-6ba8-417f-b5fb-6ee215e1cc0b' WHERE id = 'b0000000-0000-0000-0000-000000000002';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=d6673b94-aa2a-4652-afaa-5b124693fd17' WHERE id = 'b0000000-0000-0000-0000-000000000003';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=678fef78-0e19-4605-a404-2b7bbd7a1fdf' WHERE id = 'b0000000-0000-0000-0000-000000000004';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=5ddde929-0653-47c7-9f29-751d4d7800ca' WHERE id = 'b0000000-0000-0000-0000-000000000005';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=cf147e9f-8189-40e2-9866-e810eff9ea84' WHERE id = 'b0000000-0000-0000-0000-000000000006';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=02942849-ddc1-465a-86b6-1d1517889943' WHERE id = 'b0000000-0000-0000-0000-000000000007';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=eb76d697-53f7-4b18-9cfe-4cd1294cc735' WHERE id = 'b0000000-0000-0000-0000-000000000008';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=99904d02-b677-4f46-903b-7987418f21f4' WHERE id = 'b0000000-0000-0000-0000-000000000009';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=5e9aad0f-73ab-4b73-99f2-8a96d1115d36' WHERE id = 'b0000000-0000-0000-0000-000000000010';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=cc96b990-ab81-4520-8a9a-6c34abee0e19' WHERE id = 'b0000000-0000-0000-0000-000000000011';
UPDATE members SET photo_url = 'https://origin.thevillagechurch.net/GetImage.ashx?Guid=25bad8d6-cc1a-4c05-a64b-e68b25544632' WHERE id = 'b0000000-0000-0000-0000-000000000012';

-- Member Skills
INSERT INTO member_skills (member_id, skill_id) VALUES
  -- Matt Chandler: Leadership, Teaching, Creative
  ('b0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000003'),
  -- Maddie Clay: Admin, Management
  ('b0000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000004'),
  ('b0000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000005'),
  -- Josh Cockrum: Teaching, Counseling
  ('b0000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000006'),
  -- Kayley Cockrum: Admin, Creative
  ('b0000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000004'),
  ('b0000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000003'),
  -- Frankie Colombo: Home Repair, Tech
  ('b0000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000007'),
  ('b0000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000008'),
  -- Nick Crawford: Leadership, Teaching
  ('b0000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000002'),
  -- Jenni David: Admin, Counseling
  ('b0000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000004'),
  ('b0000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000006'),
  -- Laura Dunnican: Leadership, Admin
  ('b0000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000004'),
  -- Bryan Eaton: Teaching, Leadership
  ('b0000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000001'),
  -- Lindsey Eenigenburg: Management, Creative
  ('b0000000-0000-0000-0000-000000000010', '50000000-0000-0000-0000-000000000005'),
  ('b0000000-0000-0000-0000-000000000010', '50000000-0000-0000-0000-000000000003'),
  -- Justin Elafros: Leadership, Teaching, Management
  ('b0000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000005'),
  -- Rachel Ellis: Admin, Finance
  ('b0000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000004'),
  ('b0000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000009');
