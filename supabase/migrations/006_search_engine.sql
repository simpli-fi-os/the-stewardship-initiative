-- ============================================
-- TSI Search Engine Schema
-- Migration 006: Three-layer hybrid search
-- Layers: PostgreSQL FTS + pgvector semantic + AI query interpretation
-- ============================================

-- 1. EXTENSIONS
-- ============================================

-- Full-text search trigram support (fuzzy matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Vector embeddings for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- 2. RESOURCE CATEGORIES (normalized)
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  parent_group TEXT NOT NULL CHECK (parent_group IN ('resources', 'family-office')),
  color TEXT DEFAULT '#6B7280',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_group ON categories(parent_group);

-- ============================================
-- 3. RESOURCES TABLE (core searchable entity)
-- ============================================

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT, -- 150 char max, for cards

  -- Classification
  type TEXT NOT NULL DEFAULT 'resource' CHECK (type IN (
    'resource', 'provider', 'church', 'nonprofit', 'maker', 'farm', 'education', 'agency', 'government'
  )),

  -- Location
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'TX',
  zip TEXT,
  county TEXT,
  location GEOGRAPHY(POINT, 4326), -- PostGIS point for geo queries
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  service_area_miles INT, -- how far they serve from their location

  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,
  hours JSONB, -- { "mon": "9:00-17:00", "tue": "9:00-17:00", ... }

  -- Media
  logo_url TEXT,
  photo_urls TEXT[] DEFAULT '{}',

  -- Taxonomy
  tags TEXT[] DEFAULT '{}',

  -- Trust & Verification
  verification_level TEXT DEFAULT 'unverified' CHECK (verification_level IN (
    'unverified', 'self_reported', 'community_verified', 'officially_verified'
  )),
  verified_at TIMESTAMPTZ,
  verified_by UUID, -- user who verified
  trust_score NUMERIC(4,2) DEFAULT 0.00, -- 0.00 to 100.00

  -- Ratings
  rating NUMERIC(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,

  -- Ownership
  claimed BOOLEAN DEFAULT FALSE,
  claimed_by UUID REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL, -- optional org link

  -- Monetization
  premium_tier TEXT DEFAULT 'free' CHECK (premium_tier IN ('free', 'seed', 'sprout', 'canopy', 'redwood')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Source tracking
  source TEXT, -- 'manual', 'scrape', 'import', 'api'
  source_url TEXT,
  scraped_at TIMESTAMPTZ,

  -- Search vectors (pre-computed for performance)
  search_vector TSVECTOR, -- FTS vector
  embedding VECTOR(1536), -- OpenAI/Claude embedding for semantic search

  -- Status
  published BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,

  -- Metadata (extensible JSONB for type-specific data)
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. RESOURCE ↔ CATEGORY JOIN TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS resource_categories (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, category_id)
);

-- ============================================
-- 5. REVIEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  helpful_count INT DEFAULT 0,
  verified_visit BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SEARCH ANALYTICS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  query_type TEXT DEFAULT 'text' CHECK (query_type IN ('text', 'semantic', 'ai', 'filter_only')),
  result_count INT DEFAULT 0,
  clicked_resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  clicked_position INT,
  filters JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  response_time_ms INT,
  ip_hash TEXT, -- hashed, not raw IP
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. INDEXES — the search performance layer
-- ============================================

-- FTS: GIN index on pre-computed tsvector
CREATE INDEX idx_resources_search_vector ON resources USING GIN (search_vector);

-- FTS: Trigram indexes for fuzzy matching
CREATE INDEX idx_resources_name_trgm ON resources USING GIN (name gin_trgm_ops);
CREATE INDEX idx_resources_description_trgm ON resources USING GIN (description gin_trgm_ops);

-- Semantic: HNSW index on embedding vector (cosine distance)
-- ef_construction=128 gives good recall; m=16 is standard
CREATE INDEX idx_resources_embedding ON resources USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 128);

-- Geographic: GIST index on PostGIS geography column
CREATE INDEX idx_resources_location ON resources USING GIST (location);

-- Filtering indexes
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_city ON resources(city);
CREATE INDEX idx_resources_state ON resources(state);
CREATE INDEX idx_resources_county ON resources(county);
CREATE INDEX idx_resources_published ON resources(published);
CREATE INDEX idx_resources_featured ON resources(featured);
CREATE INDEX idx_resources_verification ON resources(verification_level);
CREATE INDEX idx_resources_premium ON resources(premium_tier);
CREATE INDEX idx_resources_rating ON resources(rating DESC);
CREATE INDEX idx_resources_trust_score ON resources(trust_score DESC);
CREATE INDEX idx_resources_tags ON resources USING GIN (tags);
CREATE INDEX idx_resources_slug ON resources(slug);

-- Join table indexes
CREATE INDEX idx_resource_categories_resource ON resource_categories(resource_id);
CREATE INDEX idx_resource_categories_category ON resource_categories(category_id);

-- Reviews indexes
CREATE INDEX idx_reviews_resource ON reviews(resource_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Search analytics indexes
CREATE INDEX idx_search_queries_text ON search_queries(query_text);
CREATE INDEX idx_search_queries_created ON search_queries(created_at DESC);

-- ============================================
-- 8. TRIGGERS
-- ============================================

-- Auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION resources_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'D') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resources_search_vector
  BEFORE INSERT OR UPDATE OF name, short_description, description, city, tags
  ON resources
  FOR EACH ROW
  EXECUTE FUNCTION resources_search_vector_update();

-- Auto-update PostGIS location from lat/lng
CREATE OR REPLACE FUNCTION resources_location_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resources_location
  BEFORE INSERT OR UPDATE OF lat, lng
  ON resources
  FOR EACH ROW
  EXECUTE FUNCTION resources_location_update();

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_resources
  BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_reviews
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-recompute rating on review insert/update/delete
CREATE OR REPLACE FUNCTION recompute_resource_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_id UUID;
BEGIN
  target_id := COALESCE(NEW.resource_id, OLD.resource_id);
  UPDATE resources SET
    rating = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE resource_id = target_id AND published = true
    ), 0),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE resource_id = target_id AND published = true
    )
  WHERE id = target_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recompute_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION recompute_resource_rating();

