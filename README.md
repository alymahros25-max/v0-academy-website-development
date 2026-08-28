# أكاديمية الحافظ المتميز

<p align="center">
  <strong>منصة تعليمية عربية لتحفيظ القرآن الكريم وتأسيس اللغة العربية عبر الإنترنت</strong>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2.11-000000?logo=next.js&logoColor=white" alt="Next.js 16.2.11"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.7.3"></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white" alt="pnpm 10"></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white" alt="Supabase"></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white" alt="Node.js 24">
  <img src="https://img.shields.io/badge/Performance-Lighthouse%20CI-success?logo=lighthouse&logoColor=white" alt="Lighthouse CI">
  <img src="https://img.shields.io/badge/RTL-Arabic-8A2BE2" alt="Arabic RTL">
  <img src="https://img.shields.io/badge/Status-Active-22C55E" alt="Active project">
</p>

## نبذة عن المشروع

**أكاديمية الحافظ المتميز** موقع تعليمي متجاوب يقدّم برامج تحفيظ القرآن الكريم وتأسيس اللغة العربية للطلاب والأسر. يعتمد الموقع على صفحات هبوط محلية موجهة إلى جمهور عدد من الدول، مع محتوى وباقات ورسائل تواصل مناسبة لكل سوق، ويتيح بدء التواصل والحجز عبر أزرار WhatsApp.

يركز المشروع على تقديم تجربة عربية واضحة على الهاتف والكمبيوتر، مع الحفاظ على سرعة التحميل، وإتاحة الوصول، واستقرار التخطيط، وفصل بيانات الإدارة والخدمات الحساسة عن كود المتصفح.

## المزايا الرئيسية

| المجال | الوصف |
| --- | --- |
| البرامج التعليمية | برامج لتحفيظ القرآن الكريم وتأسيس اللغة العربية، مع خيارات مدة الحصة وعدد الحصص الأسبوعية. |
| صفحات الهبوط المحلية | صفحات مستقلة للسعودية والإمارات والولايات المتحدة وكندا والمملكة المتحدة وأستراليا وألمانيا، مع محتوى وعملة ومسارات مناسبة لكل دولة. |
| التواصل والحجز | رسائل WhatsApp مُهيّأة ببيانات البرنامج والباقات والمدة والسعر، مع إمكانية إرسال بيانات الطالب والوقت المناسب للحصة التجريبية. |
| الفيديوهات | شريط فيديوهات قابل للتمرير، مع تأجيل إنشاء YouTube iframe حتى يتفاعل المستخدم لتقليل التحميل الأولي. |
| الأسئلة الشائعة | عناصر FAQ قابلة للفتح والإغلاق، بمحتوى مرتبط بالبرنامج والعمر والمواعيد والحجز. |
| لوحة التحكم | مسارات ومكونات إدارية لإدارة أجزاء الموقع، مع حماية تعتمد على متغيرات بيئة سرية. |
| SEO | Metadata وCanonical وOpen Graph وTwitter metadata، إلى جانب Sitemap وrobots.txt. |
| المراقبة والتحليلات | تكاملات اختيارية مع Sentry وVercel Analytics وVercel Speed Insights عند ضبط إعداداتها. |

## خريطة صفحات الموقع

```mermaid
flowchart TD
    HOME[الصفحة الرئيسية] --> ABOUT[عن الأكاديمية]
    HOME --> PROGRAMS[البرامج التعليمية]
    HOME --> TRUST[المعلمون والمراجعات]
    HOME --> RESOURCES[المكتبة والمدونة]
    HOME --> ENGAGE[الألعاب ولحظات الفصول]
    HOME --> CONTACT[التواصل والحجز]
    HOME --> COUNTRY[صفحات الدول]
    HOME --> ACCOUNT[الحساب]
    HOME --> ADMIN[لوحة التحكم]

    PROGRAMS --> QURAN[تحفيظ القرآن /quran]
    PROGRAMS --> ARABIC[تأسيس العربية /arabic]
    TRUST --> TEACHERS[المعلمون /teachers]
    TRUST --> REVIEWS[المراجعات /reviews]
    RESOURCES --> LIBRARY[المكتبة /library]
    RESOURCES --> BLOG[المدونة /blog]
    ENGAGE --> GAMES[الألعاب /games]
    ENGAGE --> MOMENTS[لحظات الفصول /moments-classroom]

    COUNTRY --> SA[السعودية /arabia-saudi]
    COUNTRY --> UAE[الإمارات /emirates-arab-united]
    COUNTRY --> US[الولايات المتحدة /states-united]
    COUNTRY --> CA[كندا /canada]
    COUNTRY --> UK[المملكة المتحدة /kingdom-united]
    COUNTRY --> AU[أستراليا /australia]
    COUNTRY --> DE[ألمانيا /germany]

    classDef primary fill:#0f766e,color:#fff,stroke:#115e59,stroke-width:2px;
    classDef content fill:#dbeafe,color:#172554,stroke:#2563eb;
    classDef country fill:#fef3c7,color:#78350f,stroke:#f59e0b;
    classDef admin fill:#fee2e2,color:#7f1d1d,stroke:#dc2626;
    class HOME primary;
    class PROGRAMS,TRUST,RESOURCES,ENGAGE,CONTACT,ACCOUNT content;
    class COUNTRY,SA,UAE,US,CA,UK,AU,DE country;
    class ADMIN admin;
```

