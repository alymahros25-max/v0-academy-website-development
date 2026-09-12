-- Homepage content refresh approved from docs/HOMEPAGE_CONTENT_DRAFT_AR_REVISED.md
-- This migration changes copy only; it does not change prices, links, payments, or country records.

UPDATE site_content
SET
  content_ar = 'تعلّم القرآن الكريم واللغة العربية أونلاين بثقة',
  content_en = 'Learn Quran and Arabic online with confidence',
  content_fr = 'Apprenez le Coran et l’arabe en ligne en toute confiance',
  updated_at = NOW()
WHERE key = 'hero_title';

UPDATE site_content
SET
  content_ar = 'حصص فردية لتعليم القرآن الكريم والتجويد وتأسيس اللغة العربية، مع خطة تناسب مستوى الطالب وهدفه.',
  content_en = 'One-to-one online lessons for Quran, Tajweed, and Arabic foundation, with a plan around the learner’s level and goal.',
  content_fr = 'Cours individuels en ligne de Coran, de Tajwid et d’arabe, avec un parcours adapté au niveau et à l’objectif de l’élève.',
  updated_at = NOW()
WHERE key = 'hero_subtitle';