-- ============================================
-- 9. SEARCH RPC FUNCTIONS
-- ============================================

-- Layer 1: Full-Text Search with ranking
CREATE OR REPLACE FUNCTION search_resources_fts(
  search_query TEXT,
  filter_type TEXT DEFAULT NULL,
  filter_city TEXT DEFAULT NULL,
  filter_state TEXT DEFAULT NULL,
  filter_county TEXT DEFAULT NULL,
  filter_category_slug TEXT DEFAULT NULL,
  filter_verification TEXT DEFAULT NULL,
  result_limit INT DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  slug TEXT,
  short_description TEXT,
  type TEXT,
  city TEXT,
  state TEXT,
  county TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rating NUMERIC,
  review_count INT,
  verification_level TEXT,
  trust_score NUMERIC,
  premium_tier TEXT,
  tags TEXT[],
  logo_url TEXT,
  photo_urls TEXT[],
  website TEXT,
  phone TEXT,
  hours JSONB,
  featured BOOLEAN,
  fts_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id, r.name, r.slug, r.short_description, r.type,
    r.city, r.state, r.county, r.lat, r.lng,
    r.rating, r.review_count, r.verification_level, r.trust_score,
    r.premium_tier, r.tags, r.logo_url, r.photo_urls,
    r.website, r.phone, r.hours, r.featured,
    ts_rank_cd(r.search_vector, websearch_to_tsquery('english', search_query), 32) AS fts_rank
  FROM resources r
  LEFT JOIN resource_categories rc ON rc.resource_id = r.id
  LEFT JOIN categories c ON c.id = rc.category_id
  WHERE r.published = true
    AND r.search_vector @@ websearch_to_tsquery('english', search_query)
    AND (filter_type IS NULL OR r.type = filter_type)
    AND (filter_city IS NULL OR r.city ILIKE '%' || filter_city || '%')
    AND (filter_state IS NULL OR r.state = filter_state)
    AND (filter_county IS NULL OR r.county = filter_county)
    AND (filter_category_slug IS NULL OR c.slug = filter_category_slug)
    AND (filter_verification IS NULL OR r.verification_level = filter_verification)
  ORDER BY fts_rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Layer 1b: Trigram fuzzy search (fallback when FTS returns nothing)
CREATE OR REPLACE FUNCTION search_resources_trigram(
  search_term TEXT,
  filter_type TEXT DEFAULT NULL,
  similarity_threshold REAL DEFAULT 0.15,
  result_limit INT DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  slug TEXT,
  short_description TEXT,
  type TEXT,
  city TEXT,
  state TEXT,
  county TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rating NUMERIC,
  review_count INT,
  verification_level TEXT,
  trust_score NUMERIC,
  premium_tier TEXT,
  tags TEXT[],
  logo_url TEXT,
  photo_urls TEXT[],
  website TEXT,
  phone TEXT,
  hours JSONB,
  featured BOOLEAN,
  trigram_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id, r.name, r.slug, r.short_description, r.type,
    r.city, r.state, r.county, r.lat, r.lng,
    r.rating, r.review_count, r.verification_level, r.trust_score,
    r.premium_tier, r.tags, r.logo_url, r.photo_urls,
    r.website, r.phone, r.hours, r.featured,
    GREATEST(
      similarity(r.name, search_term),
      similarity(COALESCE(r.description, ''), search_term) * 0.6
    ) AS trigram_score
  FROM resources r
  WHERE r.published = true
    AND (
      similarity(r.name, search_term) > similarity_threshold
      OR similarity(COALESCE(r.description, ''), search_term) > similarity_threshold
    )
    AND (filter_type IS NULL OR r.type = filter_type)
  ORDER BY trigram_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Layer 2: Semantic vector search
CREATE OR REPLACE FUNCTION search_resources_semantic(
  query_embedding VECTOR(1536),
  filter_type TEXT DEFAULT NULL,
  filter_city TEXT DEFAULT NULL,
  filter_state TEXT DEFAULT NULL,
  similarity_threshold DOUBLE PRECISION DEFAULT 0.5,
  result_limit INT DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  slug TEXT,
  short_description TEXT,
  type TEXT,
  city TEXT,
  state TEXT,
  county TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rating NUMERIC,
  review_count INT,
  verification_level TEXT,
  trust_score NUMERIC,
  premium_tier TEXT,
  tags TEXT[],
  logo_url TEXT,
  photo_urls TEXT[],
  website TEXT,
  phone TEXT,
  hours JSONB,
  featured BOOLEAN,
  semantic_score DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id, r.name, r.slug, r.short_description, r.type,
    r.city, r.state, r.county, r.lat, r.lng,
    r.rating, r.review_count, r.verification_level, r.trust_score,
    r.premium_tier, r.tags, r.logo_url, r.photo_urls,
    r.website, r.phone, r.hours, r.featured,
    1 - (r.embedding <=> query_embedding) AS semantic_score
  FROM resources r
  WHERE r.published = true
    AND r.embedding IS NOT NULL
    AND 1 - (r.embedding <=> query_embedding) > similarity_threshold
    AND (filter_type IS NULL OR r.type = filter_type)
    AND (filter_city IS NULL OR r.city ILIKE '%' || filter_city || '%')
    AND (filter_state IS NULL OR r.state = filter_state)
  ORDER BY r.embedding <=> query_embedding
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Geographic radius search
CREATE OR REPLACE FUNCTION search_resources_nearby(
  search_lat DOUBLE PRECISION,
  search_lng DOUBLE PRECISION,
  radius_miles DOUBLE PRECISION DEFAULT 25,
  filter_type TEXT DEFAULT NULL,
  filter_category_slug TEXT DEFAULT NULL,
  result_limit INT DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  slug TEXT,
  short_description TEXT,
  type TEXT,
  city TEXT,
  state TEXT,
  county TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rating NUMERIC,
  review_count INT,
  verification_level TEXT,
  trust_score NUMERIC,
  premium_tier TEXT,
  tags TEXT[],
  logo_url TEXT,
  photo_urls TEXT[],
  website TEXT,
  phone TEXT,
  hours JSONB,
  featured BOOLEAN,
  distance_miles DOUBLE PRECISION
) AS $$
DECLARE
  radius_meters DOUBLE PRECISION := radius_miles * 1609.344;
  search_point GEOGRAPHY := ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography;
BEGIN
  RETURN QUERY
  SELECT
    r.id, r.name, r.slug, r.short_description, r.type,
    r.city, r.state, r.county, r.lat, r.lng,
    r.rating, r.review_count, r.verification_level, r.trust_score,
    r.premium_tier, r.tags, r.logo_url, r.photo_urls,
    r.website, r.phone, r.hours, r.featured,
    ST_Distance(r.location, search_point) / 1609.344 AS distance_miles
  FROM resources r
  LEFT JOIN resource_categories rc ON rc.resource_id = r.id
  LEFT JOIN categories c ON c.id = rc.category_id
  WHERE r.published = true
    AND r.location IS NOT NULL
    AND ST_DWithin(r.location, search_point, radius_meters)
    AND (filter_type IS NULL OR r.type = filter_type)
    AND (filter_category_slug IS NULL OR c.slug = filter_category_slug)
  ORDER BY ST_Distance(r.location, search_point)
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Facet aggregation function
CREATE OR REPLACE FUNCTION get_search_facets(
  search_query TEXT DEFAULT NULL,
  filter_type TEXT DEFAULT NULL,
  filter_state TEXT DEFAULT NULL,
  filter_county TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH filtered AS (
    SELECT r.*
    FROM resources r
    WHERE r.published = true
      AND (search_query IS NULL OR r.search_vector @@ websearch_to_tsquery('english', search_query))
      AND (filter_type IS NULL OR r.type = filter_type)
      AND (filter_state IS NULL OR r.state = filter_state)
      AND (filter_county IS NULL OR r.county = filter_county)
  ),
  type_facets AS (
    SELECT jsonb_object_agg(type, cnt) AS data
    FROM (SELECT type, COUNT(*) AS cnt FROM filtered GROUP BY type ORDER BY cnt DESC) t
  ),
  state_facets AS (
    SELECT jsonb_object_agg(state, cnt) AS data
    FROM (SELECT state, COUNT(*) AS cnt FROM filtered GROUP BY state ORDER BY cnt DESC LIMIT 20) t
  ),
  county_facets AS (
    SELECT jsonb_object_agg(county, cnt) AS data
    FROM (SELECT county, COUNT(*) AS cnt FROM filtered WHERE county IS NOT NULL GROUP BY county ORDER BY cnt DESC LIMIT 20) t
  ),
  verification_facets AS (
    SELECT jsonb_object_agg(verification_level, cnt) AS data
    FROM (SELECT verification_level, COUNT(*) AS cnt FROM filtered GROUP BY verification_level ORDER BY cnt DESC) t
  ),
  category_facets AS (
    SELECT jsonb_object_agg(c.slug, cnt) AS data
    FROM (
      SELECT c.slug, COUNT(*) AS cnt
      FROM filtered f
      JOIN resource_categories rc ON rc.resource_id = f.id
      JOIN categories c ON c.id = rc.category_id
      GROUP BY c.slug
      ORDER BY cnt DESC
      LIMIT 30
    ) sub
    JOIN categories c ON c.slug = sub.slug
  )
  SELECT jsonb_build_object(
    'types', COALESCE((SELECT data FROM type_facets), '{}'::jsonb),
    'states', COALESCE((SELECT data FROM state_facets), '{}'::jsonb),
    'counties', COALESCE((SELECT data FROM county_facets), '{}'::jsonb),
    'verification', COALESCE((SELECT data FROM verification_facets), '{}'::jsonb),
    'categories', COALESCE((SELECT data FROM category_facets), '{}'::jsonb),
    'total', (SELECT COUNT(*) FROM filtered)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Resources: public read published only
CREATE POLICY "Public read published resources" ON resources
  FOR SELECT USING (published = true);

-- Resources: service role full access
CREATE POLICY "Service manages resources" ON resources
  FOR ALL USING (auth.role() = 'service_role');

-- Resource categories: public read
CREATE POLICY "Public read resource_categories" ON resource_categories
  FOR SELECT USING (true);

-- Reviews: public read published only
CREATE POLICY "Public read published reviews" ON reviews
  FOR SELECT USING (published = true);

-- Reviews: authenticated users can insert
CREATE POLICY "Auth insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Search queries: service role only (analytics)
CREATE POLICY "Service manages search_queries" ON search_queries
  FOR ALL USING (auth.role() = 'service_role');

-- Search queries: anon can insert (tracking)
CREATE POLICY "Anon insert search_queries" ON search_queries
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 11. SEED CATEGORIES
-- ============================================

INSERT INTO categories (slug, name, description, icon, parent_group, color, sort_order) VALUES
  -- Community Resources
  ('food-assistance', 'Food Assistance', 'Food banks, pantries, meal programs', 'Apple', 'resources', '#E8B442', 1),
  ('housing-shelter', 'Housing & Shelter', 'Emergency shelter, transitional housing, affordable housing', 'Home', 'resources', '#D4A574', 2),
  ('medical-health', 'Medical & Health', 'Free clinics, health screenings, prescription assistance', 'Stethoscope', 'resources', '#E74C3C', 3),
  ('mental-health', 'Mental Health & Counseling', 'Counseling, crisis support, substance abuse treatment', 'Heart', 'resources', '#9B59B6', 4),
  ('legal-aid', 'Legal Aid', 'Free legal services, immigration support, family law', 'Scale', 'resources', '#3498DB', 5),
  ('financial-assistance', 'Financial Assistance', 'Emergency financial aid, utility help, debt counseling', 'DollarSign', 'resources', '#27AE60', 6),
  ('clothing-household', 'Clothing & Household', 'Clothing banks, household goods, furniture', 'ShoppingBag', 'resources', '#E67E22', 7),
  ('childcare-youth', 'Childcare & Youth', 'Childcare assistance, youth programs, after-school', 'Users', 'resources', '#F39C12', 8),
  ('senior-services', 'Senior Services', 'Senior centers, meal programs, in-home care', 'Users2', 'resources', '#95A5A6', 9),
  ('disability-services', 'Disability Services', 'Disability support, accessibility, assistive equipment', 'Accessibility', 'resources', '#1ABC9C', 10),
  ('veteran-services', 'Veteran Services', 'Veteran benefits, employment, transition assistance', 'Shield', 'resources', '#34495E', 11),
  ('employment-training', 'Employment & Job Training', 'Job training, workforce development, resume help', 'Briefcase', 'resources', '#16A085', 12),
  ('education-tutoring', 'Education & Tutoring', 'Tutoring, homework help, academic programs', 'BookOpen', 'resources', '#2980B9', 13),
  ('transportation', 'Transportation', 'Transit assistance, medical transport, ride services', 'Car', 'resources', '#8E44AD', 14),
  ('utilities-assistance', 'Utilities Assistance', 'Electric, gas, water, internet assistance', 'Zap', 'resources', '#F1C40F', 15),
  ('crisis-emergency', 'Crisis & Emergency', 'Crisis hotlines, emergency response, disaster relief', 'AlertTriangle', 'resources', '#C0392B', 16),
  ('substance-recovery', 'Substance Recovery', 'Addiction treatment, recovery, support groups', 'Leaf', 'resources', '#16A085', 17),
  ('domestic-violence', 'Domestic Violence Support', 'DV shelters, counseling, legal advocacy', 'Heart', 'resources', '#E74C3C', 18),
  ('immigration-services', 'Immigration Services', 'Immigration legal, citizenship, translation', 'Globe', 'resources', '#3498DB', 19),
  ('faith-based-services', 'Faith-Based Services', 'Churches, faith orgs, spiritual counseling', 'Church', 'resources', '#8E44AD', 20),
  -- Family Office Providers
  ('financial-advisors', 'Financial Advisors', 'Fee-only financial planning, investment management', 'TrendingUp', 'family-office', '#27AE60', 21),
  ('tax-professionals', 'Tax Professionals', 'CPA firms, tax preparation, tax strategy', 'Receipt', 'family-office', '#2980B9', 22),
  ('insurance-agents', 'Insurance Agents', 'Life, health, property and casualty insurance', 'Shield', 'family-office', '#E74C3C', 23),
  ('estate-planning', 'Estate Planning Attorneys', 'Wills, trusts, probate, asset protection', 'FileText', 'family-office', '#34495E', 24),
  ('family-law', 'Family Law Attorneys', 'Divorce, custody, prenuptials', 'Users', 'family-office', '#9B59B6', 25),
  ('real-estate-agents', 'Real Estate Agents', 'Residential sales, purchases, investment property', 'Home', 'family-office', '#D4A574', 26),
  ('mortgage-brokers', 'Mortgage Brokers', 'Mortgage origination, refinancing, home loans', 'DollarSign', 'family-office', '#F39C12', 27),
  ('bookkeepers-accountants', 'Bookkeepers & Accountants', 'Small business accounting, payroll', 'BarChart3', 'family-office', '#16A085', 28),
  ('business-coaches', 'Business Coaches', 'Business strategy, growth coaching, consulting', 'Briefcase', 'family-office', '#3498DB', 29),
  ('home-repair-contractors', 'Home Repair & Contractors', 'General contracting, renovations, repairs', 'Hammer', 'family-office', '#D4A574', 30),
  ('fitness-wellness', 'Fitness & Wellness', 'Personal training, wellness, health services', 'Activity', 'family-office', '#1ABC9C', 31)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 12. SEED RESOURCES (Denton County)
-- ============================================

INSERT INTO resources (name, slug, description, short_description, type, city, state, county, lat, lng, phone, website, tags, verification_level, source) VALUES
  ('Denton Community Food Center', 'denton-community-food-center', 'The Denton Community Food Center provides groceries to families in need. Open to all Denton County residents, no documentation required. Serves over 1,000 families per month with fresh produce, proteins, and pantry staples.', 'Free groceries for Denton County families, no documentation required.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2148, -97.1331, '940-382-0807', 'https://dentonfoodcenter.com', ARRAY['food', 'pantry', 'groceries', 'families'], 'community_verified', 'manual'),

  ('Salvation Army Denton', 'salvation-army-denton', 'The Salvation Army Denton provides emergency assistance including food, rent, and utility assistance. Offers a food pantry, hot meals, and seasonal programs for children and families in crisis.', 'Emergency food, rent, and utility assistance for Denton families.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2169, -97.1360, '940-566-3800', 'https://salvationarmyntx.org', ARRAY['emergency', 'food', 'rent', 'utilities', 'families'], 'officially_verified', 'manual'),

  ('Denton County MHMR Center', 'denton-county-mhmr', 'Denton County MHMR provides mental health and intellectual disability services. Offers counseling, psychiatric care, crisis intervention, and substance use treatment on a sliding fee scale.', 'Sliding-scale mental health, crisis, and substance use services.', 'government', 'Denton', 'TX', 'Denton', 33.2200, -97.1405, '940-381-5000', 'https://dentonmhmr.org', ARRAY['mental-health', 'counseling', 'crisis', 'substance-abuse', 'sliding-scale'], 'officially_verified', 'manual'),

  ('United Way of Denton County', 'united-way-denton', 'United Way of Denton County connects residents to community resources through the 211 helpline and direct programs addressing financial stability, education, and health.', 'Resource navigation via 211, financial stability, education programs.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2148, -97.1331, '940-566-5851', 'https://unitedwaydenton.org', ARRAY['referral', 'financial-aid', 'education', 'health', '211'], 'officially_verified', 'manual'),

  ('Denton Affordable Housing Corporation', 'denton-affordable-housing', 'DAHC develops and manages affordable housing units in Denton. Provides rental assistance, home buyer education, and maintains income-qualified rental properties throughout the city.', 'Affordable housing, rental assistance, and homebuyer education.', 'government', 'Denton', 'TX', 'Denton', 33.2175, -97.1360, '940-349-7732', 'https://dentonaffordablehousing.org', ARRAY['housing', 'rental-assistance', 'homebuyer', 'affordable'], 'officially_verified', 'manual'),

  ('Monsignor King Outreach Center', 'monsignor-king-outreach', 'Catholic Charities outreach center providing comprehensive services including emergency financial assistance, food pantry, immigration legal services, and employment support.', 'Emergency assistance, food pantry, immigration legal, and job support.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2210, -97.1375, '940-243-2990', 'https://ccdenton.org', ARRAY['emergency', 'food', 'immigration', 'employment', 'catholic-charities'], 'officially_verified', 'manual'),

  ('Denton County Veterans Coalition', 'denton-county-veterans', 'Coalition of veteran service organizations coordinating support for Denton County veterans. Connects veterans with benefits, housing, employment, and mental health services.', 'Veteran benefits navigation, housing, employment, and mental health.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2148, -97.1331, '940-349-2890', 'https://dentoncountyveterans.org', ARRAY['veterans', 'benefits', 'housing', 'employment', 'mental-health'], 'community_verified', 'manual'),

  ('Giving Grace Transportation', 'giving-grace-transportation', 'Free transportation service for seniors and disabled residents in Denton County. Provides rides to medical appointments, grocery stores, and essential services.', 'Free rides for seniors and disabled residents to medical and essential services.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2120, -97.1350, '940-300-1892', NULL, ARRAY['transportation', 'seniors', 'disabled', 'medical', 'free'], 'self_reported', 'manual'),

  ('Fred Moore Day Nursery', 'fred-moore-day-nursery', 'Affordable childcare and early education for low-income families in Denton. Full-day programs for children ages 6 weeks to 5 years with sliding-scale fees.', 'Affordable childcare ages 6 weeks to 5 years, sliding-scale fees.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2150, -97.1310, '940-382-0543', 'https://fredmoore.org', ARRAY['childcare', 'early-education', 'sliding-scale', 'low-income'], 'officially_verified', 'manual'),

  ('Denton County Friends of the Family', 'friends-of-the-family', 'Comprehensive domestic violence and sexual assault services including emergency shelter, counseling, legal advocacy, and a 24-hour crisis hotline.', '24-hour DV/SA crisis line, shelter, counseling, and legal advocacy.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2180, -97.1340, '940-382-7273', 'https://dcfof.org', ARRAY['domestic-violence', 'sexual-assault', 'shelter', 'crisis', 'counseling'], 'officially_verified', 'manual'),

  -- Family Office Providers
  ('Simpli-FI Alpha LLC', 'simpli-fi-alpha', 'Fee-only Registered Investment Adviser specializing in systematic volatility strategies and antifragile portfolio design for first responders and blue-collar families.', 'Fee-only RIA specializing in volatility strategies for first responders.', 'provider', 'Denton', 'TX', 'Denton', 33.2148, -97.1331, NULL, 'https://simpli-fi-alpha.com', ARRAY['financial-advisor', 'RIA', 'investing', 'first-responders', 'fee-only'], 'officially_verified', 'manual'),

  ('Denton Family Dentistry', 'denton-family-dentistry', 'Full-service family dental practice offering preventive care, cleanings, restorations, and cosmetic dentistry. Accepts most insurance plans and offers affordable self-pay rates.', 'Full-service family dentistry with affordable self-pay options.', 'provider', 'Denton', 'TX', 'Denton', 33.2180, -97.1315, '940-383-3233', NULL, ARRAY['dentist', 'dental', 'family', 'insurance', 'affordable'], 'self_reported', 'manual'),

  ('First Baptist Church Denton', 'first-baptist-denton', 'Historic church offering worship services, community outreach, food pantry, benevolence fund, counseling referrals, and weekly community meals.', 'Worship, food pantry, benevolence fund, and community meals.', 'church', 'Denton', 'TX', 'Denton', 33.2190, -97.1330, '940-382-7126', 'https://fbcdenton.com', ARRAY['church', 'food-pantry', 'counseling', 'community-meals', 'benevolence'], 'officially_verified', 'manual'),

  ('Grace Temple Church', 'grace-temple-church', 'Community church providing weekly worship services, food distribution on Saturdays, youth mentoring programs, and financial literacy workshops.', 'Worship, Saturday food distribution, youth mentoring, financial literacy.', 'church', 'Denton', 'TX', 'Denton', 33.2160, -97.1355, '940-387-3321', NULL, ARRAY['church', 'food', 'youth', 'mentoring', 'financial-literacy'], 'self_reported', 'manual'),

  ('Habitat for Humanity Denton', 'habitat-denton', 'Habitat for Humanity Denton County builds affordable homes and operates a ReStore. Provides homeownership opportunities through sweat equity and zero-interest mortgages.', 'Affordable homeownership, ReStore, and community building programs.', 'nonprofit', 'Denton', 'TX', 'Denton', 33.2100, -97.1300, '940-484-1housed', 'https://habitatdenton.org', ARRAY['housing', 'homeownership', 'restore', 'affordable', 'construction'], 'officially_verified', 'manual')
ON CONFLICT (slug) DO NOTHING;

-- Link seed resources to categories
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'denton-community-food-center' AND c.slug = 'food-assistance'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'salvation-army-denton' AND c.slug = 'food-assistance'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'salvation-army-denton' AND c.slug = 'financial-assistance'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'denton-county-mhmr' AND c.slug = 'mental-health'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'denton-county-mhmr' AND c.slug = 'substance-recovery'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'united-way-denton' AND c.slug = 'financial-assistance'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'denton-affordable-housing' AND c.slug = 'housing-shelter'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'monsignor-king-outreach' AND c.slug = 'food-assistance'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'monsignor-king-outreach' AND c.slug = 'immigration-services'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'denton-county-veterans' AND c.slug = 'veteran-services'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'giving-grace-transportation' AND c.slug = 'transportation'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'fred-moore-day-nursery' AND c.slug = 'childcare-youth'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'friends-of-the-family' AND c.slug = 'domestic-violence'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'friends-of-the-family' AND c.slug = 'crisis-emergency'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'simpli-fi-alpha' AND c.slug = 'financial-advisors'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'denton-family-dentistry' AND c.slug = 'fitness-wellness'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'first-baptist-denton' AND c.slug = 'faith-based-services'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'first-baptist-denton' AND c.slug = 'food-assistance'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'grace-temple-church' AND c.slug = 'faith-based-services'
ON CONFLICT DO NOTHING;
INSERT INTO resource_categories (resource_id, category_id)
SELECT r.id, c.id FROM resources r, categories c WHERE r.slug = 'habitat-denton' AND c.slug = 'housing-shelter'
ON CONFLICT DO NOTHING;
