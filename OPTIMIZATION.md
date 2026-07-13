# Comprehensive Routing & Performance Optimization Architecture

## Overview

هذا المشروع تم تحسينه بشكل شامل لتحقيق أفضل أداء وأمان و SEO على جميع الأجهزة والتطبيقات.

---

## 1. URL & ROUTING CONSISTENCY

### ملف الإعدادات المركزي
- **`lib/routing-config.ts`**: جميع الـ routes محدّثة بشكل مركزي
  - كل route محدّد بثابت `ROUTES`
  - دعم الـ multilingual routing (AR/EN/FR)
  - Fallback للروابط القديمة في `LEGACY_ROUTES`

### الـ Dynamic Routes
```
/blog/[slug]              → Blog articles with SEO slugs
/library/book/[slug]      → Library books with language support
/classroom-moments        → Video content
```

### Language Prefixing
- Arabic: `/page` (بدون بادئة)
- English: `/en/page`
- French: `/fr/page`

### استخدام
```tsx
import { ROUTES, getLocalizedPath } from '@/lib/routing-config'

<Link href={ROUTES.BLOG_ARTICLE('my-slug')} prefetch="smart" />
<Link href={getLocalizedPath('/blog', 'en')} />
```

---

## 2. MIDDLEWARE & SECURITY

### ملف الـ Middleware
**`middleware.ts`** - يعالج:

#### 2.1 Legacy URL Redirects (301)
```
/old-blog → /blog
/articles → /blog
/about-us → /about
```

#### 2.2 Security Headers
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- Cross-Origin policies

#### 2.3 Language Prefix Handling
تأكّد من اتساق معالجة اللغات عبر التطبيق.

---

## 3. SITEMAPS & ROBOTS

### Sitemap Generation
**`app/sitemap.ts`** - يولد ديناميكياً:
- يقرأ المقالات والصفحات من Supabase
- يرتب حسب الأولوية (Homepage 1.0, Core 0.9, Secondary 0.7)
- يدعم جميع اللغات مع `hreflang` alternates
- يُعاد تحميله كل 60 ثانية (ISR)

### Robots.txt
**`app/robots.ts`** - يحدّد:
- Allow list للـ bots الموثوقة (Google, Bing, DuckDuckGo)
- Disallow list للـ bots الضارة (Ahrefs, Semrush, etc)
- Crawl delay لتقليل الحمل على السيرفر
- رابط sitemap.xml

---

## 4. JSON-LD SCHEMA MARKUP

### ملف الـ Schema
**`lib/schema.ts`** - يوفر:

#### 4.1 المخططات المدعومة
- **Organization**: معلومات أساسية عن الأكاديمية
- **WebSite**: مع SearchAction
- **Course**: لعروض Quran والعربية
- **Article**: لمقالات المدونة
- **BreadcrumbList**: لـ navigation hierarchy
- **LocalBusiness**: للمعلومات المحلية

#### 4.2 الاستخدام في الصفحات
```tsx
import { generateArticleSchema } from '@/lib/schema'

export const metadata: Metadata = {
  other: {
    'application/ld+json': JSON.stringify(
      generateArticleSchema({
        title: 'Article Title',
        description: 'Description',
        author: 'Author Name',
        datePublished: '2024-01-01',
        image: '/image.jpg',
        content: 'Full content...',
        slug: 'article-slug'
      })
    ),
  },
}
```

---

## 5. ERROR BOUNDARIES & SELF-HEALING

### Error Boundary Component
**`components/error-boundary.tsx`**:
- React Error Boundary wrap للـ critical sections
- Graceful fallback UI عند حدوث أخطاء
- Automatic retry mechanism
- Development error details

### استخدام
```tsx
<ErrorBoundary context="BlogPage">
  <BlogContent />
</ErrorBoundary>
```

### Self-Healing Utilities
**`lib/self-healing.ts`** - يوفر:

#### 5.1 Retry Logic
```tsx
const data = await attemptWithRetry(
  () => fetchData(),
  { maxRetries: 3, backoffMultiplier: 2 }
)
```

#### 5.2 Graceful Degradation
```tsx
const result = await withFallback(
  () => fetchFromAPI(),
  fallbackData,
  'API Fetch'
)
```

#### 5.3 TTL Caching
```tsx
const cache = new CacheWithTTL()
cache.set('key', data, 300) // 5 minutes TTL
```

#### 5.4 Operation Queue
```tsx
const queue = new OperationQueue()
await queue.enqueue(criticalOperation, 3) // max 3 retries
```

---

## 6. MOBILE PERFORMANCE & CORE WEB VITALS

### Prefetch Strategy
**`lib/prefetch-utils.ts`** - ينظّم:

