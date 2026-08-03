-- COMPLETE CLEANUP AND RESET: Google Drive-Optimized Digital Library Schema
-- This migration drops all legacy library tables and creates a fresh, streamlined schema
-- Designed specifically for Google Drive embed URLs

-- Step 1: Drop existing tables if they exist
DROP TABLE IF EXISTS public.digital_library_sections CASCADE;
DROP TABLE IF EXISTS public.digital_library CASCADE;

-- Step 2: Create streamlined digital_library table optimized for Google Drive
CREATE TABLE public.digital_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Core metadata
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  
  -- Content type: 'book', 'quran_audio', 'nasheed'
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('book', 'quran_audio', 'nasheed')),
  
  -- Content URLs (Google Drive or external)
  drive_url TEXT,                   -- Original Google Drive shareable link
  audio_url TEXT,                   -- For audio content
  cover_image TEXT,                 -- Thumbnail/cover image URL
  
  -- Author and metadata
  author VARCHAR(255),
  narrator_ar VARCHAR(255),         -- For audio: Qari name in Arabic
  narrator_en VARCHAR(255),         -- For audio: Qari name in English
  
  -- Organization
  category VARCHAR(100),            -- 'quran', 'tajweed', 'nasheed', 'educational'
  subcategory VARCHAR(100),
  
  -- Publishing controls
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  duration_seconds INTEGER,         -- For audio files
  page_count INTEGER,               -- For PDFs
  file_size_mb DECIMAL(10, 2),
  
  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by UUID,
  updated_by UUID
);

-- Step 3: Create indexes for optimal performance
CREATE INDEX idx_library_slug ON public.digital_library(slug);
CREATE INDEX idx_library_content_type ON public.digital_library(content_type);
CREATE INDEX idx_library_category ON public.digital_library(category);
CREATE INDEX idx_library_published ON public.digital_library(is_published);
CREATE INDEX idx_library_featured ON public.digital_library(is_featured);
CREATE INDEX idx_library_created_at ON public.digital_library(created_at DESC);

-- Step 4: Enable Row Level Security
ALTER TABLE public.digital_library ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
-- Public can view published items
CREATE POLICY "Anyone can view published library items"
  ON public.digital_library
  FOR SELECT
  USING (is_published = TRUE);

-- Only authenticated users can modify (admin only via application logic)
CREATE POLICY "Only admin can manage library items"
  ON public.digital_library
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Step 6: Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_digital_library_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER digital_library_timestamp_trigger
  BEFORE UPDATE ON public.digital_library
  FOR EACH ROW
  EXECUTE FUNCTION update_digital_library_timestamp();

-- Step 7: Insert initial data - EMPTY (ready for admin to add via Google Drive links)
-- No seed data - admin will add books via the new Google Drive system

COMMIT;
