# Google Drive Integration - Testing & Validation Guide

This guide helps you test and validate the Google Drive book viewer implementation.

## Pre-Testing Checklist

- [ ] Build successful with no TypeScript errors
- [ ] PDFViewer component updated
- [ ] Utility functions in place
- [ ] Database has at least one Google Drive URL
- [ ] Dev server running (`npm run dev`)

## Automated Tests

### 1. Utility Function Tests

Create a test file to verify utility functions:

```typescript
// lib/google-drive-utils.test.ts
import {
  extractGoogleDriveFileId,
  getGoogleDriveEmbedUrl,
  isGoogleDriveUrl,
  getViewerUrl,
} from './google-drive-utils'

describe('Google Drive Utilities', () => {
  describe('extractGoogleDriveFileId', () => {
    it('extracts File ID from standard share link', () => {
      const url = 'https://drive.google.com/file/d/ABC123DEF456/view?usp=sharing'
      expect(extractGoogleDriveFileId(url)).toBe('ABC123DEF456')
    })

    it('extracts File ID from open link format', () => {
      const url = 'https://drive.google.com/open?id=XYZ789'
      expect(extractGoogleDriveFileId(url)).toBe('XYZ789')
    })

    it('returns null for invalid URLs', () => {
      expect(extractGoogleDriveFileId('https://example.com/pdf')).toBeNull()
      expect(extractGoogleDriveFileId('')).toBeNull()
    })
  })

  describe('getGoogleDriveEmbedUrl', () => {
    it('converts to preview format', () => {
      const url = 'https://drive.google.com/file/d/ABC123/view?usp=sharing'
      const result = getGoogleDriveEmbedUrl(url)
      expect(result).toBe('https://drive.google.com/file/d/ABC123/preview')
    })

    it('returns original URL for non-Google Drive links', () => {
      const url = 'https://example.com/pdf.pdf'
      expect(getGoogleDriveEmbedUrl(url)).toBe(url)
    })
  })

  describe('isGoogleDriveUrl', () => {
    it('identifies Google Drive URLs', () => {
      expect(isGoogleDriveUrl('https://drive.google.com/file/d/ABC/view')).toBe(true)
      expect(isGoogleDriveUrl('https://drive.google.com/open?id=ABC')).toBe(true)
      expect(isGoogleDriveUrl('https://example.com/pdf')).toBe(false)
    })
  })

  describe('getViewerUrl', () => {
    it('returns google-drive type for Drive URLs', () => {
      const url = 'https://drive.google.com/file/d/ABC123/view?usp=sharing'
      const result = getViewerUrl(url)
      expect(result.type).toBe('google-drive')
      expect(result.url).toContain('preview')
    })

    it('returns google-docs type for other URLs', () => {
      const url = 'https://example.com/pdf.pdf'
      const result = getViewerUrl(url)
      expect(result.type).toBe('google-docs')
      expect(result.url).toContain('docs.google.com/viewer')
    })
  })
})
```

### 2. Manual Browser Tests

#### Test 1: Load Library Page
```
Steps:
1. Navigate to http://localhost:3000/library
2. Verify page loads without errors
3. See all book tabs (Books, Quran, Nasheeds, Tajweed)
4. Verify book cards display correctly

Expected: Page loads, books display in tabs
```

#### Test 2: Open Book with Google Drive URL
```
Setup:
- Ensure at least one book has a Google Drive PDF URL

Steps:
1. Click "قراءة" button on any book
2. Verify modal opens
3. Observe loading spinner
4. Wait for Google Drive preview to load
5. Verify document displays

Expected: Modal opens, spinner shows, PDF displays within ~3-5 seconds
```

#### Test 3: Open External PDF (Non-Google Drive)
```
Setup:
- Update a book URL to an external PDF: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf'

Steps:
1. Click "قراءة" on the book with external URL
2. Observe loading state
3. Wait for Google Docs viewer to load
4. Verify fallback viewer works

Expected: Google Docs viewer loads (may take 5-10 seconds)
```

#### Test 4: Test Buttons
```
Steps:
1. Open a book modal
2. Click "تحميل" (Download) button
3. Verify file opens or downloads
4. Go back to modal
5. Click "فتح في Google Drive" or "فتح خارجي"
6. Verify new tab opens

Expected: Links work and open in new tabs
```

#### Test 5: Close Modal
```
Steps:
1. Open book modal
2. Click X button
3. Verify modal closes
4. Verify page returns to normal

Expected: Modal closes smoothly
```

#### Test 6: Mobile Responsiveness
```
Steps:
1. Open library page on mobile device or emulate (DevTools)
2. Click book button
3. Verify modal is full-height
4. Check button layout is readable
5. Test horizontal scroll if needed
6. Click "Open in Google Drive" to test fallback

Expected: Mobile layout works, buttons responsive, fallback accessible
```

#### Test 7: Slow Connection Simulation
```
Steps (Chrome DevTools):
1. Open DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Click book button
5. Wait for loading
6. Click "Open in Google Drive" button

Expected: Loading spinner shows, fallback button helps with slow loads
```

#### Test 8: Error Handling
```
Steps:
1. Update a book URL to a dead/broken link
2. Click "قراءة"
3. Wait for load to fail
4. Verify error message displays
5. Try "Open in Google Drive" button

Expected: Graceful error handling, helpful message shown
```

#### Test 9: Multiple Books
```
Steps:
1. Open first book (Google Drive)
2. Close modal
3. Open second book (Google Drive)
4. Verify second book loads correctly
5. Close and open third book
6. Verify no memory leaks or state issues

Expected: Each book opens cleanly, no lingering state
```