## البنية التقنية

```mermaid
flowchart LR
    USER[الزائر أو الطالب] --> NEXT[Next.js 16 + React 19]
    NEXT --> UI[مكونات React وTailwind CSS]
    NEXT --> SERVER[Server Components وRoute Handlers]
    SERVER --> DB[(Supabase)]
    SERVER --> PAY[Stripe عند تفعيله]
    SERVER --> OBS[Sentry عند تفعيله]
    NEXT --> ANALYTICS[Vercel Analytics وSpeed Insights]
    NEXT --> MEDIA[صور Next.js وSharp وفيديوهات مؤجلة]
    ADMINUI[لوحة الإدارة /admin] --> AUTH[مصادقة الإدارة ومتغيرات سرية]
    AUTH --> SERVER

    classDef app fill:#111827,color:#fff,stroke:#374151,stroke-width:2px;
    classDef service fill:#dcfce7,color:#14532d,stroke:#22c55e;
    classDef optional fill:#fef3c7,color:#78350f,stroke:#f59e0b;
    class USER,NEXT,UI,SERVER,ADMINUI,AUTH app;
    class DB,MEDIA,ANALYTICS service;
    class PAY,OBS optional;
```

يعتمد التطبيق على تصيير الخادم عند الحاجة، ويمتنع عن تحميل الوسائط الثقيلة أو إنشاء إطارات الفيديو قبل تفاعل المستخدم. كما تم تقليل عمل مستمعات التمرير وتأجيل عرض أجزاء أسفل الصفحة، مع تصيير إحصاءات الصفحة الرئيسية من الخادم لتقليل العمل في المتصفح.

## هيكل المستودع

| المسار | المسؤولية |
| --- | --- |
| `app/` | صفحات Next.js، المسارات العامة، صفحات الدول، لوحة الإدارة، `sitemap.ts` و`robots.ts`. |
| `components/` | مكونات التخطيط والصفحة الرئيسية ولوحة الإدارة والفيديوهات والعناصر المشتركة. |
| `lib/` | إعدادات صفحات الدول والباقات وWhatsApp، المصادقة الإدارية، الأمان، الأداء، والبيانات المنظمة. |
| `public/` | الصور والملفات العامة المستخدمة فعليًا في الموقع. |
| `supabase/migrations/` | ملفات ترحيل قاعدة البيانات، وتشمل جداول CMS والفيديوهات والمدفوعات والصفحات القانونية. |
| `.github/workflows/` | سير عمل GitHub Actions، بما في ذلك فحص Lighthouse CI. |
| `docs/` | المستندات والملاحظات المساندة للمشروع. |

## المسارات المحلية

| الدولة | المسار |
| --- | --- |
| السعودية | `/arabia-saudi` |
| الإمارات | `/emirates-arab-united` |
| الولايات المتحدة | `/states-united` |
| كندا | `/canada` |
| المملكة المتحدة | `/kingdom-united` |
| أستراليا | `/australia` |
| ألمانيا | `/germany` |

## متطلبات التشغيل

يحتاج المشروع إلى **Node.js 24** و**pnpm 10** أو إصدارات متوافقة مع إعدادات CI والنشر. يجب ضبط متغيرات البيئة المطلوبة للميزات المفعّلة قبل تشغيل مسارات Supabase أو الإدارة أو الدفع محليًا.

```bash
git clone https://github.com/alymahros25-max/v0-academy-website-development.git
cd v0-academy-website-development
pnpm install
pnpm dev
```

بعد التشغيل يصبح الموقع متاحًا عادةً على `http://localhost:3000`.

## أوامر المشروع

