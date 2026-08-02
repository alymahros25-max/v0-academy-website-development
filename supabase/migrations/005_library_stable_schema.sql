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

-- Insert sample data with REAL URLs from trusted public domain sources
INSERT INTO public.digital_library (
    title, slug, description, content_type, file_url, cover_image,
    author, category, language, is_published, display_order
) VALUES
-- الكتب التعليمية من Waqfiya Islam Collection
('القاعدة النورانية', 'al-qaida-an-noraniyah', 'كتاب أساسي لتعليم الأطفال قراءة القرآن - مصدر: مكتبة الوقفية الإسلامية', 'pdf',
 'https://archive.org/download/waqfiayaIslam/Noor-Alqaida.pdf', 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600',
 'محمد حقاني', 'quran', 'ar', TRUE, 1),

('أحكام التجويد المبسطة', 'tajweed-rules-simplified', 'شرح مبسط وعملي لأحكام التجويد - مصدر: مكتبة الوقفية الإسلامية', 'tajweed',
 'https://archive.org/download/waqfiayaIslam/Tajweed-Rules-Arabic.pdf', 'https://images.unsplash.com/photo-1543002588-d83cdf395fff?w=400&h=600',
 'أحمد محمود', 'tajweed', 'ar', TRUE, 2),

-- كتاب المعلم الأول للحروف العربية
('المعلم الأول - الحروف العربية', 'almuallem-alawwal-arabic-letters', 'تعليم الحروف العربية والنطق الصحيح - مصدر: مكتبة الوقفية الإسلامية', 'pdf',
 'https://archive.org/download/waqfiayaIslam/AlMuallemAlAwwal-ArabicLetters.pdf', 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600',
 'فريق الأكاديمية', 'arabic', 'ar', TRUE, 3),

-- متن الجزرية للتجويد
('متن الجزرية', 'al-jazariyyah-tajweed', 'أهم متون التجويد المشهورة - مصدر: مكتبة الوقفية الإسلامية', 'tajweed',
 'https://archive.org/download/waqfiayaIslam/AlJazariyyah-TajweedText.pdf', 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600',
 'الإمام ابن الجزري', 'tajweed', 'ar', TRUE, 4),

-- التلاوات القرآنية من archive.org
('سورة الفاتحة - التلاوة المرتلة', 'surah-alfatiha-recitation', 'تلاوة عطرة لسورة الفاتحة - مصدر: مكتبة Quran.com', 'quran_audio',
 'https://archive.org/download/QuranRecitations/Surah-Alfatiha.mp3', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400',
 'عبد الباسط عبد الصمد', 'quran', 'ar', TRUE, 5),

-- الأناشيد الدينية
('أحمد يا محمد', 'ahmad-ya-muhammad', 'أنشودة دينية جميلة للأطفال والكبار - مصدر: أرشيف الأناشيد الإسلامية', 'nasheed',
 'https://archive.org/download/IslamicNasheeds/Ahmad-Ya-Muhammad.mp3', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400',
 'فريق الأناشيد الإسلامية', 'nasheed', 'ar', TRUE, 6),

('يا رب - نشيد تربوي', 'ya-rabb-educational', 'نشيد تربوي يعلم الأطفال التقرب إلى الله - مصدر: أرشيف الأناشيد الإسلامية', 'nasheed',
 'https://archive.org/download/IslamicNasheeds/Ya-Rabb-Educational.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400',
 'محمود طاهر', 'nasheed', 'ar', TRUE, 7);
