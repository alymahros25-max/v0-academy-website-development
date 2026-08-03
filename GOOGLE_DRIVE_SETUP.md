# Google Drive Book Integration Guide

This guide explains how to host course books and PDFs on Google Drive and integrate them seamlessly into the Digital Library.

## Overview

The Book Viewer component now supports **automatic Google Drive link conversion**. Simply share a Google Drive file and paste the shareable link into the database - the system will automatically:

1. Extract the File ID from any Google Drive link format
2. Convert it to the direct embed format
3. Display it in a responsive, full-height viewer
4. Provide fallback options if viewing issues occur

## Setup Instructions

### Step 1: Upload Your Books to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Create a folder for your course materials (e.g., "Academy Books")
3. Upload your PDF files to this folder
4. Organize by category (Quran, Tajweed, Arabic, etc.)

### Step 2: Share the Files

For each book you want to add:

1. Right-click the file → **Share**
2. Set permission to **"Anyone with the link"**
3. Choose **Viewer** access (read-only)
4. Copy the shareable link

**Example shareable link format:**
```
https://drive.google.com/file/d/FILE_ID_HERE/view?usp=sharing
```

### Step 3: Add to Database

The book viewer automatically converts Google Drive links. You can paste any of these formats directly into the `pdf_url` field:

- ✅ `https://drive.google.com/file/d/FILE_ID/view?usp=sharing` (standard)
- ✅ `https://drive.google.com/open?id=FILE_ID` (open format)
- ✅ `https://drive.google.com/file/d/FILE_ID/preview` (preview format)

**Example in database:**
```sql
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing'
WHERE slug = 'al-qaida-an-noraniyah';
```

## How It Works

### Automatic Link Conversion

The utility function `getGoogleDriveEmbedUrl()` automatically:

1. **Extracts the File ID** from any Google Drive URL
2. **Converts to embed format**: `https://drive.google.com/file/d/FILE_ID/preview`
3. **Returns original URL** if not a Google Drive link (backward compatible)

### Viewer Behavior

- **Google Drive files**: Display in native Google Drive embedded viewer (seamless, fast)
- **Other PDFs**: Fall back to Google Docs viewer for compatibility
- **Loading states**: Shows spinner while content loads
- **Error handling**: Displays helpful message with direct link fallback

### Responsive Design

- **Desktop**: Full-height modal with sidebar for navigation
- **Mobile**: Optimized layout with reduced headers and buttons
- **Slow connections**: "Open in Google Drive" button for direct access

## Utility Functions

Located in `lib/google-drive-utils.ts`:

### `extractGoogleDriveFileId(url: string): string | null`
Extracts File ID from any Google Drive URL format.

```typescript
const fileId = extractGoogleDriveFileId('https://drive.google.com/file/d/ABC123/view')
// Returns: 'ABC123'
```

### `getGoogleDriveEmbedUrl(url: string): string`
Converts any URL to the appropriate embed format.

```typescript
const embedUrl = getGoogleDriveEmbedUrl('https://drive.google.com/file/d/ABC123/view?usp=sharing')
// Returns: 'https://drive.google.com/file/d/ABC123/preview'
```

### `isGoogleDriveUrl(url: string): boolean`
Checks if a URL is a Google Drive link.

```typescript
isGoogleDriveUrl('https://drive.google.com/file/d/ABC123/view') // true
```

### `getViewerUrl(url: string): { type, url }`
Returns the appropriate viewer configuration.

```typescript
const config = getViewerUrl('https://drive.google.com/file/d/ABC123/view')
// Returns: { type: 'google-drive', url: 'https://drive.google.com/file/d/ABC123/preview' }
```

## Best Practices

### 1. File Organization
```
My Drive/
├── Academy Books/
│   ├── Quran Recitations/
│   │   ├── Surah Al-Fatiha.pdf
│   │   └── Surah Yaseen.pdf
│   ├── Tajweed Rules/
│   │   ├── Al-Qaida Al-Noraniyah.pdf
│   │   └── Tuhfat Al-Atfal.pdf
│   └── Arabic Basics/
│       └── Arabic Grammar.pdf
```

### 2. Permissions
- **Always use "Anyone with the link"** - this allows the embed to work
- **"Restricted" or "Specific people"** will block the embed viewer
- You can still control access at the application level

### 3. File Naming
- Use clear, descriptive names
- Use English for File IDs (Google Drive), Arabic for display
- Example: `Al-Qaida-Al-Noraniyah.pdf` (stored) → "القاعدة النورانية" (displayed)

### 4. Large Files
- Google Drive handles large PDFs well (up to 5GB per file)
- PDFs over 100MB may take longer to preview
- Consider splitting very large documents

### 5. Backup Strategy
- Keep local copies of important books
- Share folder with backup Google account
- Document all File IDs in case of link issues

## Troubleshooting

### Issue: "This preview is not currently available"

**Solution:**
1. Check that sharing permission is set to **"Anyone with the link"**
2. Wait 10-15 minutes for Google Drive to process the link
3. Try opening the file directly in Google Drive
4. Use the **"Open in Google Drive"** button in the viewer

### Issue: File won't load on mobile

**Solution:**
1. Ensure connection is stable
2. Try the **"Open in Google Drive"** button for direct access
3. Check if file is too large (may need to reduce resolution)

### Issue: Wrong file displays for a link

**Solution:**
1. Verify the File ID in the URL is correct
2. Check that you're not using an outdated link
3. Generate a new shareable link

## Performance Considerations

- Google Drive embed viewer is optimized for all devices
- First load may take 2-5 seconds depending on connection
- Subsequent loads are cached by Google
- Native Google Drive viewer is faster than Google Docs viewer

## Security Notes

- **"Anyone with the link"** means anyone with the URL can view
- Access is **not tied to user accounts** in your app
- To restrict access further, use application-level authentication
- Sensitive materials should be in shared folders with authentication

## Advanced: Bulk Update Example

Update all books to use Google Drive links:

```sql
-- Update multiple books
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID_1/view?usp=sharing'
WHERE slug = 'al-qaida-an-noraniyah';

UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID_2/view?usp=sharing'
WHERE slug = 'tuhfat-al-atfal';

-- Verify updates
SELECT slug, title_ar, pdf_url FROM public.digital_library 
WHERE is_published = true AND content_type IN ('book', 'tajweed');
```

## Supported Link Formats

The system accepts and converts these Google Drive URL formats:

| Format | Example | Status |
|--------|---------|--------|
| Standard Share | `https://drive.google.com/file/d/ABC123/view?usp=sharing` | ✅ Works |
| Preview Format | `https://drive.google.com/file/d/ABC123/preview` | ✅ Works |
| Open Format | `https://drive.google.com/open?id=ABC123` | ✅ Works |
| Download Format | `https://drive.google.com/uc?id=ABC123&export=download` | ⚠️ May work |

## Migration from Other Sources

If migrating from other PDF hosts (archive.org, PDFKutub, etc.):

1. Download the existing PDF
2. Upload to Google Drive
3. Generate shareable link
4. Update the database URL
5. Test in the viewer

```sql
-- Example migration
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/NEW_FILE_ID/view?usp=sharing'
WHERE pdf_url LIKE '%pdfkutub.com%';
```

## Support

For issues or questions:
1. Check this guide first
2. Test the link directly in Google Drive
3. Verify sharing permissions
4. Check browser console for error messages
5. Review the utility functions in `lib/google-drive-utils.ts`
