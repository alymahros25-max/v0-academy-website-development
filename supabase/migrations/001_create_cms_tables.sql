-- =============================================================================
-- CMS Database Schema for أكاديمية الحافظ المتميز
-- Multilingual Content Management System
-- =============================================================================

-- Table 1: Site Content (Multilingual Strings, Sections, Articles)
CREATE TABLE IF NOT EXISTS site_content (
  id BIGSERIAL PRIMARY KEY,
  -- Unique identifier for the content section (e.g., "hero_title", "about_section", "blog_post_1")
  key TEXT NOT NULL UNIQUE,
  
  -- Multilingual content fields
  content_ar TEXT,
  content_en TEXT,
  content_fr TEXT,
  
  -- Metadata
  section VARCHAR(50), -- e.g., "homepage", "about", "courses", "blog"
  type VARCHAR(50), -- e.g., "heading", "paragraph", "card", "article"
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Search and indexing
  search_text TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(content_en, '')), 'A') ||
    setweight(to_tsvector('french', COALESCE(content_fr, '')), 'B')
  ) STORED
);

CREATE INDEX idx_site_content_key ON site_content(key);
CREATE INDEX idx_site_content_section ON site_content(section);
CREATE INDEX idx_site_content_active ON site_content(is_active);
CREATE INDEX idx_site_content_search ON site_content USING GIN(search_text);

-- Table 2: Site Settings (Theme, Colors, Fonts, Global Configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  -- Theme configuration key (e.g., "primary_color", "secondary_color", "header_style")
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  
  -- Value (can be hex color, URL, JSON, or plain text)
  setting_value TEXT NOT NULL,
  
  -- Data type for UI rendering (e.g., "color", "text", "url", "json", "number")
  value_type VARCHAR(50),
  
  -- Display label for admin UI
  label TEXT,
  
  -- Description/help text for admin UI
  description TEXT,
  
  -- Category for organizing settings in admin (e.g., "colors", "typography", "layout")
  category VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_category ON site_settings(category);

-- Table 3: Translation History (For tracking auto-translation requests)
CREATE TABLE IF NOT EXISTS translation_history (
  id BIGSERIAL PRIMARY KEY,
  -- Content ID being translated
  content_id BIGINT REFERENCES site_content(id) ON DELETE CASCADE,
  
  -- Source language code
  source_lang VARCHAR(5),
  -- Target language codes (comma-separated or JSON array)
  target_langs TEXT,
  
  -- Original source text
  original_text TEXT,
  
  -- Service used (e.g., "google_translate", "deepl", "edge_function")
  translation_service VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_translation_history_content ON translation_history(content_id);
CREATE INDEX idx_translation_history_created_at ON translation_history(created_at);

-- =============================================================================
-- Initial Default Settings
-- =============================================================================

INSERT INTO site_settings (setting_key, setting_value, value_type, label, description, category) VALUES
  ('primary_color', '#1a4d2e', 'color', 'Primary Color (Green)', 'Main brand color for buttons and links', 'colors'),
  ('secondary_color', '#d4af37', 'color', 'Secondary Color (Gold)', 'Accent color for highlights', 'colors'),
  ('background_color', '#ffffff', 'color', 'Background Color', 'Main page background', 'colors'),
  ('text_color', '#000000', 'color', 'Text Color', 'Main text color', 'colors'),
  ('header_font', 'Noto Sans Arabic', 'text', 'Header Font', 'Font family for headings', 'typography'),
  ('body_font', 'Inter', 'text', 'Body Font', 'Font family for body text', 'typography'),
  ('logo_url', '/logo.png', 'url', 'Logo URL', 'Academy logo image URL', 'branding'),
  ('site_title_ar', 'أكاديمية الحافظ المتميز', 'text', 'Site Title (Arabic)', 'Arabic site name', 'general'),
  ('site_title_en', 'Al-Hafiz Academy', 'text', 'Site Title (English)', 'English site name', 'general'),
  ('site_title_fr', 'Académie Al-Hafiz', 'text', 'Site Title (French)', 'French site name', 'general')
ON CONFLICT (setting_key) DO NOTHING;

-- =============================================================================
-- Sample Content for Testing
-- =============================================================================

INSERT INTO site_content (key, content_ar, content_en, content_fr, section, type, is_active) VALUES
  (
    'hero_title',
    'أكاديمية الحافظ المتميز اون لاين',
    'Al-Hafiz Academy Online',
    'Académie Al-Hafiz En Ligne',
    'homepage',
    'heading',
    TRUE
  ),
  (
    'hero_subtitle',
    'تحفيظ القرآن الكريم وتأسيس اللغة العربية مع معلمين مجازين',
    'Quran Memorization and Arabic Foundational Education with Certified Teachers',
    'Mémorisation du Coran et Formation en Langue Arabe avec Enseignants Certifiés',
    'homepage',
    'paragraph',
    TRUE
  )
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- Enable Row Level Security (RLS) for multi-tenancy support
-- =============================================================================

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_history ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read active content
CREATE POLICY "Public can read active content" ON site_content
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Only authenticated admin users can update content
CREATE POLICY "Admin can manage content" ON site_content
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Settings are readable by all, writable by admin only
CREATE POLICY "Public can read settings" ON site_settings
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin can update settings" ON site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
