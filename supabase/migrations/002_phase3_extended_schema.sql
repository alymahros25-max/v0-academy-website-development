-- =============================================================================
-- PHASE 3: Extended CMS Schema for Advanced Admin Dashboard
-- User Management, RBAC, Page Builder, Theme Customization
-- =============================================================================

-- Table 1: CMS Users (User Management)
CREATE TABLE IF NOT EXISTS cms_users (
  id BIGSERIAL PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role_type VARCHAR(50) NOT NULL DEFAULT 'student', -- admin, supervisor, teacher, student
  
  -- User Profile
  avatar_url TEXT,
  phone VARCHAR(20),
  bio TEXT,
  
  -- Status and audit
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_cms_users_email ON cms_users(email);
CREATE INDEX idx_cms_users_role ON cms_users(role_type);
CREATE INDEX idx_cms_users_active ON cms_users(is_active);
CREATE INDEX idx_cms_users_auth_id ON cms_users(auth_user_id);

-- Table 2: CMS Permissions (RBAC - Role-Based Access Control)
CREATE TABLE IF NOT EXISTS cms_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_type VARCHAR(50) NOT NULL, -- admin, supervisor, teacher, student
  
  -- Feature/Module (e.g., "content_management", "user_management", "theme_settings", "page_builder")
  module_name VARCHAR(100) NOT NULL,
  
  -- Action (e.g., "create", "read", "update", "delete", "publish")
  action VARCHAR(50) NOT NULL,
  
  -- Can this role perform this action?
  is_allowed BOOLEAN DEFAULT FALSE,
  
  -- Description
  description TEXT,
  
  UNIQUE(role_type, module_name, action)
);

CREATE INDEX idx_cms_permissions_role ON cms_permissions(role_type);
CREATE INDEX idx_cms_permissions_module ON cms_permissions(module_name);

