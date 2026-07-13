# Zapier Integration Guide - دليل ربط Zapier

## كيفية ربط Zapier مع موقع الأكاديمية

### Step 1: الحصول على API Key
```
API Key: جهز المتغير التالي في .env
ZAPIER_API_KEY=your-secret-key-here
```

### Step 2: إعداد Zapier Webhook

في Zapier:
1. اذهب إلى https://zapier.com
2. اختر "Create" > "Zap"
3. اختر التطبيق الذي تريد (Google Docs, Notion, Airtable, إلخ)
4. كشرط (Trigger): "New Document Created" أو "New Row Added"
5. كإجراء (Action): اختر "Webhooks by Zapier" > "POST"

### Step 3: إدخال معلومات Webhook

**URL:**
```
https://quran-elhafez.com/api/zapier/publish-article
```

**Headers:**
```
x-api-key: your-secret-key-here
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "slug": "article-slug-here",
  "title": {
    "ar": "عنوان المقالة بالعربية",
    "en": "Article Title in English",
    "fr": "Titre de l'article en français"
  },
  "description": {
    "ar": "وصف المقالة بالعربية",
    "en": "Article description in English",
    "fr": "Description de l'article en français"
  },
  "content": {
    "ar": "<h2>محتوى المقالة</h2><p>النص الكامل...</p>",
    "en": "<h2>Article Content</h2><p>Full text...</p>",
    "fr": "<h2>Contenu de l'article</h2><p>Texte complet...</p>"
  },
  "category": {
    "ar": "تحفيظ القرآن",
    "en": "Quran Memorization",
    "fr": "Mémorisation du Coran"
  },
  "author": {
    "ar": "اسم الكاتب",
    "en": "Author Name",
    "fr": "Nom de l'auteur"
  },
  "date": "2024-05-20",
  "readTime": 8,
  "image": "https://example.com/image.jpg",
  "keywords": {
    "ar": "كلمة 1، كلمة 2",
    "en": "keyword 1, keyword 2",
    "fr": "mot-clé 1, mot-clé 2"
  }
}
```

---

## طرق استخدام Zapier مع الموقع:

### Option 1: Google Docs → Zapier → الموقع
1. اكتب المقالة في Google Docs
2. Zapier يراقب المجلد
3. عندما تنتهي من الكتابة، اضغط "Publish"
4. المقالة تظهر تلقائياً على الموقع

### Option 2: Notion → Zapier → الموقع
1. أنشئ Database في Notion بـ الحقول المطلوبة
2. اكتب المقالات في Notion
3. عند تغيير Status إلى "Published"
4. Zapier ترسل المقالة للموقع

### Option 3: Airtable → Zapier → الموقع
1. أنشئ Base في Airtable
2. كل صف = مقالة واحدة
3. عند إضافة صف جديد
4. Zapier ترسل البيانات للموقع

---

## اختبار الاتصال:

```bash
curl -X POST https://quran-elhafez.com/api/zapier/publish-article \
  -H "x-api-key: your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-article",
    "title": {"ar": "اختبار", "en": "Test"},
    "description": {"ar": "اختبار", "en": "Test"},
    "content": {"ar": "<p>محتوى الاختبار</p>", "en": "<p>Test content</p>"},
    "category": {"ar": "اختبار", "en": "Test"}
  }'
```

---

## ملاحظات مهمة:

⚠️ **أمان:**
- غيّر `ZAPIER_API_KEY` إلى مفتاح عشوائي قوي
- لا تشارك المفتاح مع أحد
- استخدم HTTPS دائماً

📱 **التوافق:**
- المقالات تدعم 3 لغات (عربي، إنجليزي، فرنسي)
- HTML محمول في حقل content
- الصور يجب أن تكون URLs مباشرة

🔄 **التحديث:**
- المقالات الجديدة تضاف فوراً
- Google يفهرسها خلال 24-48 ساعة
- Sitemap يتحدث تلقائياً
