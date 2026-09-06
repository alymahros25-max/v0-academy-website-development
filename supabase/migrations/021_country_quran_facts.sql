-- =============================================================================
-- 021: Replace public palette details with a useful Quran fact per country page
-- Theme colors remain active for styling but are no longer exposed as a palette.
-- =============================================================================

ALTER TABLE public.area_themes
  ADD COLUMN IF NOT EXISTS quran_fact_title_ar TEXT,
  ADD COLUMN IF NOT EXISTS quran_fact_body_ar TEXT,
  ADD COLUMN IF NOT EXISTS quran_fact_reference_ar TEXT;

UPDATE public.area_themes AS theme
SET
  quran_fact_title_ar = facts.title,
  quran_fact_body_ar = facts.body,
  quran_fact_reference_ar = facts.reference
FROM (
  VALUES
    ('saudi-arabia', 'أول ما نزل من القرآن', 'افتتحت الرسالة بقوله تعالى: «اقرأ باسم ربك الذي خلق». تذكّرنا الآية بأن القراءة والتعلّم من أول أبواب الهداية.', 'سورة العلق، الآية 1'),
    ('united-arab-emirates', 'الترتيل منهج القراءة', 'قال تعالى: «ورتل القرآن ترتيلاً». القراءة المتأنية الواضحة تساعد على ضبط النطق وفهم المعنى دون عجلة.', 'سورة المزمل، الآية 4'),
    ('canada', 'القرآن يهدي للأقوم', 'قال تعالى: «إن هذا القرآن يهدي للتي هي أقوم». فالقرآن يوجّه إلى أقوم الأقوال والأعمال ويعين على بناء السلوك القويم.', 'سورة الإسراء، الآية 9'),
    ('australia', 'التدبر يزيد الانتفاع', 'وصف الله القرآن بأنه كتاب مبارك أنزله ليتدبر الناس آياته. اجعل مع التلاوة وقتاً قصيراً لفهم المعنى والعمل به.', 'سورة ص، الآية 29'),
    ('united-kingdom', 'دعاء طالب العلم', 'علّم الله نبيه أن يقول: «رب زدني علماً». ويمكن أن يبدأ طالب القرآن بهذا الدعاء مستحضراً أن التعلم رحلة مستمرة.', 'سورة طه، الآية 114'),
    ('united-states', 'القرآن ميسّر للذكر', 'قال تعالى: «ولقد يسرنا القرآن للذكر فهل من مدكر». البداية المنتظمة والمراجعة الهادئة تصنعان تقدماً ثابتاً في الحفظ.', 'سورة القمر، الآية 17'),
    ('germany', 'دعوة صريحة إلى التدبر', 'قال تعالى: «أفلا يتدبرون القرآن أم على قلوب أقفالها». التدبر يربط التلاوة بالقلب ويحوّل المعرفة إلى أثر عملي.', 'سورة محمد، الآية 24')
) AS facts(slug, title, body, reference)
JOIN public.site_areas AS area ON area.slug = facts.slug
WHERE theme.area_id = area.id;

COMMENT ON COLUMN public.area_themes.quran_fact_title_ar IS 'عنوان معلومة قرآنية مفيدة تظهر بدل تفاصيل لوحة الألوان.';
COMMENT ON COLUMN public.area_themes.quran_fact_body_ar IS 'نص تعليمي قرآني موجز ومختلف لكل صفحة دولة.';
COMMENT ON COLUMN public.area_themes.quran_fact_reference_ar IS 'مرجع السورة والآية للمعلومة القرآنية.';
