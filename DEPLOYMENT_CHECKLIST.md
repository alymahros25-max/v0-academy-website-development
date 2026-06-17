# 🚀 Deployment Checklist & Guide

## Pre-Deployment Verification ✅

### Local Testing
- [ ] `pnpm build` completes without errors
- [ ] `pnpm dev` runs smoothly
- [ ] No console errors or warnings in browser
- [ ] Test all 3 languages: Arabic (/), English (/en), French (/fr)
- [ ] Test blog article navigation
- [ ] Verify images load correctly with Next.js Image optimization

### Security Verification
- [ ] `next.config.ts` is present with 11 security headers
- [ ] Open DevTools → Network → click any page → see security headers
- [ ] Check "X-Content-Type-Options: nosniff" header present
- [ ] Verify CSP header is applied

### SEO Verification (Local)
- [ ] `app/sitemap.ts` generates valid XML
- [ ] `public/robots.txt` is properly formatted
- [ ] Meta tags render in HTML (inspect page source)
- [ ] Open Graph tags are present
- [ ] Mobile viewport settings are correct

---

## Vercel Deployment Steps 🚀

### Step 1: Connect GitHub Repository (if not already connected)
```bash
# Push to GitHub
git add .
git commit -m "🚀 Performance & Security Optimization Suite"
git push origin main

# Vercel will auto-deploy on push
```

### Step 2: Verify Vercel Deployment
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find project: **أكاديمية الحافظ المتميز**
3. Check deployment status: Should show ✅ **Ready**
4. Click "Visit" to preview production site

### Step 3: Verify Production URLs
Test these URLs on production:
- [ ] https://quran-elhafez.com (Homepage - Arabic)
- [ ] https://quran-elhafez.com/en (English version)
- [ ] https://quran-elhafez.com/fr (French version)
- [ ] https://quran-elhafez.com/blog (Blog listing)
- [ ] https://quran-elhafez.com/blog/quran-memorization-techniques (Article)
- [ ] https://quran-elhafez.com/sitemap.xml (Sitemap)
- [ ] https://quran-elhafez.com/robots.txt (Robots)

### Step 4: Verify Security Headers in Production
```bash
# Check security headers
curl -I https://quran-elhafez.com

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Content-Security-Policy: ...
# Strict-Transport-Security: ...
```

Or use online tool: https://securityheaders.com/?q=quran-elhafez.com

---

## Google Search Console Setup 📍

### Step 1: Claim Domain
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Enter: **https://quran-elhafez.com**
4. Verify ownership (Choose your preferred method)

### Step 2: Submit Sitemap
1. In GSC, go to: Sitemaps (left sidebar)
2. Enter URL: `https://quran-elhafez.com/sitemap.xml`
3. Click "Submit"
4. Wait for "Success" status

### Step 3: Verify Language Detection
1. Go to: Settings → Preferred domain → select HTTPS version
2. Check: Coverage → should see all your pages indexed
3. Go to: International Targeting → verify language tags detected

### Step 4: Request URL Inspection
1. In GSC search bar, test these URLs:
   - `https://quran-elhafez.com` (Arabic)
   - `https://quran-elhafez.com/en` (English)
   - `https://quran-elhafez.com/fr` (French)
2. Click "Request Indexing" for each
3. Wait for status update

### Step 5: Monitor Coverage
Check these reports regularly:
- [ ] **Coverage Report** - No errors or excluded pages
- [ ] **Sitemaps Report** - All sitemaps indexed
- [ ] **International Targeting** - All languages detected
- [ ] **Performance** - Search impressions and clicks

---

## Vercel Dashboard Monitoring 📊

### Speed Insights Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project → "Analytics" tab
3. Monitor these metrics:
   - [ ] **LCP** (Largest Contentful Paint) - Target: <2.5s
   - [ ] **FID** (First Input Delay) - Target: <100ms
   - [ ] **CLS** (Cumulative Layout Shift) - Target: <0.1
   - [ ] **FCP** (First Contentful Paint) - Target: <1.8s

### Real User Data
- Watch mobile vs desktop performance
- Monitor regional performance
- Track trends over time (should improve within 48 hours)

---

## Analytics Tracking 📈

### Vercel Analytics
1. Go to Vercel Dashboard → "Analytics" tab
2. Should see real-time visitor data
3. Track:
   - [ ] Page views by route
   - [ ] Visitor regions
   - [ ] Device types (mobile/desktop)
   - [ ] Browser types

