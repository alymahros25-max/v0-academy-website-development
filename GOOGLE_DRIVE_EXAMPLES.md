# Google Drive Integration - Practical Examples

This document provides step-by-step examples for common tasks.

## Example 1: Add a Single Book from Google Drive

### Step 1: Find the File ID from Google Drive URL

You have a shareable link:
```
https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing
```

The File ID is: `1a2b3c4d5e6f7g8h9i0j`

### Step 2: Add to Database

```sql
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing'
WHERE slug = 'al-qaida-an-noraniyah';
```

**Result:** The system automatically converts this to:
```
https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/preview
```

And displays it in the embedded viewer.

## Example 2: Bulk Update - Migrate All Books to Google Drive

### Scenario: You've uploaded all books to Google Drive and need to update the database

```sql
-- Step 1: Update Books Section
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID_QAIDA/view?usp=sharing'
WHERE slug = 'al-qaida-an-noraniyah';

UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID_TUHFAT/view?usp=sharing'
WHERE slug = 'tuhfat-al-atfal';

UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID_TAJWEED/view?usp=sharing'
WHERE slug = 'tajweed-al-quran';

UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID_JAZARIYYAH/view?usp=sharing'
WHERE slug = 'matn-al-jazariyyah';

-- Step 2: Verify all books have Google Drive URLs
SELECT slug, title_ar, pdf_url FROM public.digital_library 
WHERE is_published = true 
AND content_type IN ('book', 'tajweed')
ORDER BY display_order;
```

### What Happens After Update:

1. User navigates to `/library`
2. Clicks "قراءة" (Read) button on a book
3. PDFViewer component opens
4. System detects it's a Google Drive URL
5. Converts to embed format automatically
6. Displays in native Google Drive viewer
7. User can read, zoom, and print seamlessly

## Example 3: Mixed Content Sources

You can have Google Drive books AND other PDF sources simultaneously:

```sql
-- Google Drive book (will use native embed)
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/ABC123/view?usp=sharing'
WHERE slug = 'book-from-drive';

-- External PDF book (will use Google Docs viewer as fallback)
UPDATE public.digital_library SET
    pdf_url = 'https://example.com/my-book.pdf'
WHERE slug = 'book-from-web';

-- Another Google Drive book
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/DEF456/view?usp=sharing'
WHERE slug = 'another-drive-book';
```

The system automatically detects the source and uses the appropriate viewer.

## Example 4: Handle Different URL Formats

All these formats work automatically:

```sql
-- Format 1: Standard Share Link
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID/view?usp=sharing'
WHERE slug = 'book-standard';

-- Format 2: Preview Format
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID/preview'
WHERE slug = 'book-preview';

-- Format 3: Open Format
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/open?id=FILE_ID'
WHERE slug = 'book-open';

-- All will display identically - system converts them automatically
```

## Example 5: Add New Book with Complete Data

```sql
INSERT INTO public.digital_library (
    title_ar,
    title_en,
    slug,
    description_ar,
    author_ar,
    content_type,
    category,
    pdf_url,
    thumbnail_url,
    is_published,
    is_free,
    display_order
) VALUES (
    'الميسر في أحكام التجويد',
    'Simplified Tajweed Rules',
    'simplified-tajweed-rules',
    'شرح ميسر لأحكام التجويد الأساسية',
    'فريق الأكاديمية',
    'tajweed',
    'tajweed',
    'https://drive.google.com/file/d/NEW_FILE_ID/view?usp=sharing',
    'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600',
    true,
    true,
    99
) ON CONFLICT (slug) DO UPDATE SET
    pdf_url = EXCLUDED.pdf_url,
    is_published = EXCLUDED.is_published;
```

## Example 6: Troubleshooting - Link Isn't Working

### Debug Process:

```typescript
// In your admin panel or console, use the utility functions:
import { 
  extractGoogleDriveFileId, 
  isGoogleDriveUrl, 
  getGoogleDriveEmbedUrl 
} from '@/lib/google-drive-utils'

// Test a problematic URL
const testUrl = 'https://drive.google.com/file/d/ABC123/view?usp=sharing'

// Check if it's recognized as Google Drive
console.log(isGoogleDriveUrl(testUrl)) // true

// Extract the File ID
const fileId = extractGoogleDriveFileId(testUrl)
console.log(fileId) // 'ABC123'

// Get the embed URL
const embedUrl = getGoogleDriveEmbedUrl(testUrl)
console.log(embedUrl) // 'https://drive.google.com/file/d/ABC123/preview'
```