| الأمر | الوظيفة |
| --- | --- |
| `pnpm dev` | تشغيل خادم التطوير باستخدام Turbopack. |
| `pnpm build` | إنشاء نسخة الإنتاج. |
| `pnpm start` | تشغيل نسخة الإنتاج بعد البناء. |
| `pnpm lint` | تشغيل ESLint. |
| `pnpm exec tsc --noEmit` | فحص TypeScript دون إنشاء ملفات مخرجات. |

يوصى بتشغيل فحوص الجودة قبل فتح Pull Request:

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

## متغيرات البيئة

أنشئ ملف `.env.local` محليًا، ولا ترفع قيم الأسرار إلى Git أو GitHub Issues أو Pull Requests أو لقطات الشاشة. قد تستخدم الميزات المفعّلة المتغيرات التالية:

| المتغير | الاستخدام | مستوى الحساسية |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | رابط Supabase العام | عام للتطبيق |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | المفتاح العام للعميل | عام للتطبيق، مع تطبيق سياسات RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | عمليات الخادم الموثوقة | سري جدًا؛ لا يُستخدم في المتصفح |
| `ADMIN_EMAIL` | بريد الإدارة | سري |
| `ADMIN_PASSWORD_HASH` | Hash كلمة مرور الإدارة | سري جدًا |
| `ADMIN_SESSION_SECRET` | توقيع جلسات الإدارة | سري جدًا |
| `NEXT_PUBLIC_SENTRY_DSN` | مراقبة الأخطاء عند التفعيل | إعداد عام نسبيًا |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics عند التفعيل | إعداد عام |
| `STRIPE_SECRET_KEY` | عمليات Stripe على الخادم | سري جدًا |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | مفتاح Stripe العام | عام للتطبيق |
| `NEXT_PUBLIC_PAYMENTS_ENABLED` | إظهار واجهة الاشتراك والدفع | معطّل افتراضيًا؛ لا يُفعّل إلا بعد اختبار Preview |
| `PAYMENTS_ENABLED` | السماح الخادمي بإنشاء جلسات الدفع | سري/تشغيلي؛ يجب أن يظل غير مضبوط أو `false` حتى الإطلاق |

في Vercel يجب ضبط القيم المناسبة في بيئتي **Production** و**Preview** كلٌ حسب حاجته. لا تضع مفاتيح الخدمة أو مفاتيح Stripe السرية في متغيرات عامة أو داخل مكونات العميل.

### حالة الدفع الحالية

الدفع مجهّز من ناحية الجداول والخدمات والـ webhooks، لكنه **مخفي ومعطّل افتراضيًا**. لا تظهر أزرار الاشتراك ولا تُنشأ جلسات Stripe أو Paddle ما لم يتم ضبط متغيري `NEXT_PUBLIC_PAYMENTS_ENABLED=true` و`PAYMENTS_ENABLED=true` صراحةً. راجع `MULTI_PROVIDER_PAYMENTS.md` و`STRIPE_SETUP.md` قبل أي تفعيل.

## قاعدة البيانات وSupabase Preview

توجد migrations داخل `supabase/migrations/`، ويجب تطبيقها بالترتيب عند تحديث بنية قاعدة البيانات. عند تفعيل GitHub Integration وAutomatic Branching في Supabase، يمكن إنشاء فرع معاينة معزول لكل Pull Request يحتوي على تغييرات قاعدة بيانات.

```mermaid
sequenceDiagram
    participant DEV as المطور
    participant GH as GitHub Pull Request
    participant SB as Supabase Preview Branch
    participant VC as Vercel Preview

    DEV->>GH: فتح أو تحديث Pull Request
    GH->>SB: اكتشاف تغييرات supabase/migrations
    SB->>SB: تطبيق migrations في بيئة معزولة
    GH-->>DEV: تعليق بحالة Supabase Preview
    GH->>VC: تشغيل Preview Deployment
    VC-->>DEV: رابط نسخة المعاينة
    GH->>GH: الدمج أو الإغلاق
    GH->>SB: حذف فرع المعاينة بعد انتهاء PR
```

إذا ظهر فحص **Supabase Preview** بحالة `Skipped`، فتحقق من أن GitHub Integration مفعّل، وأن المستودع ومجلد العمل مضبوطون على المستودع الحالي ومجلد `.`، وأن خيار الاقتصار على تغييرات Supabase لا يمنع الفحص في نوع الـ PR الذي تختبره. لا تُنشئ migration وهمية لمجرد إزالة علامة `Skipped`.