### Google Analytics (Optional Additional Setup)
1. Go to [google.com/analytics](https://google.com/analytics)
2. Create new property for: https://quran-elhafez.com
3. Get tracking ID
4. (Optional) Add to website for enhanced tracking

---

## Lighthouse Audit (Post-Deployment)

### Run Lighthouse Audit
1. Open production URL: https://quran-elhafez.com
2. Open Chrome DevTools → Lighthouse
3. Select "Desktop" → Click "Analyze"
4. Wait 30-60 seconds for results

### Expected Scores (After Optimization)
| Category | Target | Current |
|----------|--------|---------|
| Performance | 80+ | See report |
| Accessibility | 90+ | See report |
| Best Practices | 95+ | See report |
| SEO | 100 | See report |

### Common Issues & Fixes
| Issue | Fix |
|-------|-----|
| LCP too high | Check image optimization, dynamic imports working |
| CLS issues | Verify Suspense boundaries rendering correctly |
| SEO score low | Check robots.txt and sitemap accessible |
| Missing headers | Verify next.config.ts deployed correctly |

---

## Post-Deployment Actions (24-48 Hours) ⏱️

### Day 1
- [ ] Verify all pages appear in Google Search Console
- [ ] Check Vercel Speed Insights for real user data
- [ ] Monitor for any 404 errors in GSC
- [ ] Test multi-language navigation

### Day 2
- [ ] Check Google Search Console Performance report
- [ ] Run final Lighthouse audit
- [ ] Verify all blog posts indexed
- [ ] Check for any crawl errors

### Week 1
- [ ] Review Core Web Vitals trends
- [ ] Check search impressions starting in GSC
- [ ] Monitor analytics for user behavior
- [ ] Verify all language variants indexed

---

## Rollback Plan (If Needed) 🔄

If issues arise, quickly rollback:

```bash
# Option 1: Revert last commit on GitHub
git revert HEAD
git push origin main
# Vercel auto-deploys in ~30 seconds

# Option 2: Manual rollback in Vercel
# Go to Vercel Dashboard → Deployments
# Click 3-dots on previous working deployment
# Click "Promote to Production"
```

---

## Maintenance Tasks 🔧

### Weekly
- [ ] Check Vercel Speed Insights dashboard
- [ ] Monitor Google Search Console for errors
- [ ] Quick Lighthouse audit

### Monthly
- [ ] Full performance analysis
- [ ] Update security headers if needed
- [ ] Review analytics trends
- [ ] Check for new Google Search Console issues

### Quarterly
- [ ] Major dependency updates
- [ ] Security audit
- [ ] Comprehensive Lighthouse review
- [ ] Performance baseline comparison

---

## Troubleshooting 🛠️

### Sitemap not showing in GSC
- [ ] Verify sitemap accessible: https://quran-elhafez.com/sitemap.xml
- [ ] Check robots.txt includes: `Sitemap: https://quran-elhafez.com/sitemap.xml`
- [ ] Re-submit in GSC

### Pages not indexed
- [ ] Check robots.txt not blocking page
- [ ] Verify no 404 errors for URL
- [ ] Use "Inspect URL" tool in GSC to request indexing
- [ ] Wait 2-7 days for Google to crawl

### Security headers missing
- [ ] Verify `next.config.ts` is in root directory
- [ ] Rebuild: `pnpm build` then redeploy
- [ ] Check Vercel deployment log for errors
- [ ] Clear Vercel cache and redeploy

### Performance not improving
- [ ] Check dynamic imports loaded correctly
- [ ] Verify images using Next.js Image component
- [ ] Monitor actual user data (Speed Insights)
- [ ] Check for third-party scripts slowing page

### Multi-language not working
- [ ] Test URLs: /en, /fr, /ar paths
- [ ] Check i18n configuration in components
- [ ] Verify sitemap has all language variants
- [ ] Test hreflang in HTML head tags

---

## Support & Resources 📚

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Google Search Console Help](https://support.google.com/searchconsole)
- [Speed Insights Documentation](https://vercel.com/analytics)

### Tools
- [Google Search Console](https://search.google.com/search-console)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Security Headers](https://securityheaders.com)
- [Pagespeed Insights](https://pagespeed.web.dev)

### Contact for Issues
- Technical Support: Vercel Dashboard → Support
- Google Issues: Google Search Console Help
- Security Concerns: Email alymahros25@gmail.com

---

## Success Indicators ✅

You've successfully deployed when:

- ✅ All 3 language versions accessible
- ✅ Sitemap indexed in Google Search Console
- ✅ Lighthouse Performance score ≥ 80
- ✅ Lighthouse SEO score = 100
- ✅ Security headers present on all pages
- ✅ Core Web Vitals green on Speed Insights
- ✅ No 404 errors in Google Search Console
- ✅ Analytics data flowing to Vercel dashboard
- ✅ Blog articles indexed and searchable
- ✅ Mobile performance <3s FCP

---

**Status**: Ready to Deploy ✅
**Last Updated**: June 2026
**Project**: أكاديمية الحافظ المتميز اون لاين
