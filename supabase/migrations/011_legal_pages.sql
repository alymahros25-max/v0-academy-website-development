-- Migration 011: Create legal_pages table for dynamic legal content
-- =====================================================================
-- This table stores localized legal pages (Terms, Privacy, Refund Policy)
-- in 3 languages: Arabic (ar), English (en), French (fr)

CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Page identifier: 'terms', 'privacy', 'refund-policy'
  page_slug TEXT NOT NULL,
  
  -- Language code: 'ar', 'en', 'fr'
  locale TEXT NOT NULL,
  
  -- Page title (e.g., "سياسة الاسترداد", "Refund Policy", "Politique de Remboursement")
  title TEXT NOT NULL,
  
  -- Markdown content for the legal page
  content TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint: one page slug + locale combination
  UNIQUE (page_slug, locale)
);

-- =====================================================================
-- INDEXES for better query performance
-- =====================================================================
CREATE INDEX idx_legal_pages_page_slug ON legal_pages(page_slug);
CREATE INDEX idx_legal_pages_locale ON legal_pages(locale);
CREATE INDEX idx_legal_pages_slug_locale ON legal_pages(page_slug, locale);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) - Public can READ, only admins can WRITE
-- =====================================================================
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can read legal pages (public)
CREATE POLICY "Legal pages are publicly readable"
  ON legal_pages
  FOR SELECT
  USING (true);

-- Policy 2: Only authenticated admins can insert
CREATE POLICY "Only admins can insert legal pages"
  ON legal_pages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.email()
    )
  );

-- Policy 3: Only admins can update their own pages
CREATE POLICY "Only admins can update legal pages"
  ON legal_pages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.email()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.email()
    )
  );

-- Policy 4: Only admins can delete
CREATE POLICY "Only admins can delete legal pages"
  ON legal_pages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.email()
    )
  );

-- =====================================================================
-- INSERT DEFAULT LEGAL PAGES (Arabic, English, French)
-- =====================================================================

-- Terms of Service - Arabic
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'terms',
  'ar',
  'شروط وأحكام الاستخدام',
  '# شروط وأحكام الاستخدام

## تعريف الخدمات

أكاديمية الحافظ المتميز توفر:

### 1. الدورات المدفوعة (الخدمات المدفوعة)
- مقاطع فيديو تعليمية مسجلة
- جلسات تفاعلية مباشرة
- محاضرات على الطلب

### 2. الخدمات المجانية (غير خاضعة للبيع)
- مكتبة الكتب الرقمية
- الألعاب التعليمية
- جميع الموارد المرفقة

## سياسة الاسترجاع والاسترداد

يرجى مراجعة **سياسة الاسترداد المفصلة** على صفحة [سياسة الاسترداد](/refund-policy).

## حماية المحتوى المجاني

يُحظر **منعاً باتاً**:
- تحميل أو نسخ الكتب من المكتبة الرقمية
- استخراج أو كشط محتوى الألعاب التعليمية
- مشاركة أو توزيع الموارد المجانية
- استخدام أدوات آلية لاستخراج البيانات

انتهاك هذه الشروط قد يؤدي إلى حجب الحساب فوراً.

## الالتزام بالقوانين

المستخدمون يوافقون على الامتثال لجميع القوانين المحلية والدولية المعمول بها.'
);

-- Terms of Service - English
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'terms',
  'en',
  'Terms of Service',
  '# Terms of Service

## Service Definitions

Al-Hafiz Academy provides:

### 1. Paid Courses (Paid Services)
- Pre-recorded video lectures
- Live interactive sessions
- On-demand courses

### 2. Free Services (Not for Sale)
- Digital library (Books)
- Educational games
- All attached resources

## Refund Policy

Please refer to our **Detailed Refund Policy** on the [Refund Policy Page](/refund-policy).

## Free Content Protection

**Strictly Prohibited**:
- Downloading or copying books from the digital library
- Extracting or scraping educational game content
- Sharing or distributing free resources
- Using automated tools to extract data

Violating these terms may result in immediate account suspension.

## Legal Compliance

Users agree to comply with all applicable local and international laws.'
);

-- Terms of Service - French
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'terms',
  'fr',
  'Conditions d''Utilisation',
  '# Conditions d''Utilisation

## Définition des Services

