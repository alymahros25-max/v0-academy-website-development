# Google Drive Integration - Quick Start (5 Minutes)

## TL;DR - The Simplest Way

### 1. Upload Book to Google Drive
- Go to [Google Drive](https://drive.google.com)
- Upload your PDF file

### 2. Share the File
- Right-click file → **Share**
- Set to **"Anyone with the link"**
- Click **Copy link**
- You get something like: `https://drive.google.com/file/d/ABC123/view?usp=sharing`

### 3. Add to Database
```sql
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/ABC123/view?usp=sharing'
WHERE slug = 'your-book-slug';
```

**Done!** The book now displays in the Digital Library with Google Drive embed viewer.

## What Happens When User Clicks "قراءة" (Read)?

```
User clicks → PDFViewer opens → System detects Google Drive URL 
→ Extracts File ID → Converts to embed format 
→ Displays in full-height iframe → User reads seamlessly
```

## Supported URL Formats (Any of These Work)

✅ `https://drive.google.com/file/d/ABC123/view?usp=sharing`  
✅ `https://drive.google.com/file/d/ABC123/preview`  
✅ `https://drive.google.com/open?id=ABC123`  

All automatically converted to: `https://drive.google.com/file/d/ABC123/preview`

## Key Features

| Feature | Benefit |
|---------|---------|
| **Automatic Detection** | System recognizes Google Drive URLs instantly |
| **No Manual Conversion** | Just copy-paste the shareable link |
| **Responsive** | Works on desktop, tablet, and mobile |
| **Fast Loading** | Native Google Drive embed (no 3rd party conversion) |
| **Fallback Support** | "Open in Google Drive" button if preview fails |
| **Mobile Friendly** | Loading spinner, optimized buttons for touch |

## Common Tasks

### Add One Book
```sql
UPDATE public.digital_library SET
    pdf_url = 'https://drive.google.com/file/d/FILE_ID/view?usp=sharing'
WHERE slug = 'book-slug';
```

### Add Multiple Books (Copy-Paste Template)
```sql
UPDATE public.digital_library SET pdf_url = 'https://drive.google.com/file/d/ID1/view?usp=sharing' WHERE slug = 'book1';
UPDATE public.digital_library SET pdf_url = 'https://drive.google.com/file/d/ID2/view?usp=sharing' WHERE slug = 'book2';
UPDATE public.digital_library SET pdf_url = 'https://drive.google.com/file/d/ID3/view?usp=sharing' WHERE slug = 'book3';
```

### Check All Books Status
```sql
SELECT 
  slug, 
  title_ar, 
  CASE WHEN pdf_url LIKE '%drive.google.com%' THEN '✅ Google Drive' ELSE '⚠️ Other Source' END as status
FROM public.digital_library 
WHERE is_published = true AND content_type IN ('book', 'tajweed');
```

## Troubleshooting (3 Common Issues)

### Issue: File won't display
```
❌ Solution: Check that sharing permission is "Anyone with the link"
- Google Drive file → Right-click → Share
- Confirm "Anyone with the link" is selected
- Wait 10-15 seconds for Google to update
```

### Issue: Different file displays
```
❌ Solution: Verify File ID in the URL is correct
- Your URL: https://drive.google.com/file/d/ABC123/view?usp=sharing
- File ID: ABC123 (this must match your file)
- Generate new shareable link if uncertain
```

### Issue: Loads slowly on mobile
```
❌ Solution: Use "Open in Google Drive" button
- Provides direct access without embed overhead
- Better for weak connections
```

## File Organization (Recommended)

```
Google Drive
└── My Academy Books
    ├── Quran & Tajweed
    │   ├── Al-Qaida.pdf
    │   ├── Tuhfat.pdf
    │   └── Al-Jazariyyah.pdf
    └── Arabic & Grammar
        ├── Arabic Basics.pdf
        └── Grammar Rules.pdf
```

## Utility Functions Available (Advanced)

Located in `lib/google-drive-utils.ts`:

```typescript
// Extract File ID from any Google Drive URL
extractGoogleDriveFileId('https://drive.google.com/file/d/ABC123/view')
// Returns: 'ABC123'

// Convert to embed URL
getGoogleDriveEmbedUrl('https://drive.google.com/file/d/ABC123/view?usp=sharing')
// Returns: 'https://drive.google.com/file/d/ABC123/preview'

// Check if URL is Google Drive
isGoogleDriveUrl('https://drive.google.com/file/d/ABC123/view')
// Returns: true

// Get appropriate viewer for any URL
getViewerUrl('https://drive.google.com/file/d/ABC123/view')
// Returns: { type: 'google-drive', url: '...' }
```

## File Permissions - Critical!

| Permission | Works? | Notes |
|----------|--------|-------|
| **Anyone with the link** | ✅ Yes | Viewer can't download, but can preview |
| **Restricted** | ❌ No | Only shared users can access |
| **Specific people** | ❌ No | Only invited users can access |

**Always use "Anyone with the link"** for the embed to work.

## Pro Tips

💡 **Tip 1**: Test the shareable link in a private browser window before adding to database  
💡 **Tip 2**: Keep local backups of important books  
💡 **Tip 3**: Organize books in folders for easier management  
💡 **Tip 4**: Use descriptive file names (helps with organization)  
💡 **Tip 5**: Check the viewer's loading spinner indicates proper connection  

## Complete Flow (3 Steps Total)

### Step 1️⃣: Prepare (2 min)
- Upload PDF to Google Drive
- Set sharing to "Anyone with the link"
- Copy the shareable link

### Step 2️⃣: Update (1 min)
- Open database admin
- Paste URL in `pdf_url` field
- Save changes

### Step 3️⃣: Verify (1 min)
- Go to `/library`
- Click "قراءة" on the book
- Confirm it displays correctly
- Test "Open in Google Drive" button

## FAQ

**Q: Can I use my own Google Drive?**  
✅ Yes - any Google Drive account works

**Q: Do I need to convert the URL?**  
❌ No - system converts automatically

**Q: Can I mix Google Drive with other sources?**  
✅ Yes - system detects and handles both

**Q: Will it work offline?**  
❌ No - requires internet connection (Google Drive requirement)

**Q: Can students download the books?**  
✅ Yes - they can via the "Open in Google Drive" button

**Q: Is this secure?**  
✅ Yes - "Anyone with the link" means only people who know the exact URL can access

## Next Steps

1. Open the detailed guide: `GOOGLE_DRIVE_SETUP.md`
2. See practical examples: `GOOGLE_DRIVE_EXAMPLES.md`
3. Check utility functions: `lib/google-drive-utils.ts`
4. Start adding books today!

---

**Setup Time**: ~5 minutes per book  
**Complexity**: Easy (just copy-paste links)  
**Production Ready**: ✅ Yes
