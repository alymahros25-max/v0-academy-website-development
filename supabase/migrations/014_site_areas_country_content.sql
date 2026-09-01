-- =============================================================================
-- 014: Isolate the main site and country landing pages
-- =============================================================================
-- The global site and each country are separate content areas. Existing tables
-- remain untouched until an explicit, reviewed data migration is performed.

CREATE TABLE IF NOT EXISTS site_areas (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  area_type TEXT NOT NULL CHECK (area_type IN ('global', 'country')),
  country_code TEXT,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  name_fr TEXT,
  currency_code TEXT,
  currency_symbol TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT site_areas_country_fields_check CHECK (
    (area_type = 'global' AND country_code IS NULL) OR
    (area_type = 'country' AND country_code IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_site_areas_country_code
  ON site_areas(country_code) WHERE country_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS area_content (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL REFERENCES site_areas(id) ON DELETE CASCADE,
  content_key TEXT NOT NULL,
  content_ar TEXT,
  content_en TEXT,
  content_fr TEXT,
  content_type TEXT NOT NULL DEFAULT 'text',
  section TEXT NOT NULL DEFAULT 'general',
  href TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, content_key)
);

CREATE INDEX IF NOT EXISTS idx_area_content_area_section
  ON area_content(area_id, section, is_active, sort_order);

CREATE TABLE IF NOT EXISTS area_packages (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL REFERENCES site_areas(id) ON DELETE CASCADE,
  program TEXT NOT NULL CHECK (program IN ('quran', 'arabic', 'other')),
  package_key TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  name_fr TEXT,
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  currency_code TEXT NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'month',
  sessions_per_month INTEGER,
  features_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  features_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  features_fr JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, package_key)
);

CREATE INDEX IF NOT EXISTS idx_area_packages_public
  ON area_packages(area_id, program, is_active, sort_order);

CREATE TABLE IF NOT EXISTS area_faq_items (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL REFERENCES site_areas(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  question_en TEXT,
  question_fr TEXT,
  answer_ar TEXT NOT NULL,
  answer_en TEXT,
  answer_fr TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, question_key)
);

CREATE INDEX IF NOT EXISTS idx_area_faq_public
  ON area_faq_items(area_id, is_active, sort_order);

CREATE TABLE IF NOT EXISTS area_links (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL REFERENCES site_areas(id) ON DELETE CASCADE,
  link_key TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_en TEXT,
  label_fr TEXT,
  href TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'internal',
  is_external BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, link_key)
);

CREATE INDEX IF NOT EXISTS idx_area_links_public
  ON area_links(area_id, is_active, sort_order);

INSERT INTO site_areas (slug, area_type, country_code, name_ar, name_en, currency_code, currency_symbol)
VALUES
  ('global', 'global', NULL, 'الموقع الرئيسي', 'Main site', 'USD', '$'),
  ('australia', 'country', 'AU', 'أستراليا', 'Australia', 'AUD', 'A$'),
  ('canada', 'country', 'CA', 'كندا', 'Canada', 'CAD', 'C$'),
  ('germany', 'country', 'DE', 'ألمانيا', 'Germany', 'EUR', '€'),
  ('saudi-arabia', 'country', 'SA', 'السعودية', 'Saudi Arabia', 'SAR', 'ر.س'),
  ('united-arab-emirates', 'country', 'AE', 'الإمارات العربية المتحدة', 'United Arab Emirates', 'AED', 'د.إ'),
  ('united-kingdom', 'country', 'GB', 'المملكة المتحدة', 'United Kingdom', 'GBP', '£'),
  ('united-states', 'country', 'US', 'الولايات المتحدة', 'United States', 'USD', '$')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE site_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active site areas" ON site_areas;
CREATE POLICY "Public can read active site areas" ON site_areas
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can read active area content" ON area_content;
CREATE POLICY "Public can read active area content" ON area_content
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can read active area packages" ON area_packages;
CREATE POLICY "Public can read active area packages" ON area_packages
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can read active area faq" ON area_faq_items;
CREATE POLICY "Public can read active area faq" ON area_faq_items
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can read active area links" ON area_links;
CREATE POLICY "Public can read active area links" ON area_links
  FOR SELECT USING (is_active = TRUE);

-- Administrative writes are guarded by the same admin email allow-list used by FAQ.
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['site_areas','area_content','area_packages','area_faq_items','area_links'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'Admins can manage ' || table_name, table_name);
    EXECUTE format($policy$
      CREATE POLICY %I ON %I FOR ALL
      USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE lower(au.email) = lower(auth.jwt() ->> 'email')))
      WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE lower(au.email) = lower(auth.jwt() ->> 'email')))
    $policy$, 'Admins can manage ' || table_name, table_name);
  END LOOP;
END $$;