### Common Issues:

| Issue | Solution |
|-------|----------|
| "This preview is not available" | Check sharing permission is "Anyone with the link" |
| File shows different document | Verify File ID is correct in URL |
| Slow on mobile | Use "Open in Google Drive" button for direct access |
| URL not recognized | Verify format matches one of the supported patterns |

## Example 7: Creating a Folder Structure in Google Drive

Recommended organization:

```
Shared Drive or My Drive
├── 📁 أكاديمية الحافظ - المكتبة الرقمية
│   ├── 📁 القرآن والتجويد
│   │   ├── 📄 القاعدة النورانية.pdf (FILE_ID_1)
│   │   ├── 📄 تحفة الأطفال في التجويد.pdf (FILE_ID_2)
│   │   └── 📄 متن الجزرية.pdf (FILE_ID_3)
│   ├── 📁 العربية والنحو
│   │   ├── 📄 أساسيات اللغة العربية.pdf (FILE_ID_4)
│   │   └── 📄 قواعد الإملاء.pdf (FILE_ID_5)
│   ├── 📁 الإسلاميات
│   │   ├── 📄 العقيدة الإسلامية.pdf (FILE_ID_6)
│   │   └── 📄 فقه العبادات.pdf (FILE_ID_7)
│   └── 📁 Backup
│       └── (Local copies as backup)
```

Then update database:

```sql
INSERT INTO public.digital_library (title_ar, slug, content_type, pdf_url, is_published) VALUES
('القاعدة النورانية', 'al-qaida', 'book', 'https://drive.google.com/file/d/FILE_ID_1/view?usp=sharing', true),
('تحفة الأطفال', 'tuhfat-atfal', 'tajweed', 'https://drive.google.com/file/d/FILE_ID_2/view?usp=sharing', true),
('متن الجزرية', 'al-jazariyyah', 'tajweed', 'https://drive.google.com/file/d/FILE_ID_3/view?usp=sharing', true),
-- ... more books
;
```

## Example 8: Using the Utility Function Directly (Advanced)

If you need to process URLs in your code:

```typescript
// app/admin/library-manager/page.tsx
'use client'

import { getGoogleDriveEmbedUrl } from '@/lib/google-drive-utils'

export default function LibraryManager() {
  const handleUrlChange = (url: string) => {
    const embedUrl = getGoogleDriveEmbedUrl(url)
    console.log('Converted URL:', embedUrl)
    
    // You can use embedUrl directly or store it
    return embedUrl
  }

  return (
    <div>
      <input 
        type="text" 
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Paste Google Drive URL"
      />
    </div>
  )
}
```

## Example 9: Performance Optimization

For better performance with many books:

```sql
-- Add index on pdf_url if doing frequent lookups
CREATE INDEX idx_digital_library_pdf_url ON public.digital_library(pdf_url);

-- Batch update with verification
BEGIN;
  -- Update multiple books in one transaction
  UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/NEW_ID_1/view?usp=sharing'
  WHERE id IN (1, 2, 3);
  
  -- Verify update succeeded
  SELECT COUNT(*) FROM public.digital_library 
  WHERE pdf_url LIKE 'https://drive.google.com%';
COMMIT;
```

## Example 10: Fallback to Other Sources (Migration Phase)

If you have mixed sources during migration:

```sql
-- Keep Google Drive books as-is
-- Keep external PDFs as-is
-- The system handles both automatically

-- Monitor what sources are in use
SELECT 
  content_type,
  CASE 
    WHEN pdf_url LIKE 'https://drive.google.com%' THEN 'Google Drive'
    WHEN pdf_url LIKE 'https://docs.google.com%' THEN 'Google Docs'
    ELSE 'Other'
  END as source,
  COUNT(*) as count
FROM public.digital_library
WHERE is_published = true
GROUP BY content_type, source;
```

## Next Steps

1. **Upload all books to Google Drive**
2. **Generate shareable links for each**
3. **Update database with new URLs**
4. **Test each book in the viewer**
5. **Verify mobile responsiveness**
6. **Keep backup copies locally**
7. **Monitor access and performance**

## Support Resources

- **Setup Guide**: See `GOOGLE_DRIVE_SETUP.md`
- **Utility Functions**: See `lib/google-drive-utils.ts`
- **Viewer Component**: See `components/digital-library/PDFViewer.tsx`
- **TypeScript Types**: See inline documentation in utility functions

---

**Last Updated**: 3 August 2026  
**Status**: Production Ready ✅
