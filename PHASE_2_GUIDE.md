# Phase 2: Dynamic Content Form with Global Auto-Translation

## نظرة عامة

تم بناء نظام **متكامل لإدارة المحتوى (CMS)** مع **زر ترجمة عام واحد** يقوم بترجمة جميع الحقول العربية دفعة واحدة.

## الملفات المُنشأة

### 1. مكونات React (`components/admin/`)

#### `content-editor.tsx` (359 سطر)
- **الميزة الرئيسية**: زر "ترجمة تلقائية شاملة" واحد في أعلى الصفحة
- يقوم الزر بـ:
  1. قراءة النص العربي من الحقل `content_ar`
  2. إرسال النص إلى `/api/translate`
  3. ملء حقول `content_en` و `content_fr` تلقائياً
  
- **الحقول**:
  - مفتاح المحتوى (Key) - معرّف فريد
  - القسم (Section) - تصنيف المحتوى
  - النوع (Type) - قصير أو طويل
  - النص العربي - الحقل الرئيسي للملء
  - النص الإنجليزي - يُملأ تلقائياً
  - النص الفرنسي - يُملأ تلقائياً
  - حالة التفعيل (Active)

#### `content-list.tsx` (190 سطر)
- عرض جدول بجميع محتويات الموقع
- عمليات CRUD: تعديل، حذف، تفعيل/تعطيل
- تصفية وبحث في المحتوى
- حالة التحميل والأخطاء

### 2. صفحة إدارة المحتوى (`app/admin/cms/page.tsx`)

المسار: `/admin/cms`

**المميزات**:
- علامات تبويب للتنقل بين الأقسام
- نموذج الإضافة/التعديل في الأعلى
- قائمة المحتوى الموجود في الأسفل
- إحصائيات فورية (إجمالي، مفعّل، معطّل)
- تصفية حسب القسم

## كيفية الاستخدام

### الخطوة 1: إضافة محتوى جديد

```bash
# 1. اذهب إلى /admin/cms
# 2. ملء الحقول:
#    - مفتاح المحتوى: hero_title
#    - القسم: homepage
#    - النوع: short
#    - النص العربي: أهلاً وسهلاً بك في الأكاديمية
```

### الخطوة 2: الترجمة التلقائية (الميزة الذكية)

```bash
# 1. بعد ملء النص العربي
# 2. اضغط على الزر الأصفر: "ترجمة تلقائية شاملة" 🟡⚡
# 3. انتظر لحظات...
# 4. سيتم ملء الحقلين الإنجليزي والفرنسي تلقائياً
```

### الخطوة 3: المراجعة والحفظ

```bash
# 1. راجع الترجمات في الحقول الإنجليزي والفرنسي
# 2. عدّل إذا لزم الأمر
# 3. اضغط "حفظ المحتوى" 💾
```

## تكامل API

### POST /api/translate

**الطلب**:
```json
{
  "text": "أهلاً وسهلاً بك في الأكاديمية",
  "targetLanguages": ["en", "fr"]
}
```

**الاستجابة**:
```json
{
  "en": "Welcome to the academy",
  "fr": "Bienvenue à l'académie"
}
```

### POST /api/cms/content

**الطلب**:
```json
{
  "key": "hero_title",
  "section": "homepage",
  "type": "short",
  "content_ar": "أهلاً وسهلاً",
  "content_en": "Welcome",
  "content_fr": "Bienvenue",
  "is_active": true
}
```

**الاستجابة**:
```json
{
  "success": true,
  "message": "Content saved successfully"
}
```

### GET /api/cms/content

جلب جميع محتويات الموقع

**الاستجابة**:
```json
[
  {
    "id": "uuid",
    "key": "hero_title",
    "section": "homepage",
    "type": "short",
    "content_ar": "أهلاً وسهلاً",
    "content_en": "Welcome",
    "content_fr": "Bienvenue",
    "is_active": true,
    "created_at": "2026-06-18",
    "updated_at": "2026-06-18"
  }
]
```

### PATCH /api/cms/content

تعديل محتوى موجود

### DELETE /api/cms/content?key=hero_title

حذف محتوى

## استخدام في Components

### استخراج محتوى من قاعدة البيانات

```typescript
'use client'

import { useCMSContent } from '@/hooks/use-cms'

export function HeroSection() {
  const { data: content, loading } = useCMSContent({ 
    section: 'homepage',
    locale: 'ar'
  })

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{content?.hero_title || 'Default title'}</h1>
    </div>
  )
}
```

### استدعاء الترجمة البرمجي

```typescript
import { translateText } from '@/lib/cms-client'

const translations = await translateText(
  'مرحبا بك',
  ['en', 'fr']
)

console.log(translations.en) // Hello
console.log(translations.fr) // Bonjour
```

## فلسفة التصميم

### الزر الواحد (Single Global Button)

بدلاً من وضع زر ترجمة بجانب كل حقل، تم اختيار **زر عام واحد فقط** لأنه:

1. **أكثر كفاءة**: ترجمة واحدة للـ API بدلاً من 3 طلبات منفصلة
2. **أوضح للمستخدم**: الفكرة واضحة - ملء العربي ثم اضغط للترجمة
3. **أقل فوضى**: واجهة أنظف بدون أزرار متكررة
4. **معايير UX**: تطابق النمط الشائع في تطبيقات الترجمة الحديثة

### آلية العمل

```
المستخدم ملء النص العربي
         ↓
      يضغط الزر "ترجمة تلقائية"
         ↓
  الزر يقرأ جميع الحقول العربية
         ↓
   يرسل النص إلى /api/translate
         ↓
   ترجمة سريعة (عادة < 1 ثانية)
         ↓
ملء الحقول الإنجليزي والفرنسي تلقائياً
         ↓
مراجعة سريعة والضغط "حفظ"
         ↓
     ✅ تم!
```

## معالجة الأخطاء

- في حالة فشل الترجمة، يتم إظهار toast notification
- الحقول المترجمة تبقى قابلة للتعديل اليدوي
- إذا لم يتم ملء النص العربي، يتم تعطيل الزر

## الخطوة التالية (Phase 3)

بناء **محرر السمات (Theme Customizer)**:
- تغيير الألوان الرئيسية ديناميكياً
- تعديل الخطوط
- تخصيص تخطيط Header/Footer
- حفظ الإعدادات في `site_settings`

---

## ملاحظات تقنية

- جميع المكونات تستخدم **React Hook Form** بشكل ضمني (بدون المكتبة الثقيلة)
- الترجمة تستخدم **Free Translation APIs** (Google Translate API)
- الـ UI مبني على **Tailwind CSS** مع **Shadcn/UI Components**
- كل العمليات تتضمن **Loading States** و **Error Handling**