#### Test 10: URL Format Variations
```
Setup:
- Create test books with different Google Drive URL formats:
  - Format 1: 'https://drive.google.com/file/d/ABC123/view?usp=sharing'
  - Format 2: 'https://drive.google.com/file/d/ABC123/preview'
  - Format 3: 'https://drive.google.com/open?id=ABC123'

Steps:
1. Open each book
2. Verify all display correctly
3. Confirm they all look identical

Expected: All formats work and display the same way
```

## Network Inspection

### Using Browser DevTools

```
To verify Google Drive is loading correctly:

1. Open book modal
2. Press F12 (DevTools)
3. Go to Network tab
4. Look for requests to 'drive.google.com'
5. Verify no CORS errors in Console
6. Check iframe is loading without issues

Expected Requests:
- GET https://drive.google.com/file/d/[FILE_ID]/preview
- Various Google Drive resources
- Status 200 for all
```

### Console Logging

The component logs state changes. To enable debugging:

```typescript
// In PDFViewer.tsx, add console logs:
useEffect(() => {
  console.log('[GoogleDrive] PDF URL:', pdfUrl)
  console.log('[GoogleDrive] Viewer Type:', viewerConfig.type)
  console.log('[GoogleDrive] Display URL:', displayUrl)
  setIsLoading(true)
}, [pdfUrl, viewerConfig.type, displayUrl])

const handleIframeLoad = () => {
  console.log('[GoogleDrive] iframe loaded successfully')
  setIsLoading(false)
}
```

## Accessibility Testing

### Keyboard Navigation
```
Steps:
1. Click modal to focus
2. Press Tab multiple times
3. Verify focus highlights buttons
4. Press Enter on buttons
5. Verify actions execute

Expected: Full keyboard navigation works
```

### Screen Reader Testing
```
Steps (NVDA or JAWS):
1. Enable screen reader
2. Navigate to book button
3. Verify label is read clearly
4. Open modal
5. Verify title is announced
6. Tab through buttons
7. Verify each button purpose is clear

Expected: Screen reader can describe all elements
```

## Performance Testing

### Lighthouse Audit

```bash
# Run Lighthouse on library page
npx lighthouse http://localhost:3000/library --view
```

Check metrics:
- ✅ Largest Contentful Paint (LCP): < 2.5s
- ✅ Cumulative Layout Shift (CLS): < 0.1
- ✅ First Input Delay (FID): < 100ms

### Bundle Size Impact

```bash
# Check if Google Drive utilities add significant size
npm run build

# Look for:
- google-drive-utils.ts size (should be ~3-5KB)
- Total bundle increase (should be minimal)
```

## Production Checklist

Before deploying:

- [ ] All utility functions tested
- [ ] Manual browser tests passed (Desktop)
- [ ] Mobile responsiveness verified
- [ ] Error handling works correctly
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Google Drive URLs work
- [ ] External PDF URLs still work
- [ ] Build succeeds without warnings
- [ ] No console errors in production
- [ ] Lighthouse scores acceptable
- [ ] Documentation complete and accurate

## Rollback Plan

If issues occur in production:

1. Revert PDFViewer.tsx to previous version
2. Keep google-drive-utils.ts for future use
3. Monitor error logs
4. Identify root cause
5. Fix and re-test before redeploying

## Test Scenarios by User Role

### Admin
```
✅ Can add Google Drive URLs to database
✅ Can update existing PDF URLs to Google Drive links
✅ Can verify books display correctly
```

### Student
```
✅ Can navigate to library
✅ Can open books for reading
✅ Can handle slow connections with fallback
✅ Can access on desktop and mobile
```

### Instructor
```
✅ Can share books with students
✅ Can manage file organization in Google Drive
✅ Can update content without code changes
```

## Integration Testing

### With Database

```sql
-- Test query to verify setup
SELECT 
  id,
  slug,
  title_ar,
  pdf_url,
  is_published,
  CASE WHEN pdf_url LIKE '%drive.google.com%' THEN 'Google Drive' ELSE 'Other' END as source
FROM public.digital_library
WHERE is_published = true
ORDER BY display_order;
```

### With API

```typescript
// Test the API endpoint
fetch('/api/cms/digital-library?published=true')
  .then(r => r.json())
  .then(books => {
    console.log('Books from API:', books)
    books.forEach(book => {
      console.log(`${book.title_ar}: ${book.pdf_url}`)
    })
  })
```

## Continuous Integration

### GitHub Actions (if applicable)

```yaml
name: Google Drive Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:google-drive
      - run: npm run build
      - run: npm run lint
```

## Success Criteria

All the following must be true:

✅ **Utility Functions**
- Extract File ID from all URL formats
- Convert to embed URL correctly
- Detect Google Drive URLs
- Return appropriate viewer config

✅ **Component Behavior**
- Loading spinner displays
- PDF/document displays within 5 seconds
- Buttons are clickable and functional
- Error messages are helpful
- Modal closes cleanly

✅ **Cross-Browser**
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

✅ **Responsive**
- Desktop (1920x1080) ✅
- Tablet (768x1024) ✅
- Mobile (375x667) ✅

✅ **Performance**
- Initial load: < 3 seconds
- PDF viewer: < 5 seconds
- No layout shifts
- Smooth animations

## Reporting Issues

If you find a bug:

1. **Describe** the issue clearly
2. **Reproduce** with exact steps
3. **Screenshot** if visual
4. **Check** console errors (F12)
5. **Test** on different browsers
6. **Document** device/OS/browser version
7. **Include** Google Drive URL format used (anonymized)

---

**Last Updated**: 3 August 2026  
**Status**: Complete & Ready for Testing ✅
