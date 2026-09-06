-- =============================================================================
-- 018: Country Content Enrichment
-- Adds area-scoped visual identity, city coverage, and IANA timezones only.
-- Pricing, contact links, ratings, testimonials, and payment settings are untouched.
-- =============================================================================

CREATE TABLE IF NOT EXISTS area_themes (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL UNIQUE REFERENCES site_areas(id) ON DELETE CASCADE,
  theme_name_ar TEXT NOT NULL,
  theme_name_en TEXT,
  primary_color TEXT NOT NULL CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  secondary_color TEXT NOT NULL CHECK (secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
  accent_color TEXT NOT NULL CHECK (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  background_color TEXT NOT NULL CHECK (background_color ~ '^#[0-9A-Fa-f]{6}$'),
  text_color TEXT NOT NULL CHECK (text_color ~ '^#[0-9A-Fa-f]{6}$'),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS area_cities (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL REFERENCES site_areas(id) ON DELETE CASCADE,
  city_key TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  region_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, city_key)
);

CREATE INDEX IF NOT EXISTS idx_area_cities_public
  ON area_cities(area_id, is_active, sort_order);

CREATE TABLE IF NOT EXISTS area_timezones (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL REFERENCES site_areas(id) ON DELETE CASCADE,
  timezone_name TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, timezone_name)
);

CREATE INDEX IF NOT EXISTS idx_area_timezones_public
  ON area_timezones(area_id, is_active, sort_order);

ALTER TABLE area_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_timezones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active area themes" ON area_themes;
CREATE POLICY "Public can read active area themes" ON area_themes
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can read active area cities" ON area_cities;
CREATE POLICY "Public can read active area cities" ON area_cities
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can read active area timezones" ON area_timezones;
CREATE POLICY "Public can read active area timezones" ON area_timezones
  FOR SELECT USING (is_active = TRUE);

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['area_themes', 'area_cities', 'area_timezones'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'Admins can manage ' || table_name, table_name);
    EXECUTE format($policy$
      CREATE POLICY %I ON %I FOR ALL
      USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE lower(au.email) = lower(auth.jwt() ->> 'email')))
      WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE lower(au.email) = lower(auth.jwt() ->> 'email')))
    $policy$, 'Admins can manage ' || table_name, table_name);
  END LOOP;
END $$;

-- Visual identity: palette and neutral theme label only.
INSERT INTO area_themes (
  area_id, theme_name_ar, theme_name_en,
  primary_color, secondary_color, accent_color, background_color, text_color
)
SELECT id, values.theme_name_ar, values.theme_name_en,
       values.primary_color, values.secondary_color, values.accent_color,
       values.background_color, values.text_color
FROM site_areas
JOIN (VALUES
  ('saudi-arabia', 'الهوية الخضراء والذهبية', 'Green and gold identity', '#004225', '#FFD700', '#C60C30', '#F5F1E8', '#1A1A1A'),
  ('united-arab-emirates', 'هوية عصرية مستلهمة من الإمارات', 'Modern UAE-inspired identity', '#00A3E0', '#FF0000', '#FFF000', '#F0F8FF', '#1A1A1A'),
  ('canada', 'هوية كندية واضحة ومتوازنة', 'Clear and balanced Canadian identity', '#D80621', '#111111', '#FFFFFF', '#F7F7F7', '#1A1A1A'),
  ('australia', 'هوية دافئة مستلهمة من أستراليا', 'Warm Australian-inspired identity', '#FFD700', '#FF6B35', '#004E89', '#FFFBF0', '#1A1A1A'),
  ('united-kingdom', 'هوية بريطانية كلاسيكية', 'Classic British identity', '#012169', '#CE1126', '#FFFFFF', '#F5F5F5', '#1A1A1A'),
  ('united-states', 'هوية أمريكية ديناميكية', 'Dynamic American identity', '#0051BA', '#ED3935', '#FFFFFF', '#F8F9FA', '#1A1A1A'),
  ('germany', 'هوية ألمانية منظمة', 'Structured German identity', '#000000', '#DD0000', '#FFCC00', '#F5F5F5', '#1A1A1A')
) AS values(slug, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color)
  ON site_areas.slug = values.slug
ON CONFLICT (area_id) DO NOTHING;

