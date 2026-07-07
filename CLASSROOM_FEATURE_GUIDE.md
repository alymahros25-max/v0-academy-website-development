# Classroom Moments Feature - Complete Implementation Guide

## Overview
This document describes the complete implementation of the "Classroom Moments" (لقطات من الحصص) feature with Supabase integration, YouTube video management, and full i18n support.

## 1. Database Schema

### Table: `classroom_videos`
Created in Supabase with RLS policies for public read and admin full access.

**Columns:**
- `id` (UUID, Primary Key)
- `title_ar` (TEXT) - Arabic title
- `title_en` (TEXT) - English title  
- `title_fr` (TEXT) - French title
- `description_ar` (TEXT) - Arabic description
- `description_en` (TEXT) - English description
- `description_fr` (TEXT) - French description
- `youtube_url` (TEXT) - Full YouTube URL
- `youtube_embed_id` (TEXT) - 11-char YouTube video ID
- `thumbnail_url` (TEXT) - Video thumbnail URL
- `category` (TEXT) - Video category
- `is_published` (BOOLEAN) - Published status
- `is_featured` (BOOLEAN) - Featured status
- `display_order` (INTEGER) - Display order
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**RLS Policies:**
- SELECT: Allow public read for `is_published = true`
- ALL: Allow authenticated users full access

## 2. Internationalization (i18n) System

### Existing System
The project already has a robust i18n system with `I18nProvider` and `useI18n` hook.

### Classroom Translations Added
New translation keys added to `/lib/i18n.tsx`:

```
classroom.title = "لقطات من الحصص" | "Classroom Moments" | "Moments de classe"
classroom.youtubeUrl = "رابط الفيديو" | "YouTube URL" | "URL YouTube"
classroom.invalidYoutubeUrl = "رابط YouTube غير صحيح" | "Invalid YouTube URL" | ...
classroom.enterValidUrl = "يرجى إدخال رابط YouTube صحيح" | "Please enter a valid YouTube URL" | ...
```

### Usage
```tsx
import { useI18n } from '@/lib/i18n'

export function MyComponent() {
  const { t, locale, setLocale, dir } = useI18n()
  
  return (
    <div dir={dir}>
      <h1>{t('classroom.title')}</h1>
      <p>{t('classroom.youtubeUrl')}</p>
    </div>
  )
}
```

## 3. YouTube URL Utilities

### File: `/lib/youtube-utils.ts`

**Functions:**

#### `extractYouTubeId(urlOrId: string): string | null`
Extracts the 11-character video ID from various YouTube URL formats:
- `https://www.youtube.com/watch?v=xxxxx` → `xxxxx`
- `https://youtu.be/xxxxx` → `xxxxx`
- `https://www.youtube.com/embed/xxxxx` → `xxxxx`
- `xxxxx` (raw ID) → `xxxxx`

#### `getYouTubeEmbedUrl(videoId: string): string`
Returns: `https://www.youtube.com/embed/{videoId}?rel=0&modestbranding=1`

#### `getYouTubeThumbnail(videoId: string, quality?: string): string`
Returns thumbnail URL. Quality options: 'max' | 'high' | 'medium' | 'low'

#### `isValidYouTubeUrl(url: string): boolean`
Returns true if URL contains valid YouTube video ID.

**Example:**
```tsx
import { extractYouTubeId, getYouTubeEmbedUrl } from '@/lib/youtube-utils'

const videoId = extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
// → 'dQw4w9WgXcQ'

const embedUrl = getYouTubeEmbedUrl(videoId)
// → 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1'
```

## 4. API Routes

### File: `/app/api/classroom-videos/route.ts`

**Endpoints:**

#### GET `/api/classroom-videos`
Fetches published classroom videos ordered by display_order, then created_at descending.

**Query Parameters:** None required

**Response:**
```json
[
  {
    "id": "uuid",
    "title_ar": "...",
    "youtube_embed_id": "xxxxx",
    "is_published": true,
    ...
  }
]
```

#### POST `/api/classroom-videos`
Creates a new classroom video and automatically extracts YouTube ID.

**Request Body:**
```json
{
  "title_ar": "عنوان الفيديو",
  "title_en": "Video Title",
  "youtube_url": "https://www.youtube.com/watch?v=xxxxx",
  "description_ar": "...",
  "category": "تجويد"
}
```

**Response:** 
```json
{
  "id": "uuid",
  "title_ar": "...",
  "youtube_embed_id": "xxxxx",
  "is_published": true,
  ...
}
```

#### DELETE `/api/classroom-videos?id={id}`
Deletes a classroom video by ID (admin only).

## 5. Client Library

### File: `/lib/classroom-videos-client.ts`

**Functions:**

#### `fetchClassroomVideos(): Promise<ClassroomVideo[]>`
Fetches all published videos from Supabase with defensive null-checks.

