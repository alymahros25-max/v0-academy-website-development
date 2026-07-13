## Week 1: Classroom Moments - Testing Guide

### Pre-Requisites
```bash
# Ensure database migration is applied
supabase migration up

# Rebuild project
cd /vercel/share/v0-project
pnpm build

# Start dev server
pnpm dev
```

---

## Manual Testing Checklist

### 1. Public Page - /classroom-moments
**URL**: http://localhost:3000/classroom-moments

- [ ] Page loads without errors
- [ ] Hero section displays with title and description
- [ ] Search bar is visible and functional
- [ ] Category filter dropdown is visible
- [ ] Empty state message appears ("No videos published yet")
- [ ] Page is responsive on mobile (375px), tablet (768px), desktop (1024px)
- [ ] SEO meta tags are present (check source)

**Terminal Check**:
```bash
curl http://localhost:3000/classroom-moments | grep "lقطات من الحصص" | head -1
```

---

### 2. Admin Panel - /admin/classroom-videos

**URL**: http://localhost:3000/admin

- [ ] Admin page loads
- [ ] "لقطات من الحصص" tab is visible with Film icon
- [ ] Click tab switches to classroom videos section
- [ ] "إضافة فيديو جديد" button is visible
- [ ] Click button shows form
- [ ] Form has 7 fields visible

**Form Fields**:
- [ ] Arabic Title (required)
- [ ] English Title (optional)
- [ ] French Title (optional)
- [ ] Arabic Description (optional)
- [ ] YouTube URL (required)
- [ ] Category (optional dropdown)
- [ ] Teacher Name (optional)

---

### 3. Admin Form - Add Video

**Test Data**:
```
Arabic Title: شرح سورة الفاتحة
YouTube URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Category: تفسير
Teacher Name: الشيخ أحمد
```

**Steps**:
1. Click "إضافة فيديو جديد"
2. Fill in form fields
3. Click "ترجمة تلقائية" button
   - [ ] English and French titles auto-fill
4. Click "حفظ الفيديو"
   - [ ] Green success toast appears: "تم حفظ الفيديو بنجاح"
   - [ ] Form resets
   - [ ] Video appears in list below

**Success Indicators**:
- [ ] No console errors
- [ ] Toast notification appears
- [ ] Form clears
- [ ] Video appears in list immediately

---

### 4. API Endpoint Testing

**Create Video**:
```bash
curl -X POST http://localhost:3000/api/cms/classroom-videos \
  -H "Content-Type: application/json" \
  -d '{
    "title_ar": "اختبار",
    "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "is_published": true
  }'
```

Expected Response:
```json
{
  "id": 1,
  "title_ar": "اختبار",
  "title_en": "test",
  "youtube_embed_id": "dQw4w9WgXcQ",
  "is_published": true,
  "revalidated": true
}
```

**Get Videos**:
```bash
curl http://localhost:3000/api/cms/classroom-videos?published=true
```

Should return array with videos created.

**Get Filters**:
```bash
# By category
curl http://localhost:3000/api/cms/classroom-videos?category=تفسير

# Featured only
curl http://localhost:3000/api/cms/classroom-videos?featured=true

# Search
curl http://localhost:3000/api/cms/classroom-videos?search=سورة
```

---

### 5. Public Page - Display Videos

After adding videos via admin:

1. Navigate to http://localhost:3000/classroom-moments
   - [ ] Videos appear in grid
   - [ ] Thumbnails load
   - [ ] Titles and descriptions visible
   - [ ] Category badges appear
   - [ ] Teacher names displayed

2. Grid Layout Check:
   - [ ] Mobile (375px): 1 column
   - [ ] Tablet (640px): 2 columns
   - [ ] Desktop (1024px): 3 columns
   - [ ] Wide (1280px): 4 columns

3. Featured Section:
   - [ ] Update a video: `is_featured = true` in database
   - [ ] Refresh page
   - [ ] Video appears in featured section above grid

---

### 6. YouTube Modal

**Steps**:
1. Click on any video card
   - [ ] Modal opens with YouTube player
   - [ ] Iframe loads video
   - [ ] Play button functional
   - [ ] Video plays without redirecting to YouTube

2. Modal Controls:
   - [ ] Close button (X) works
   - [ ] Click backdrop closes modal
   - [ ] ESC key closes modal (optional)

3. Responsive:
   - [ ] Modal fits mobile screen
   - [ ] Maintains 16:9 aspect ratio
   - [ ] Playback controls visible

---

### 7. Search & Filters

**Test Search**:
1. Type in search box: "شرح"
   - [ ] Videos filter in real-time
   - [ ] Non-matching videos hidden
   - [ ] Clear search shows all

**Test Category Filter**:
1. Select category from dropdown
   - [ ] Videos filter by category
   - [ ] "All" option shows all videos
   - [ ] Filter persists while browsing

---

### 8. Responsive Design Testing

**Mobile (375px)**:
```bash
# Chrome DevTools: Pixel 5
# or use iPhone SE size
```
- [ ] Page readable without horizontal scroll
- [ ] Touch targets > 44px
- [ ] Grid single column
- [ ] Form fields full width
- [ ] Hero section stacks

