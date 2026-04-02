-- ============================================
-- TSI Articles & Analytics Schema
-- Migration 003: Blog content engine + directory analytics
-- ============================================

-- 1. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'The Stewardship Initiative',
  category TEXT DEFAULT 'stewardship',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  og_image_url TEXT,
  reading_time_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS directory_views (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  member_id UUID REFERENCES members(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'search', 'filter', 'contact_click', 'profile_view', 'request_service')),
  metadata JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_directory_views_org ON directory_views(org_id);
CREATE INDEX IF NOT EXISTS idx_directory_views_created ON directory_views(created_at);

-- 4. ROW LEVEL SECURITY
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (published = true);

CREATE POLICY "Service role manages articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE directory_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages analytics" ON directory_views
  FOR ALL USING (auth.role() = 'service_role');

-- 5. UPDATED_AT TRIGGER for articles
CREATE TRIGGER set_updated_at_articles
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
