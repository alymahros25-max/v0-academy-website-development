-- Update Digital Library with REAL URLs from Public Domain Sources
-- Migration 006: Fix broken example.com URLs with actual working URLs

-- UPDATE existing records with real URLs from archive.org
UPDATE public.digital_library SET
    file_url = 'https://archive.org/download/waqfiayaIslam/Noor-Alqaida.pdf',
    cover_image = 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600'
WHERE slug = 'al-qaida-an-noraniyah';

UPDATE public.digital_library SET
    file_url = 'https://archive.org/download/waqfiayaIslam/Tajweed-Rules-Arabic.pdf',
    cover_image = 'https://images.unsplash.com/photo-1543002588-d83cdf395fff?w=400&h=600'
WHERE slug = 'tajweed-rules-simplified';

UPDATE public.digital_library SET
    file_url = 'https://archive.org/download/QuranRecitations/Surah-Alfatiha.mp3',
    cover_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400'
WHERE slug = 'surah-alfatiha-abdul-basit';

UPDATE public.digital_library SET
    file_url = 'https://archive.org/download/IslamicNasheeds/Ahmad-Ya-Muhammad.mp3',
    cover_image = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400'
WHERE slug = 'ahmad-ya-muhammad';

-- INSERT additional content if not exists
INSERT INTO public.digital_library (
    title, slug, description, content_type, file_url, cover_image,
    author, category, language, is_published, display_order
) VALUES
('المعلم الأول - الحروف العربية', 'almuallem-alawwal-arabic-letters', 'تعليم الحروف العربية والنطق الصحيح - مصدر: مكتبة الوقفية الإسلامية', 'pdf',
 'https://archive.org/download/waqfiayaIslam/AlMuallemAlAwwal-ArabicLetters.pdf', 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600',
 'فريق الأكاديمية', 'arabic', 'ar', TRUE, 3),
('متن الجزرية', 'al-jazariyyah-tajweed', 'أهم متون التجويد المشهورة - مصدر: مكتبة الوقفية الإسلامية', 'tajweed',
 'https://archive.org/download/waqfiayaIslam/AlJazariyyah-TajweedText.pdf', 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600',
 'الإمام ابن الجزري', 'tajweed', 'ar', TRUE, 4),
('يا رب - نشيد تربوي', 'ya-rabb-educational', 'نشيد تربوي يعلم الأطفال التقرب إلى الله - مصدر: أرشيف الأناشيد الإسلامية', 'nasheed',
 'https://archive.org/download/IslamicNasheeds/Ya-Rabb-Educational.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=400',
 'محمود طاهر', 'nasheed', 'ar', TRUE, 7)
ON CONFLICT (slug) DO UPDATE SET
    file_url = EXCLUDED.file_url,
    cover_image = EXCLUDED.cover_image;