**Tablet (768px)**:
- [ ] Grid 2 columns
- [ ] Search bar accessible
- [ ] Form readable

**Desktop (1024px+)**:
- [ ] Grid 3-4 columns
- [ ] Form side-by-side layout
- [ ] All features visible

---

### 9. Error Handling

**Test Invalid YouTube URL**:
1. Enter invalid URL in form: "not-a-youtube-url"
2. Click submit
   - [ ] Error toast: "رابط يوتيوب غير صحيح"
   - [ ] Form doesn't clear
   - [ ] User can correct and try again

**Test Missing Required Fields**:
1. Leave Arabic Title empty
2. Click submit
   - [ ] Error toast: "يرجى ملء جميع الحقول المطلوبة"
   - [ ] Form doesn't clear

**Test Network Error**:
1. Disconnect internet
2. Try to add video
   - [ ] Error toast with clear message
   - [ ] Retry option

---

### 10. TypeScript Type Checking

**Verify Types**:
```bash
cd /vercel/share/v0-project

# Check for TypeScript errors
npx tsc --noEmit

# Should output: "0 errors found"
```

**Files to verify**:
- `components/classroom-moments/VideoForm.tsx`
- `components/classroom-moments/VideoGrid.tsx`
- `components/classroom-moments/YouTubeModal.tsx`
- `app/api/cms/classroom-videos/route.ts`
- `lib/youtube-utils.ts`

---

### 11. Performance Testing

**Bundle Size**:
```bash
# Check build output
pnpm build

# Should see page routes with sizes
```

**Page Load Time**:
1. Open DevTools (F12) → Network tab
2. Navigate to http://localhost:3000/classroom-moments
3. Check:
   - [ ] LCP (Largest Contentful Paint) < 2.5s
   - [ ] FID (First Input Delay) < 100ms
   - [ ] CLS (Cumulative Layout Shift) < 0.1

**ISR Revalidation**:
1. Add video in admin
2. Check page revalidation:
   - [ ] Public page updates within 5 minutes (ISR time)
   - [ ] Instant update if you manually refresh

---

### 12. Browser Compatibility

Test on:
- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+

**Check**:
- [ ] Page loads
- [ ] Grid displays correctly
- [ ] YouTube modal works
- [ ] Form submits
- [ ] No console errors

---

### 13. Accessibility Testing

**Keyboard Navigation**:
1. Press TAB repeatedly
   - [ ] Tab order is logical
   - [ ] Focus visible on all interactive elements
   - [ ] Can tab through form fields
   - [ ] Can submit form with Enter

**Screen Reader**:
1. Use browser accessibility inspector
   - [ ] All images have alt text
   - [ ] Form labels associated with inputs
   - [ ] Headings properly nested
   - [ ] ARIA labels on buttons

**Color Contrast**:
1. Use WebAIM Contrast Checker
   - [ ] Text contrast ratio ≥ 4.5:1

---

### 14. SEO Verification

**Meta Tags**:
```bash
curl http://localhost:3000/classroom-moments | grep -o '<meta[^>]*>' | head -10
```

Should include:
- [ ] `title` with "لقطات من الحصص"
- [ ] `meta name="description"`
- [ ] `meta property="og:title"`
- [ ] `meta property="og:image"`
- [ ] `meta name="twitter:card"`

**Robots Meta**:
- [ ] `robots` meta not set to "noindex"

---

### 15. Database Verification

**Check Table**:
```sql
-- In Supabase Console
SELECT COUNT(*) FROM classroom_videos;

-- Should return count of videos added
```

**Check Indexes**:
```sql
SELECT * FROM pg_indexes WHERE tablename='classroom_videos';

-- Should show 3 indexes created
```

---

## Final Checklist

- [ ] All 15 test sections completed
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Mobile responsive (all breakpoints)
- [ ] Videos appear on public page
- [ ] Admin form works
- [ ] YouTube modal works
- [ ] Search and filters work
- [ ] ISR revalidation working
- [ ] Error handling working
- [ ] Accessibility features present
- [ ] SEO tags present

---

## If Tests Fail

### Issue: Videos not appearing on public page
**Solution**:
1. Check `is_published = true` in database
2. Verify API returns data: `curl http://localhost:3000/api/cms/classroom-videos?published=true`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Rebuild: `pnpm build && pnpm dev`

### Issue: YouTube embed not loading
**Solution**:
1. Verify YouTube URL format
2. Check embed ID extracted: View network tab for iframe src
3. Try different YouTube URL
4. Check browser console for CORS errors

### Issue: Form not submitting
**Solution**:
1. Check browser console for JavaScript errors
2. Verify network request completes (DevTools Network tab)
3. Check API response status code
4. Verify database connection

### Issue: TypeScript errors
**Solution**:
1. Run `npx tsc --noEmit` to see all errors
2. Check file at error location
3. Review type definitions
4. Rebuild: `pnpm build`

---

## Status

**Date**: June 22, 2026
**Status**: Ready for testing
**Build**: ✅ Successful (9.6s, 39 pages, 0 TypeScript errors)
**Test Coverage**: 15 comprehensive test sections