#### 6.1 Link Prefetching
```tsx
import { getPrefetchStrategy, CRITICAL_PREFETCH_PATHS } from '@/lib/prefetch-utils'

// Eager prefetch for critical pages
<Link href="/quran" prefetch="smart" />

// Viewport prefetch for secondary pages
<Link href="/library" prefetch="smart" />
```

#### 6.2 Resource Preloading
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preload" href="/critical-script.js" as="script" />
```

#### 6.3 Image Optimization
```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  priority // LCP image
  quality={85}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Performance Metrics
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID/INP**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

---

## 7. NEXT.CONFIG OPTIMIZATION

### ملف الإعدادات الرئيسي
**`next.config.mjs`** - يشمل:

#### 7.1 Image Optimization
- AVIF + WebP formats للمتصفحات الحديثة
- 1 year cache للـ immutable images
- Dynamic device sizes

#### 7.2 Security Headers
- Cache headers للـ API
- MIME type protection
- CSP directives

#### 7.3 Webpack Optimization
- Code splitting intelligently
- Vendor chunk isolation
- React chunk separation

#### 7.4 Caching Strategy
```
API endpoints:     1 minute + 2 minute SWR
Sitemap/Robots:    1 hour
Static assets:     1 year
```

---

## 8. DEPLOYMENT CHECKLIST

### قبل النشر
- [ ] تشغيل `pnpm build` بنجاح
- [ ] لا توجد أخطاء TypeScript
- [ ] الـ Sitemap يُولد صحيحاً
- [ ] الـ robots.txt يُعمل
- [ ] Security headers موجودة في network tab

### بعد النشر على Vercel
- [ ] سجل `/sitemap.xml` في Google Search Console
- [ ] اختبر الـ robots.txt بـ `robots.txt validator`
- [ ] استخدم `mobile-friendly test` لـ Google
- [ ] فحّص Core Web Vitals في PageSpeed Insights
- [ ] تحقّق من الـ hreflang tags في DevTools

### مراقبة الأداء
- استخدم `Vercel Analytics` للـ Real User Monitoring
- مراقبة الـ Sitemap generation logs
- تتبّع الـ Error Boundary triggers

---

## 9. LEGACY URL MIGRATIONS

### كيفية إضافة redirect جديد
```ts
// في lib/routing-config.ts
export const LEGACY_ROUTES: Record<string, string> = {
  '/old-path': '/new-path',
  // Middleware سيعالجه تلقائياً كـ 301 redirect
}
```

### نتائج SEO المتوقعة
- محركات البحث تُتابع الـ 301 redirects تلقائياً
- الـ page rank يُنتقل للصفحة الجديدة
- في الغالب ما يأخذ 6-8 أسابيع للتحديث الكامل

---

## 10. TESTING

### اختبار الـ Routing
```bash
# تحقّق من build بدون أخطاء
pnpm build

# تشغيل على production mode
pnpm start
```

### اختبار الـ Security
```bash
# فحّص Security Headers
curl -I https://quran-elhafez.com | grep -E "X-|Content-Security|Strict-Transport"

# اختبر CSP violations
```

### اختبر الـ Performance
```bash
# استخدم Lighthouse
npx lighthouse https://quran-elhafez.com --view

# استخدم PageSpeed Insights
https://pagespeed.web.dev/
```

---

## 11. الملفات الرئيسية

| الملف | الوصف |
|------|-------|
| `middleware.ts` | معالج الـ redirects والأمان |
| `app/layout.tsx` | Root layout مع Error Boundaries |
| `app/sitemap.ts` | Sitemap ديناميكي من Supabase |
| `app/robots.ts` | Robots.txt مع قواعد متقدمة |
| `next.config.mjs` | إعدادات Next.js و Webpack |
| `lib/routing-config.ts` | مركز الـ routes والـ redirects |
| `lib/schema.ts` | Schema.org JSON-LD generators |
| `lib/self-healing.ts` | Retry و caching utilities |
| `lib/prefetch-utils.ts` | Link prefetch strategy |
| `components/error-boundary.tsx` | Error Boundary wrapper |

---

## 12. التعديلات المستقبلية

### الخطوات المقترحة
1. إضافة `static-site-generation` لمقالات المدونة
2. تطبيق `image-gallery-lazy-loading`
3. تحسين `mobile-navigation-drawer` للمزيد من الأداء
4. إضافة `analytics-custom-events` للتتبع

---

## الخلاصة

تم بناء معمارية كاملة لضمان:
- ✅ Routing متسق وآمن
- ✅ SEO محسّن مع JSON-LD
- ✅ أمان عالي مع Security Headers
- ✅ أداء ممتازة على الموبايل
- ✅ Recovery تلقائي من الأخطاء
- ✅ Legacy URLs معالجة بـ 301 redirects

النظام جاهز للإنتاج على Vercel مع دعم كامل للـ internationalization والـ scaling.