-- City names only. No student, teacher, review, or performance claims are seeded.
INSERT INTO area_cities (area_id, city_key, name_ar, name_en, region_name, sort_order)
SELECT area.id, city.city_key, city.name_ar, city.name_en, city.region_name, city.sort_order
FROM site_areas area
JOIN (VALUES
  ('saudi-arabia', 'riyadh', 'الرياض', 'Riyadh', 'منطقة الرياض', 10),
  ('saudi-arabia', 'jeddah', 'جدة', 'Jeddah', 'منطقة مكة المكرمة', 20),
  ('saudi-arabia', 'dammam', 'الدمام', 'Dammam', 'المنطقة الشرقية', 30),
  ('saudi-arabia', 'makkah', 'مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة', 40),
  ('saudi-arabia', 'madinah', 'المدينة المنورة', 'Madinah', 'منطقة المدينة المنورة', 50),
  ('united-arab-emirates', 'dubai', 'دبي', 'Dubai', 'دبي', 10),
  ('united-arab-emirates', 'abu-dhabi', 'أبوظبي', 'Abu Dhabi', 'أبوظبي', 20),
  ('united-arab-emirates', 'sharjah', 'الشارقة', 'Sharjah', 'الشارقة', 30),
  ('united-arab-emirates', 'al-ain', 'العين', 'Al Ain', 'أبوظبي', 40),
  ('united-arab-emirates', 'ajman', 'عجمان', 'Ajman', 'عجمان', 50),
  ('united-arab-emirates', 'ras-al-khaimah', 'رأس الخيمة', 'Ras Al Khaimah', 'رأس الخيمة', 60),
  ('united-arab-emirates', 'fujairah', 'الفجيرة', 'Fujairah', 'الفجيرة', 70),
  ('united-arab-emirates', 'umm-al-quwain', 'أم القيوين', 'Umm Al Quwain', 'أم القيوين', 80),
  ('canada', 'toronto', 'تورونتو', 'Toronto', 'Ontario', 10),
  ('canada', 'vancouver', 'فانكوفر', 'Vancouver', 'British Columbia', 20),
  ('canada', 'calgary', 'كالجاري', 'Calgary', 'Alberta', 30),
  ('canada', 'montreal', 'مونتريال', 'Montreal', 'Quebec', 40),
  ('canada', 'edmonton', 'إدمونتون', 'Edmonton', 'Alberta', 50),
  ('australia', 'sydney', 'سيدني', 'Sydney', 'New South Wales', 10),
  ('australia', 'melbourne', 'ملبورن', 'Melbourne', 'Victoria', 20),
  ('australia', 'brisbane', 'بريسبان', 'Brisbane', 'Queensland', 30),
  ('australia', 'perth', 'بيرث', 'Perth', 'Western Australia', 40),
  ('australia', 'adelaide', 'أديلايد', 'Adelaide', 'South Australia', 50),
  ('united-kingdom', 'london', 'لندن', 'London', 'England', 10),
  ('united-kingdom', 'manchester', 'مانشستر', 'Manchester', 'England', 20),
  ('united-kingdom', 'birmingham', 'برمنغهام', 'Birmingham', 'England', 30),
  ('united-kingdom', 'leeds', 'ليدز', 'Leeds', 'England', 40),
  ('united-kingdom', 'glasgow', 'غلاسكو', 'Glasgow', 'Scotland', 50),
  ('united-states', 'new-york', 'نيويورك', 'New York', 'New York', 10),
  ('united-states', 'los-angeles', 'لوس أنجلوس', 'Los Angeles', 'California', 20),
  ('united-states', 'chicago', 'شيكاغو', 'Chicago', 'Illinois', 30),
  ('united-states', 'houston', 'هيوستن', 'Houston', 'Texas', 40),
  ('united-states', 'san-francisco', 'سان فرانسيسكو', 'San Francisco', 'California', 50),
  ('germany', 'berlin', 'برلين', 'Berlin', 'Berlin', 10),
  ('germany', 'munich', 'ميونخ', 'Munich', 'Bavaria', 20),
  ('germany', 'frankfurt', 'فرانكفورت', 'Frankfurt', 'Hesse', 30),
  ('germany', 'cologne', 'كولونيا', 'Cologne', 'North Rhine-Westphalia', 40),
  ('germany', 'hamburg', 'هامبورغ', 'Hamburg', 'Hamburg', 50)
) AS city(area_slug, city_key, name_ar, name_en, region_name, sort_order)
  ON area.slug = city.area_slug
ON CONFLICT (area_id, city_key) DO NOTHING;

-- Valid IANA timezone identifiers. Primary zones are display defaults only.
INSERT INTO area_timezones (area_id, timezone_name, label_ar, label_en, is_primary, sort_order)
SELECT area.id, zone.timezone_name, zone.label_ar, zone.label_en, zone.is_primary, zone.sort_order
FROM site_areas area
JOIN (VALUES
  ('saudi-arabia', 'Asia/Riyadh', 'توقيت الرياض', 'Riyadh time', TRUE, 10),
  ('united-arab-emirates', 'Asia/Dubai', 'توقيت الإمارات', 'UAE time', TRUE, 10),
  ('canada', 'America/St_Johns', 'توقيت نيوفاوندلاند', 'Newfoundland Time', FALSE, 10),
  ('canada', 'America/Halifax', 'التوقيت الأطلسي', 'Atlantic Time', FALSE, 20),
  ('canada', 'America/Toronto', 'التوقيت الشرقي', 'Eastern Time', TRUE, 30),
  ('canada', 'America/Winnipeg', 'التوقيت المركزي', 'Central Time', FALSE, 40),
  ('canada', 'America/Edmonton', 'التوقيت الجبلي', 'Mountain Time', FALSE, 50),
  ('canada', 'America/Vancouver', 'توقيت المحيط الهادئ', 'Pacific Time', FALSE, 60),
  ('australia', 'Australia/Perth', 'توقيت بيرث', 'Perth time', FALSE, 10),
  ('australia', 'Australia/Adelaide', 'توقيت أديلايد', 'Adelaide time', FALSE, 20),
  ('australia', 'Australia/Sydney', 'توقيت سيدني', 'Sydney time', TRUE, 30),
  ('australia', 'Australia/Brisbane', 'توقيت بريسبان', 'Brisbane time', FALSE, 40),
  ('united-kingdom', 'Europe/London', 'توقيت لندن', 'London time', TRUE, 10),
  ('united-states', 'America/New_York', 'التوقيت الشرقي', 'Eastern Time', TRUE, 10),
  ('united-states', 'America/Chicago', 'التوقيت المركزي', 'Central Time', FALSE, 20),
  ('united-states', 'America/Denver', 'التوقيت الجبلي', 'Mountain Time', FALSE, 30),
  ('united-states', 'America/Los_Angeles', 'توقيت المحيط الهادئ', 'Pacific Time', FALSE, 40),
  ('germany', 'Europe/Berlin', 'توقيت برلين', 'Berlin time', TRUE, 10)
) AS zone(area_slug, timezone_name, label_ar, label_en, is_primary, sort_order)
  ON area.slug = zone.area_slug
ON CONFLICT (area_id, timezone_name) DO NOTHING;