-- Table 3: Site Pages (Dynamic Page Builder)
CREATE TABLE IF NOT EXISTS site_pages (
  id BIGSERIAL PRIMARY KEY,
  
  -- Page metadata
  slug TEXT NOT NULL UNIQUE,
  title_ar TEXT,
  title_en TEXT,
  title_fr TEXT,
  
  -- Page description for SEO
  meta_description_ar TEXT,
  meta_description_en TEXT,
  meta_description_fr TEXT,
  
  -- Page template/layout type (e.g., "hero_section", "services_grid", "about_full")
  template_type VARCHAR(100) NOT NULL DEFAULT 'custom',
  
  -- Page content (JSON structure with sections, components, etc.)
  content_json JSONB DEFAULT '{}',
  
  -- Page settings (animations, widgets, theme overrides, etc.)
  settings_json JSONB DEFAULT '{}',
  
  -- SEO and publishing
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  is_home_page BOOLEAN DEFAULT FALSE,
  
  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL,
  updated_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL,
  published_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_site_pages_slug ON site_pages(slug);
CREATE INDEX idx_site_pages_published ON site_pages(is_published);
CREATE INDEX idx_site_pages_home ON site_pages(is_home_page);

-- Table 4: Extended Theme Settings (Live Preview & Typography)
CREATE TABLE IF NOT EXISTS theme_customizations (
  id BIGSERIAL PRIMARY KEY,
  
  -- Theme section
  section VARCHAR(100) NOT NULL, -- 'colors', 'typography', 'animations', 'widgets', 'layout'
  
  -- Setting key and value
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  
  -- Per-language settings (if needed)
  language VARCHAR(5), -- 'ar', 'en', 'fr', or NULL for global
  
  -- Data type for UI (color, text, number, toggle, select, etc.)
  value_type VARCHAR(50),
  
  -- Display properties for admin UI
  label_ar TEXT,
  label_en TEXT,
  label_fr TEXT,
  description_text TEXT,
  
  -- Visual preview info
  preview_css TEXT, -- CSS variable or inline style for preview
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_theme_customizations_section ON theme_customizations(section);
CREATE INDEX idx_theme_customizations_language ON theme_customizations(language);
CREATE INDEX idx_theme_customizations_key ON theme_customizations(setting_key);

-- Table 5: Widget Configuration (WhatsApp, Navbar, Floating Widgets)
CREATE TABLE IF NOT EXISTS widget_configs (
  id BIGSERIAL PRIMARY KEY,
  
  -- Widget type (e.g., 'whatsapp_button', 'navbar', 'footer_menu', 'floating_cta')
  widget_type VARCHAR(100) NOT NULL UNIQUE,
  
  -- Widget settings (JSON: position, size, colors, phone number, etc.)
  config_json JSONB NOT NULL DEFAULT '{}',
  
  -- Widget visibility and status
  is_enabled BOOLEAN DEFAULT TRUE,
  
  -- Display order (for multiple widgets)
  display_order INT DEFAULT 0,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by BIGINT REFERENCES cms_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_widget_configs_type ON widget_configs(widget_type);
CREATE INDEX idx_widget_configs_enabled ON widget_configs(is_enabled);

-- Table 6: Live Preview Cache (For performance)
CREATE TABLE IF NOT EXISTS preview_cache (
  id BIGSERIAL PRIMARY KEY,
  
  -- Preview type (e.g., 'full_page', 'color_theme', 'typography')
  preview_type VARCHAR(100),
  
  -- Reference to page or settings
  reference_id BIGINT,
  
  -- Rendered preview HTML (cached)
  preview_html TEXT,
  
  -- Device type (desktop, tablet, mobile)
  device_type VARCHAR(50) DEFAULT 'desktop',
  
  -- Cache validity
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_preview_cache_type ON preview_cache(preview_type);
CREATE INDEX idx_preview_cache_reference ON preview_cache(reference_id);
CREATE INDEX idx_preview_cache_expires ON preview_cache(expires_at);

-- =============================================================================
-- Initial RBAC Setup
-- =============================================================================

-- Admin role - full access to everything
INSERT INTO cms_permissions (role_type, module_name, action, is_allowed, description) VALUES
  ('admin', 'content_management', 'create', TRUE, 'Admin can create content'),
  ('admin', 'content_management', 'read', TRUE, 'Admin can read all content'),
  ('admin', 'content_management', 'update', TRUE, 'Admin can update content'),
  ('admin', 'content_management', 'delete', TRUE, 'Admin can delete content'),
  ('admin', 'content_management', 'publish', TRUE, 'Admin can publish content'),
  ('admin', 'theme_settings', 'read', TRUE, 'Admin can view theme settings'),
  ('admin', 'theme_settings', 'update', TRUE, 'Admin can update theme'),
  ('admin', 'page_builder', 'create', TRUE, 'Admin can create pages'),
  ('admin', 'page_builder', 'read', TRUE, 'Admin can read pages'),
  ('admin', 'page_builder', 'update', TRUE, 'Admin can update pages'),
  ('admin', 'page_builder', 'delete', TRUE, 'Admin can delete pages'),
  ('admin', 'page_builder', 'publish', TRUE, 'Admin can publish pages'),
  ('admin', 'user_management', 'create', TRUE, 'Admin can create users'),
  ('admin', 'user_management', 'read', TRUE, 'Admin can read users'),
  ('admin', 'user_management', 'update', TRUE, 'Admin can update users'),
  ('admin', 'user_management', 'delete', TRUE, 'Admin can delete users'),
  ('admin', 'widget_management', 'read', TRUE, 'Admin can read widgets'),
  ('admin', 'widget_management', 'update', TRUE, 'Admin can update widgets'),
  
  -- Supervisor role - can manage content and pages, view settings
  ('supervisor', 'content_management', 'create', TRUE, 'Supervisor can create content'),
  ('supervisor', 'content_management', 'read', TRUE, 'Supervisor can read content'),
  ('supervisor', 'content_management', 'update', TRUE, 'Supervisor can update content'),
  ('supervisor', 'content_management', 'delete', FALSE, 'Supervisor cannot delete content'),
  ('supervisor', 'content_management', 'publish', TRUE, 'Supervisor can publish content'),
  ('supervisor', 'theme_settings', 'read', TRUE, 'Supervisor can view theme'),
  ('supervisor', 'theme_settings', 'update', FALSE, 'Supervisor cannot modify theme'),
  ('supervisor', 'page_builder', 'create', TRUE, 'Supervisor can create pages'),
  ('supervisor', 'page_builder', 'read', TRUE, 'Supervisor can read pages'),
  ('supervisor', 'page_builder', 'update', TRUE, 'Supervisor can update pages'),
  ('supervisor', 'page_builder', 'delete', FALSE, 'Supervisor cannot delete pages'),
  ('supervisor', 'page_builder', 'publish', TRUE, 'Supervisor can publish pages'),
  ('supervisor', 'user_management', 'read', TRUE, 'Supervisor can view users'),
  ('supervisor', 'user_management', 'create', FALSE, 'Supervisor cannot create users'),
  ('supervisor', 'user_management', 'update', FALSE, 'Supervisor cannot update users'),
  ('supervisor', 'user_management', 'delete', FALSE, 'Supervisor cannot delete users'),
  ('supervisor', 'widget_management', 'read', TRUE, 'Supervisor can read widgets'),
  ('supervisor', 'widget_management', 'update', FALSE, 'Supervisor cannot modify widgets'),
  
  -- Teacher role - limited to managing their own courses and content
  ('teacher', 'content_management', 'create', TRUE, 'Teacher can create content'),
  ('teacher', 'content_management', 'read', TRUE, 'Teacher can read content'),
  ('teacher', 'content_management', 'update', TRUE, 'Teacher can update own content'),
  ('teacher', 'content_management', 'delete', FALSE, 'Teacher cannot delete content'),
  ('teacher', 'content_management', 'publish', FALSE, 'Teacher cannot publish'),
  ('teacher', 'theme_settings', 'read', TRUE, 'Teacher can view theme'),
  ('teacher', 'theme_settings', 'update', FALSE, 'Teacher cannot modify theme'),
  ('teacher', 'page_builder', 'read', TRUE, 'Teacher can read pages'),
  ('teacher', 'page_builder', 'create', FALSE, 'Teacher cannot create pages'),
  ('teacher', 'page_builder', 'update', FALSE, 'Teacher cannot update pages'),
  ('teacher', 'page_builder', 'delete', FALSE, 'Teacher cannot delete pages'),
  ('teacher', 'page_builder', 'publish', FALSE, 'Teacher cannot publish pages'),
  ('teacher', 'user_management', 'read', FALSE, 'Teacher cannot manage users'),
  ('teacher', 'user_management', 'create', FALSE, 'Teacher cannot create users'),
  ('teacher', 'user_management', 'update', FALSE, 'Teacher cannot update users'),
  ('teacher', 'user_management', 'delete', FALSE, 'Teacher cannot delete users'),
  ('teacher', 'widget_management', 'read', TRUE, 'Teacher can read widgets'),
  ('teacher', 'widget_management', 'update', FALSE, 'Teacher cannot modify widgets'),
  
  -- Student role - read-only access
  ('student', 'content_management', 'read', TRUE, 'Student can read content'),
  ('student', 'content_management', 'create', FALSE, 'Student cannot create'),
  ('student', 'content_management', 'update', FALSE, 'Student cannot update'),
  ('student', 'content_management', 'delete', FALSE, 'Student cannot delete'),
  ('student', 'content_management', 'publish', FALSE, 'Student cannot publish'),
  ('student', 'theme_settings', 'read', TRUE, 'Student can view theme'),
  ('student', 'theme_settings', 'update', FALSE, 'Student cannot modify theme'),
  ('student', 'page_builder', 'read', TRUE, 'Student can read pages'),
  ('student', 'page_builder', 'create', FALSE, 'Student cannot create pages'),
  ('student', 'page_builder', 'update', FALSE, 'Student cannot update pages'),
  ('student', 'page_builder', 'delete', FALSE, 'Student cannot delete pages'),
  ('student', 'page_builder', 'publish', FALSE, 'Student cannot publish pages'),
  ('student', 'user_management', 'read', FALSE, 'Student cannot access user management'),
  ('student', 'user_management', 'create', FALSE, 'Student cannot create users'),
  ('student', 'user_management', 'update', FALSE, 'Student cannot update users'),
  ('student', 'user_management', 'delete', FALSE, 'Student cannot delete users'),
  ('student', 'widget_management', 'read', FALSE, 'Student cannot access widget config'),
  ('student', 'widget_management', 'update', FALSE, 'Student cannot modify widgets')
ON CONFLICT (role_type, module_name, action) DO NOTHING;

-- =============================================================================
-- Enable RLS on new tables
-- =============================================================================

ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_configs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Initial Sample Data
-- =============================================================================

-- Create initial homepage page
INSERT INTO site_pages (slug, title_ar, title_en, title_fr, template_type, is_published, is_home_page, content_json, settings_json) VALUES (
  'homepage',
  'الصفحة الرئيسية',
  'Home',
  'Accueil',
  'hero_section',
  TRUE,
  TRUE,
  '{"sections": [{"id": "hero", "type": "hero", "title": "Hero Section", "content": {}}]}',
  '{"animations": true, "theme_override": null, "show_navbar": true, "show_footer": true}'
) ON CONFLICT (slug) DO NOTHING;

-- Sample WhatsApp widget config
INSERT INTO widget_configs (widget_type, config_json, is_enabled, display_order) VALUES (
  'whatsapp_button',
  '{"position": "right", "phone": "+201130127894", "size": "large", "color": "#1a4d2e", "show_label": true, "label_ar": "اتصل بنا", "label_en": "Contact Us", "label_fr": "Nous contacter"}',
  TRUE,
  1
) ON CONFLICT (widget_type) DO NOTHING;

-- Sample Navbar widget config
INSERT INTO widget_configs (widget_type, config_json, is_enabled, display_order) VALUES (
  'navbar',
  '{"position": "top", "style": "light", "alignment": "right", "items": ["home", "courses", "about", "teachers", "contact"], "order": 0}',
  TRUE,
  0
) ON CONFLICT (widget_type) DO NOTHING;

-- =============================================================================
-- End of Phase 3 Database Schema
-- =============================================================================
