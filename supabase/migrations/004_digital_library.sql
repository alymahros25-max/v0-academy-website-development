-- Digital Library Tables (Week 2-3)
-- Comprehensive content management for PDFs, Audio, and Nasheeds

CREATE TABLE IF NOT EXISTS digital_library (
  id BIGSERIAL PRIMARY KEY,
  -- Multi-language fields
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  
  author_ar TEXT,
  author_en TEXT,
  author_fr TEXT,
  
  -- Content type and URLs
  content_type VARCHAR(50) NOT NULL, -- 'book', 'quran_audio', 'nasheed', 'tajweed'
  pdf_url TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  
  -- Category and tags
  category VARCHAR(100),
  subcategory VARCHAR(100),
  tags TEXT[], -- Array of tags
  
  -- For Quran audio (Qaris)
  qari_name_ar TEXT,
  qari_name_en TEXT,
  is_quran_audio BOOLEAN DEFAULT FALSE,
  
  -- For Nasheeds
  nasheed_artist_ar TEXT,
  nasheed_artist_en TEXT,
  lyrics_ar TEXT,
  lyrics_en TEXT,
  is_nasheed BOOLEAN DEFAULT FALSE,
  
  -- For Tajweed texts
  tajweed_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  tajweed_category VARCHAR(100), -- 'rules', 'metrical_text', 'practice'
  is_tajweed BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  duration_seconds INT,
  file_size_mb DECIMAL(10, 2),
  page_count INT,
  publication_year INT,
  
  -- Publishing controls
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  
  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by BIGINT REFERENCES cms_users(id),
  updated_by BIGINT REFERENCES cms_users(id),
  
  -- Search optimization
  search_vector tsvector
);

-- Indexes for performance
CREATE INDEX idx_digital_library_type ON digital_library(content_type);
CREATE INDEX idx_digital_library_category ON digital_library(category);
CREATE INDEX idx_digital_library_published ON digital_library(is_published);
CREATE INDEX idx_digital_library_featured ON digital_library(is_featured);
CREATE INDEX idx_digital_library_order ON digital_library(display_order);
CREATE INDEX idx_digital_library_search ON digital_library USING GIN(search_vector);

-- Trigger to update search_vector
CREATE OR REPLACE FUNCTION update_digital_library_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('arabic', COALESCE(NEW.title_ar, '') || ' ' || COALESCE(NEW.description_ar, '') || ' ' || COALESCE(NEW.author_ar, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER digital_library_search_trigger
BEFORE INSERT OR UPDATE ON digital_library
FOR EACH ROW
EXECUTE FUNCTION update_digital_library_search();

-- Table for featured content sections
CREATE TABLE IF NOT EXISTS digital_library_sections (
  id BIGSERIAL PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  
  section_type VARCHAR(50) NOT NULL, -- 'quran', 'books', 'nasheeds', 'tajweed'
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sections_type ON digital_library_sections(section_type);
CREATE INDEX idx_sections_published ON digital_library_sections(is_published);
