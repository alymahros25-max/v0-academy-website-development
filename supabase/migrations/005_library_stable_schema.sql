-- Digital Library - Stable Production Schema
-- Supporting PDF books, Quran audio, Nasheeds, and Tajweed texts

DROP TABLE IF EXISTS public.digital_library CASCADE;

CREATE TABLE public.digital_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic metadata
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    
    -- Content type: 'pdf', 'quran_audio', 'nasheed', 'tajweed'
    content_type VARCHAR(50) NOT NULL,
    
    -- File and media URLs
    file_url TEXT NOT NULL,           -- Direct link to PDF, MP3, etc
    cover_image TEXT,                  -- Thumbnail/cover image
    preview_url TEXT,                  -- Optional preview
    
    -- Author and metadata
    author VARCHAR(255),
    narrator_ar VARCHAR(255),          -- For audio: Qari name in Arabic
    narrator_en VARCHAR(255),          -- For audio: Qari name in English
    
    -- Categorization
    category VARCHAR(100),             -- 'quran', 'tajweed', 'nasheed', 'educational'
    subcategory VARCHAR(100),
    
    -- Language support
    language VARCHAR(10) DEFAULT 'ar', -- 'ar', 'en', 'fr'
    
    -- Publishing controls
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata for audio/video
    duration_seconds INTEGER,          -- For audio files
    page_count INTEGER,                -- For PDFs
    file_size_mb DECIMAL(10, 2),
    mime_type VARCHAR(50),             -- 'application/pdf', 'audio/mpeg', etc
    
    -- SEO
    meta_title VARCHAR(160),
    meta_description VARCHAR(160),
    meta_keywords TEXT,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID,
    updated_by UUID,
    
    CONSTRAINT check_content_type CHECK (content_type IN ('pdf', 'quran_audio', 'nasheed', 'tajweed')),
    CONSTRAINT check_language CHECK (language IN ('ar', 'en', 'fr'))
);

-- Indexes for optimal query performance
CREATE INDEX idx_library_slug ON public.digital_library(slug);
CREATE INDEX idx_library_content_type ON public.digital_library(content_type);
CREATE INDEX idx_library_category ON public.digital_library(category);
CREATE INDEX idx_library_published ON public.digital_library(is_published);
CREATE INDEX idx_library_featured ON public.digital_library(is_featured);
CREATE INDEX idx_library_language ON public.digital_library(language);
CREATE INDEX idx_library_created_at ON public.digital_library(created_at DESC);

-- Enable RLS
ALTER TABLE public.digital_library ENABLE ROW LEVEL SECURITY;

-- Public can view published items
CREATE POLICY "Anyone can view published library items"
    ON public.digital_library
    FOR SELECT
    USING (is_published = TRUE);

-- Only authenticated admin can manage
CREATE POLICY "Only admin can manage library items"
    ON public.digital_library
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Insert sample data (optional)
INSERT INTO public.digital_library (
    title, slug, description, content_type, file_url, cover_image,
    author, category, language, is_published, display_order
) VALUES
-- الكتب التعليمية
('القاعدة النورانية', 'al-qaida-an-noraniyah', 'كتاب أساسي لتعليم الأطفال قراءة القرآن', 'pdf',
 'https://example.com/books/al-qaida.pdf', 'https://example.com/covers/al-qaida.jpg',
 'محمد حقاني', 'quran', 'ar', TRUE, 1),

('أحكام التجويد المبسطة', 'tajweed-rules-simplified', 'شرح مبسط وسهل لأحكام التجويد', 'tajweed',
 'https://example.com/books/tajweed-simplified.pdf', 'https://example.com/covers/tajweed.jpg',
 'أحمد محمود', 'tajweed', 'ar', TRUE, 2),

-- التلاوات القرآنية
('سورة الفاتحة - الشيخ عبد الباسط', 'surah-alfatiha-abdul-basit', 'تلاوة عطرة لسورة الفاتحة', 'quran_audio',
 'https://example.com/audio/alfatiha.mp3', 'https://example.com/covers/abdul-basit.jpg',
 'عبد الباسط عبد الصمد', 'quran', 'ar', TRUE, 3),

-- الأناشيد الدينية
('أحمد يا محمد', 'ahmad-ya-muhammad', 'أنشودة دينية جميلة للأطفال والكبار', 'nasheed',
 'https://example.com/audio/ahmad-ya-muhammad.mp3', 'https://example.com/covers/nasheed-1.jpg',
 'فريق الأناشيد الإسلامية', 'nasheed', 'ar', TRUE, 4);