## النشر وCI/CD

يُنشر المشروع على Vercel من مستودع GitHub. فرع `main` يمثل مصدر النشر الإنتاجي، بينما تُستخدم فروع Pull Request لمعاينات مستقلة عند تفعيل التكاملات المناسبة.

تم تحديث بيئة GitHub Actions لتستخدم **Node.js 24** و**pnpm 10**. كما تم إصلاح Lighthouse CI ليبدأ خادم Next.js محليًا قبل الفحص، ومعالجة تشغيل Chrome في بيئة CI باستخدام `--no-sandbox` عند الحاجة. يجب اعتبار نجاح البناء منفصلًا عن صحة بيانات الدخول أو اتصال الخدمات الخارجية؛ اختبر كل خدمة ضمن نطاقها.

## الأداء وإمكانية الوصول

أحدث قياس Lighthouse على جهاز Moto G Power مع محاكاة شبكة 4G بطيئة سجّل النتائج الآتية:

| المقياس | النتيجة | الملاحظة |
| --- | ---: | --- |
| First Contentful Paint | 1.7 ثانية | ظهور المحتوى الأول بسرعة جيدة. |
| Largest Contentful Paint | 3.5 ثانية | الأولوية الحالية للتحسين؛ الهدف أقل من 2.5 ثانية. |
| Total Blocking Time | 60 مللي ثانية | أداء JavaScript ممتاز. |
| Cumulative Layout Shift | 0.002 | استقرار بصري ممتاز. |
| Speed Index | 1.8 ثانية | ظهور معظم الصفحة بسرعة جيدة. |

الأولوية التالية هي تحسين **LCP** عبر مراجعة عنصر Hero والصورة الأكبر والخطوط ووقت استجابة الخادم، مع الحفاظ على التحسينات الحالية الخاصة بتأجيل المحتوى، وتقليل عمل التمرير، وتثبيت أبعاد الصور، وعدم إنشاء YouTube iframe قبل تفاعل المستخدم.

يجب أن تحافظ التعديلات الجديدة على دعم `prefers-reduced-motion`، وحلقات التركيز ولوحة المفاتيح، وعناصر HTML الدلالية، وروابط `a` الحقيقية، وعدم إضافة مكتبات كبيرة لتفاعل بسيط.

## الأمن والإدارة

المسارات الإدارية موجودة تحت `/admin` وتعتمد على متغيرات بيئة سرية. لا يحتوي هذا المستودع على بريد مدير أو كلمة مرور أو hash أو session secret. يجب إبقاء أسرار الخادم خارج كود المتصفح، وعدم تسجيل كلمات المرور أو المفاتيح في Logs، ومراجعة سياسات وصلاحيات Supabase قبل تفعيل أي ميزة تعتمد عليه.

هذا README توثيق تشغيلي وليس شهادة أمان أو ضمانًا قانونيًا. ينبغي اختبار مسارات الإدارة والخدمات الخارجية في بيئة آمنة، وعدم وضع بيانات شخصية حقيقية في Fixtures أو الاختبارات.

## قواعد المساهمة

اجعل كل تغيير محدودًا وواضحًا، وأعد استخدام المكونات ومصدر بيانات الباقات بدل تكرارها بين الصفحات. قبل فتح Pull Request، اختبر الهاتف والكمبيوتر، وشغّل TypeScript وLint وBuild، وراجع الروابط وSEO، وأرفق نتائج الاختبارات التي نُفّذت فعليًا. لا ترفع الأسرار أو مجلدات البيئة أو ملفات ثنائية كبيرة أو مخرجات مؤقتة.

## الترخيص وحقوق المحتوى

محتوى الموقع وهويته ومواده التعليمية تخضع لحقوق مالك المشروع ما لم يُذكر خلاف ذلك. لا تُعد استخدام الصور أو الفيديوهات أو النصوص خارج نطاق الصلاحيات الممنوحة لك.

## روابط مفيدة

| المورد | الرابط |
| --- | --- |
| المستودع | [GitHub](https://github.com/alymahros25-max/v0-academy-website-development) |
| إطار التطبيق | [Next.js](https://nextjs.org/docs) |
| قاعدة البيانات والتفرعات | [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) |
| النشر | [Vercel](https://vercel.com/docs) |
| الاختبارات والأداء | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) |

---

<p align="center"><strong>حالة الوثيقة: محدثة لتعكس بنية المشروع الحالية، إعدادات Node.js 24 وpnpm 10، إصلاحات CI، وتحسينات الأداء.</strong></p>