#### `fetchClassroomVideoById(id: string): Promise<ClassroomVideo | null>`
Fetches a single video by ID with validation.

#### `fetchVideosByCategory(category: string): Promise<ClassroomVideo[]>`
Fetches videos filtered by category.

#### `fetchFeaturedClassroomVideos(limit = 6): Promise<ClassroomVideo[]>`
Fetches featured videos only.

**Features:**
- Automatic error handling with console logging
- Defensive null-checks on all data
- Type-safe returns
- Graceful fallback to empty arrays on errors

**Example:**
```tsx
import { fetchClassroomVideos } from '@/lib/classroom-videos-client'

async function MyComponent() {
  const videos = await fetchClassroomVideos()
  
  return (
    <div>
      {videos?.map(video => (
        <video key={video.id}>
          {video.title_ar}
        </video>
      ))}
    </div>
  )
}
```

## 6. Admin Form Component

### File: `/components/classroom-moments/VideoForm.tsx`

**Features:**
- YouTube URL validation with real-time error display
- Automatic YouTube ID extraction
- Defensive null-checks
- i18n translation support
- Error boundary compatible
- Loading states

**Key Methods:**
```tsx
export function VideoForm({ initialData, onSuccess, isEditing = false }) {
  // YouTube validation on input change
  const handleChange = (e) => {
    if (name === 'youtube_url' && value.trim()) {
      if (!isValidYouTubeUrl(value)) {
        setYoutubeIdError(t('classroom.invalidYoutubeUrl'))
      } else {
        setYoutubeIdError('')
      }
    }
  }

  // Extract and validate on submit
  const handleSubmit = async (e) => {
    const videoId = extractYouTubeId(formData.youtube_url)
    if (!videoId) {
      showToast(t('classroom.invalidYoutubeUrl'), 'error')
      return
    }
    // ... proceed with API call
  }
}
```

**Usage:**
```tsx
import { VideoForm } from '@/components/classroom-moments/VideoForm'

export function ClassroomVideosTab() {
  const handleSuccess = () => mutate() // Refresh data
  
  return <VideoForm onSuccess={handleSuccess} />
}
```

## 7. Client Gallery Component

### File: `/components/classroom-moments/VideoGrid.tsx`

**Features:**
- Responsive grid layout
- YouTube iframe embed
- Defensive programming (videos?.map())
- Loading and empty states
- Category filtering
- Mobile-optimized

**Props:**
```tsx
interface VideoGridProps {
  videos: VideoData[]
  language?: 'ar' | 'en' | 'fr'
  showCategories?: boolean
}
```

**Usage:**
```tsx
import { VideoGrid } from '@/components/classroom-moments/VideoGrid'

export default function ClassroomMomentsPage({ videos }) {
  return <VideoGrid videos={videos} language="ar" showCategories={true} />
}
```

## 8. Public Page

### File: `/app/classroom-moments/page.tsx`

**Features:**
- ISR (Incremental Static Regeneration) - revalidate every 5 minutes
- Hero section with stats
- Video grid with translations
- Empty state handling
- Call-to-action sections
- SEO metadata

**Data Fetching:**
```tsx
async function getClassroomVideos(): Promise<VideoData[]> {
  const response = await fetch(
    `${baseUrl}/api/cms/classroom-videos?published=true`,
    { next: { revalidate: 300 } } // ISR: 5 minutes
  )
  return response.ok ? response.json().data : []
}
```

## 9. Admin Tab Integration

### File: `/components/admin/ClassroomVideosTab.tsx`

The admin dashboard includes a dedicated tab for managing classroom videos:

**Features:**
- Add/Edit/Delete videos
- YouTube URL validation with error display
- Auto-extract YouTube ID on submit
- Real-time form validation
- Defensive null-checks
- Error boundary wrapped

**Location in Dashboard:**
- Menu item: "نقطات من الحصص"
- URL: `/admin` (tab toggles within page)

## 10. Complete Localization Setup

### How to Use Existing Translations

The project already has an i18n system. To use classroom translations:

```tsx
import { useI18n } from '@/lib/i18n'

export function MyComponent() {
  const { t, locale, setLocale, dir } = useI18n()
  
  // Use translations
  <h1>{t('classroom.title')}</h1>
  <h1>{t('classroom.youtubeUrl')}</h1>
  
  // Change locale (toggles RTL automatically)
  <button onClick={() => setLocale('en')}>English</button>
  
  // RTL/LTR aware layout
  <div dir={dir}>Content</div>
}
```

### Adding New Translations

1. Open `/lib/i18n.tsx`
2. Add to `translations` object:
```typescript
"classroom.myKey": { 
  ar: "النص بالعربية", 
  en: "English text", 
  fr: "Texte français" 
}
```
3. Use with `t('classroom.myKey')`

