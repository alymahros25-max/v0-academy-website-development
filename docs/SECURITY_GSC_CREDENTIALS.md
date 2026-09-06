# Google Search Console credentials

تمت إزالة بيانات خدمة Google من كود التطبيق. مسارا حالة الفهرسة وطلب الفهرسة يقرآن الآن القيم من متغيرات البيئة فقط، ويتطلبان جلسة مشرف صالحة.

## متغيرات البيئة المطلوبة

يجب ضبط المتغيرين التاليين في Vercel وبيئة التطوير، مع إبقاء القيم في Secrets أو Environment Variables الخاصة بالبيئة وعدم وضعها في GitHub repository files:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@example.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

يتم تحويل تسلسلات `\n` إلى أسطر فعلية داخل الخادم قبل إنشاء عميل Google.

## الإجراء الأمني المطلوب

كان مفتاح خدمة Google موجودًا في تاريخ Git في commit سابق. إزالة المفتاح من النسخة الحالية تمنع استخدامه من الإصدارات الجديدة، لكنها لا تلغيه من التاريخ. يجب على مالك مشروع Google Cloud إلغاء المفتاح القديم وإنشاء مفتاح جديد، ثم تحديث Vercel بالمتغيرين السابقين. لا ينبغي إعادة كتابة تاريخ مستودع مشترك دون خطة منفصلة ومراجعة جميع النسخ المستنسخة.

## نطاق الوصول

المسارات التالية محمية بجلسة الإدارة ولا تقبل إلا روابط HTTPS ضمن نطاق `quran-elhafez.com`:

- `GET /api/gsc/status`
- `POST /api/gsc/request-indexing`
- `GET /api/gsc/request-indexing`