L''Académie Al-Hafiz propose:

### 1. Cours Payants (Services Payants)
- Cours vidéo préenregistrés
- Sessions interactives en direct
- Cours à la demande

### 2. Services Gratuits (Non à Vendre)
- Bibliothèque numérique (Livres)
- Jeux éducatifs
- Toutes les ressources jointes

## Politique de Remboursement

Veuillez consulter notre **Politique de Remboursement Détaillée** sur la [Page de Politique de Remboursement](/refund-policy).

## Protection du Contenu Gratuit

**Strictement Interdit**:
- Télécharger ou copier des livres de la bibliothèque numérique
- Extraire ou scraper le contenu des jeux éducatifs
- Partager ou distribuer des ressources gratuites
- Utiliser des outils automatisés pour extraire des données

La violation de ces conditions peut entraîner la suspension immédiate du compte.'
);

-- Privacy Policy - Arabic
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'privacy',
  'ar',
  'سياسة الخصوصية',
  '# سياسة الخصوصية

## جمع البيانات

نجمع المعلومات التالية:
- بيانات الحساب (البريد الإلكتروني، الاسم)
- بيانات الدفع (معالجة عبر Paddle بشكل آمن)
- سجل الدورات والتقدم
- سجلات الوصول والاستخدام

## استخدام البيانات

نستخدم بيانات تسجيل الدخول فقط لـ:
- توفير الخدمات التعليمية
- معالجة الدفع
- تحسين التجربة
- الامتثال القانوني

## مشاركة البيانات

لا نشارك بيانات المستخدمين مع أطراف ثالثة إلا:
- عند الضرورة للمعالجة (Paddle للدفع)
- بطلب قانوني
- بموافقة صريحة من المستخدم

## الأمان

نستخدم تشفير من الدرجة الأولى لحماية بيانات المستخدمين.'
);

-- Privacy Policy - English
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'privacy',
  'en',
  'Privacy Policy',
  '# Privacy Policy

## Data Collection

We collect the following information:
- Account data (email, name)
- Payment data (processed securely via Paddle)
- Course history and progress
- Access and usage logs

## Data Usage

We use login data only for:
- Providing educational services
- Payment processing
- Improving user experience
- Legal compliance

## Data Sharing

We do not share user data with third parties except:
- When necessary for processing (Paddle for payments)
- Upon legal request
- With explicit user consent

## Security

We use enterprise-grade encryption to protect user data.'
);

-- Privacy Policy - French
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'privacy',
  'fr',
  'Politique de Confidentialité',
  '# Politique de Confidentialité

## Collecte de Données

Nous collectons les informations suivantes:
- Données de compte (e-mail, nom)
- Données de paiement (traitées de manière sécurisée via Paddle)
- Historique des cours et progression
- Journaux d''accès et d''utilisation

## Utilisation des Données

Nous utilisons les données de connexion uniquement pour:
- Fournir les services éducatifs
- Traiter les paiements
- Améliorer l''expérience utilisateur
- Conformité légale

## Partage des Données

Nous ne partageons pas les données des utilisateurs avec des tiers sauf:
- Si nécessaire pour le traitement (Paddle pour les paiements)
- Sur demande légale
- Avec consentement explicite de l''utilisateur

## Sécurité

Nous utilisons le chiffrement de niveau entreprise pour protéger les données.'
);

-- Refund Policy - Arabic (NEW)
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'refund-policy',
  'ar',
  'سياسة الاسترداد',
  '# سياسة الاسترداد

## 1. الدورات المدفوعة (مقاطع فيديو مسجلة)

### شروط الاسترداد:
- **المدة المسموحة**: 7 أيام فقط من تاريخ الشراء
- **شرط الاستحقاق**: المستخدم لم يشاهد **أكثر من 10%** من محتوى الدورة
- **بعد 7 أيام**: غير قابل للاسترداد **نهائياً**
- **بعد مشاهدة 10%+**: غير قابل للاسترداد **نهائياً**

### مثال:
- اشتريت دورة بـ 38$
- شاهدت 8% من المحتوى خلال 5 أيام
- طلبت استرداد → **سيتم الاسترجاع كاملاً**

- شاهدت 12% من المحتوى → **لن يتم استرجاع شيء**

## 2. الجلسات التفاعلية المباشرة