### Language Switcher

The header already includes language buttons that toggle the locale:
```tsx
// In Header component
<button onClick={() => setLocale('ar')}>العربية</button>
<button onClick={() => setLocale('en')}>English</button>
<button onClick={() => setLocale('fr')}>Français</button>
```

These buttons:
- Update `locale` state in the I18nProvider
- Automatically set `document.documentElement.dir` to 'rtl' or 'ltr'
- Automatically set `document.documentElement.lang`
- Persist locale to localStorage (if configured)
- Cause all components using `useI18n()` to re-render with new translations

## 11. Defensive Programming Patterns

### Pattern 1: Null-Safe Array Mapping
```tsx
// GOOD - Safe even if videos is undefined or null
{videos?.map((video) => (
  video?.id ? <VideoCard key={video.id} video={video} /> : null
))}

// AVOID - Will crash if videos is null
{videos.map((video) => <VideoCard key={video.id} video={video} />)}
```

### Pattern 2: Optional Chaining with Fallbacks
```tsx
// GOOD - Multiple fallback levels
<h2>{video?.title_ar || video?.title_en || "بدون عنوان"}</h2>

// AVOID - Will error if video is null
<h2>{video.title_ar}</h2>
```

### Pattern 3: Error Boundaries
```tsx
// GOOD - Each tab isolated
<AdminErrorBoundary>
  <ClassroomVideosTab />
</AdminErrorBoundary>

// AVOID - One error breaks entire dashboard
<ClassroomVideosTab />
```

### Pattern 4: Safe API Calls
```tsx
try {
  const data = await fetchClassroomVideos()
  // data is always an array, never null
  if (Array.isArray(data) && data.length > 0) {
    // Proceed safely
  }
} catch (err) {
  console.error('[v0] Error:', err)
  // Fail gracefully, return empty state
}
```

## 12. Testing the Feature

### Test Steps:

1. **View Public Page:**
   - Visit: `http://localhost:3000/classroom-moments`
   - Should show hero section and "No videos yet" message (no videos exist)

2. **Admin Form:**
   - Go to: `http://localhost:3000/admin`
   - Login with: `alymahros25@gmail.com` / `admin@hafiz2025`
   - Click: "نقطات من الحصص" tab
   - Click: "إضافة فيديو جديد"

3. **Test YouTube URL Extraction:**
   - Try these URLs - should all extract the same ID:
     - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
     - `https://youtu.be/dQw4w9WgXcQ`
     - `https://www.youtube.com/embed/dQw4w9WgXcQ`
     - `dQw4w9WgXcQ`
   - All should result in video ID: `dQw4w9WgXcQ`

4. **Test Invalid URLs:**
   - Try: `https://google.com`
   - Should show: "رابط YouTube غير صحيح"

5. **Test Translations:**
   - Change language in header
   - All form labels should update instantly
   - No page reload needed

6. **View Videos:**
   - After adding, go to: `http://localhost:3000/classroom-moments`
   - Should display video grid with YouTube embeds
   - Videos should be fully playable

## 13. Troubleshooting

### Issue: YouTube video not loading in iframe
**Solution:** Ensure the video URL is correctly parsed. Test with `/api/classroom-videos` endpoint to verify the extracted ID.

### Issue: Translations not updating
**Solution:** Ensure `useI18n()` hook is used within `I18nProvider`. Check that translation keys match exactly in `/lib/i18n.tsx`.

### Issue: Admin form showing validation error for valid URL
**Solution:** Check browser console for extraction errors. Verify URL format matches one of the supported patterns in `youtube-utils.ts`.

### Issue: Database not connecting
**Solution:** Verify Supabase environment variables are set in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 14. File Structure Summary

```
/lib
  ├── i18n.tsx (UPDATED - added classroom translations)
  ├── youtube-utils.ts (existing)
  └── classroom-videos-client.ts (NEW)

/app
  ├── api/
  │   └── classroom-videos/
  │       └── route.ts (NEW)
  └── classroom-moments/
      └── page.tsx (existing, compatible)

/components
  └── classroom-moments/
      ├── VideoForm.tsx (UPDATED - added YouTube validation)
      └── VideoGrid.tsx (existing, compatible)

/admin
  └── ClassroomVideosTab (uses VideoForm)

DOCUMENTATION:
  └── CLASSROOM_FEATURE_GUIDE.md (THIS FILE)
```

## 15. Future Enhancements

- [ ] Video upload progress tracking
- [ ] Bulk video import from playlist
- [ ] Video analytics/views tracking
- [ ] Video comments system
- [ ] Offline video caching
- [ ] Video quality presets
- [ ] Subtitle support
- [ ] Video transcription (AI-powered)
- [ ] Student progress tracking per video

---

**Last Updated:** 7 July 2026  
**Status:** ✅ Production Ready
