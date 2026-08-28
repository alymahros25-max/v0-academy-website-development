-- FAQ content for the public site and CMS
CREATE TABLE IF NOT EXISTS faq_items (
  id BIGSERIAL PRIMARY KEY,
  question_ar TEXT NOT NULL,
  question_en TEXT,
  question_fr TEXT,
  answer_ar TEXT NOT NULL,
  answer_en TEXT,
  answer_fr TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_faq_items_active_order ON faq_items (is_active, category, sort_order);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active FAQ" ON faq_items;
CREATE POLICY "Public can read active FAQ" ON faq_items
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins can manage FAQ" ON faq_items;
CREATE POLICY "Admins can manage FAQ" ON faq_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users au WHERE lower(au.email) = lower(auth.jwt() ->> 'email'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users au WHERE lower(au.email) = lower(auth.jwt() ->> 'email'))
  );