### شروط الاسترداد:
- **المدة المسموحة**: حتى **24 ساعة قبل** موعد الجلسة فقط
- **عدم الحضور**: غير مسموح باسترجاع
- **الإلغاء في آخر 24 ساعة**: غير مسموح باسترجاع

### مثال:
- جلسة مجدولة: الأحد الساعة 8 صباحاً
- يمكن الاسترجاع: حتى السبت الساعة 8 صباحاً
- لا يمكن الاسترجاع: بعد السبت الساعة 8 صباحاً

## 3. المحتوى المجاني (كتب + ألعاب تعليمية)

### **لا توجد رسوم - لا استسترجاع**

جميع الكتب والألعاب في المكتبة الرقمية:
- **مجانية 100%** - لا توجد رسوم للوصول
- **للاستخدام على الموقع فقط** - لا يُسمح بالتحميل
- **محمية بحقوق الملكية** - لا يمكن نسخها أو مشاركتها
- **غير قابلة للاسترداد** - لا توجد قيمة مالية

## 4. رسوم المعالجة والبنوك

### **غير قابلة للاسترجاع**

- رسوم بوابة الدفع (Paddle): **غير مسترجعة**
- رسوم البنك: **غير مسترجعة**
- سيتم خصمها من أي مبلغ استرجاع مقبول

### مثال:
- سعر الدورة: 38$
- رسوم البوابة: 2$ (خصمت من حسابك عند الدفع)
- المبلغ المسترجع: 36$ فقط (بدون رسوم البوابة)

## 5. طريقة الاسترجاع

### العملية:
1. **تقديم الطلب**: اتصل بنا عبر البريد أو الواتس
2. **المراجعة**: نتحقق من شروط الاسترجاع (7 أيام، أقل من 10%)
3. **الموافقة**: إذا استوفيت الشروط
4. **المعالجة**: 5-10 أيام عمل
5. **الاستقبال**: المبلغ يعود للطريقة الأصلية

## 6. الحالات التي لا يتم فيها الاسترجاع

- **بعد 7 أيام** من الشراء
- **بعد مشاهدة 10%+** من المحتوى
- **عدم حضور الجلسة المباشرة** بدون إلغاء مسبق
- **الإلغاء في آخر 24 ساعة** من الجلسة
- **خطأ في الاختيار** أو عدم الرضا (بدون شروط أخرى)

## 7. التواصل

للاستفسار عن الاسترجاع:
- **البريد الإلكتروني**: support@quran-elhafez.com
- **الواتساب**: +201130127894
- **التليجرام**: @academy_quraan
'
);

-- Refund Policy - English (NEW)
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'refund-policy',
  'en',
  'Refund Policy',
  '# Refund Policy

## 1. Paid Courses (Pre-recorded Video Libraries)

### Refund Conditions:
- **Time Window**: 7 days only from purchase date
- **Usage Requirement**: Student has watched **less than 10%** of course content
- **After 7 Days**: Non-refundable **permanently**
- **After 10% Viewing**: Non-refundable **permanently**

### Example:
- Purchased course for $38
- Watched 8% of content within 5 days
- Requested refund → **Full refund approved**

- Watched 12% of content → **No refund issued**

## 2. Live Interactive Sessions

### Refund Conditions:
- **Time Window**: Up to **24 hours before** session start only
- **No-Show**: Not eligible for refund
- **Cancellation within 24 hours**: Not eligible for refund

### Example:
- Session scheduled: Sunday 8:00 AM
- Refund available until: Saturday 8:00 AM
- Refund unavailable after: Saturday 8:00 AM

## 3. Free Content (Books + Educational Games)

### **No Charges - No Refunds**

All books and games in the digital library:
- **100% Free** - No access charges
- **On-site usage only** - No downloads permitted
- **Copyright protected** - Cannot be copied or shared
- **Non-refundable** - No monetary value

## 4. Processing & Bank Fees

### **Non-refundable**

- Payment gateway fees (Paddle): **Non-refundable**
- Bank fees: **Non-refundable**
- Deducted from any approved course refund

### Example:
- Course price: $38
- Gateway fees: $2 (charged at purchase)
- Refund amount: $36 only (fees not refunded)

## 5. Refund Method

