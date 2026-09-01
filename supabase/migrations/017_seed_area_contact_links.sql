-- 017: Make contact links first-class, area-scoped records.
INSERT INTO area_links (area_id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, sort_order)
SELECT id, 'whatsapp', 'واتساب الحجز', 'Booking WhatsApp', 'WhatsApp réservation', 'https://wa.me/201130127894', 'whatsapp', TRUE, 10
FROM site_areas
WHERE slug IN ('global', 'australia', 'canada', 'germany', 'saudi-arabia', 'united-arab-emirates', 'united-kingdom', 'united-states')
ON CONFLICT (area_id, link_key) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  label_en = EXCLUDED.label_en,
  label_fr = EXCLUDED.label_fr,
  href = EXCLUDED.href,
  link_type = EXCLUDED.link_type,
  is_external = EXCLUDED.is_external,
  is_active = TRUE,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO area_links (area_id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, sort_order)
SELECT id, 'telegram', 'تيليجرام الأكاديمية', 'Academy Telegram', 'Telegram de l’académie', 'https://t.me/acabemy_quraan', 'telegram', TRUE, 20
FROM site_areas
WHERE slug = 'global'
ON CONFLICT (area_id, link_key) DO UPDATE SET
  label_ar = EXCLUDED.label_ar,
  label_en = EXCLUDED.label_en,
  label_fr = EXCLUDED.label_fr,
  href = EXCLUDED.href,
  link_type = EXCLUDED.link_type,
  is_external = EXCLUDED.is_external,
  is_active = TRUE,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