### Process:
1. **Submit Request**: Contact us via email or WhatsApp
2. **Review**: We verify refund conditions (7 days, <10% viewed)
3. **Approval**: If conditions met
4. **Processing**: 5-10 business days
5. **Receipt**: Amount returned to original payment method

## 6. Non-refundable Cases

- **After 7 days** from purchase
- **After viewing 10%+** of course content
- **No-show for live session** without prior cancellation
- **Cancellation within 24 hours** of session
- **Buyer''s remorse** or dissatisfaction (without other conditions)

## 7. Contact Us

For refund inquiries:
- **Email**: support@quran-elhafez.com
- **WhatsApp**: +201130127894
- **Telegram**: @academy_quraan
'
);

-- Refund Policy - French (NEW)
INSERT INTO legal_pages (page_slug, locale, title, content) VALUES
(
  'refund-policy',
  'fr',
  'Politique de Remboursement',
  '# Politique de Remboursement

## 1. Cours Payants (Bibliothèques Vidéo Préenregistrées)

### Conditions de Remboursement:
- **Délai**: 7 jours seulement à partir de la date d''achat
- **Condition d''utilisation**: L''étudiant a regardé **moins de 10%** du contenu
- **Après 7 jours**: Non remboursable **définitivement**
- **Après 10% de visionnage**: Non remboursable **définitivement**

### Exemple:
- Cours acheté pour 38$
- Visionnage 8% du contenu en 5 jours
- Demande de remboursement → **Remboursement complet approuvé**

- Visionnage 12% du contenu → **Pas de remboursement**

## 2. Sessions Interactives en Direct

### Conditions de Remboursement:
- **Délai**: Jusqu''à **24 heures avant** le début de la session
- **Absence**: Non éligible au remboursement
- **Annulation dans les 24 heures**: Non éligible au remboursement

### Exemple:
- Session prévue: Dimanche 8:00 AM
- Remboursement disponible jusqu''à: Samedi 8:00 AM
- Remboursement indisponible après: Samedi 8:00 AM

## 3. Contenu Gratuit (Livres + Jeux Éducatifs)

### **Pas de Frais - Pas de Remboursement**

Tous les livres et jeux de la bibliothèque numérique:
- **100% Gratuit** - Pas de frais d''accès
- **Utilisation sur place uniquement** - Téléchargements non autorisés
- **Protégé par le droit d''auteur** - Impossible à copier ou partager
- **Non remboursable** - Pas de valeur monétaire

## 4. Frais de Traitement et Bancaires

### **Non-remboursables**

- Frais de passerelle de paiement (Paddle): **Non-remboursables**
- Frais bancaires: **Non-remboursables**
- Déduits de tout remboursement de cours approuvé

### Exemple:
- Prix du cours: 38$
- Frais de passerelle: 2$ (facturés à l''achat)
- Montant du remboursement: 36$ uniquement (frais non remboursés)

## 5. Méthode de Remboursement

### Processus:
1. **Soumettre la demande**: Nous contactez par e-mail ou WhatsApp
2. **Révision**: Vérification des conditions de remboursement (7 jours, <10% visionnés)
3. **Approbation**: Si conditions remplies
4. **Traitement**: 5-10 jours ouvrables
5. **Réception**: Montant retourné au mode de paiement original

## 6. Cas Non-Remboursables

- **Après 7 jours** d''achat
- **Après visionnage de 10%+** du contenu
- **Absence à la session en direct** sans annulation préalable
- **Annulation dans les 24 heures** avant la session
- **Regrets d''achat** ou insatisfaction (sans autres conditions)

## 7. Nous Contacter

Pour les demandes de remboursement:
- **E-mail**: support@quran-elhafez.com
- **WhatsApp**: +201130127894
- **Telegram**: @academy_quraan
'
);

-- =====================================================================
-- COMMENT FOR CLARITY
-- =====================================================================
COMMENT ON TABLE legal_pages IS 'Dynamic legal content pages (Terms, Privacy, Refund Policy) with full multilingual support (AR, EN, FR). Updated via Admin Dashboard.';
COMMENT ON COLUMN legal_pages.page_slug IS 'Page identifier: terms, privacy, refund-policy';
COMMENT ON COLUMN legal_pages.locale IS 'Language code: ar (Arabic), en (English), fr (French)';
