# CMS Implementation Guide
## Dynamic Content Management System for أكاديمية الحافظ المتميز

---

## Phase 1: Database Schema & API Routes ✅ COMPLETED

### Database Tables Created

#### 1. `site_content` - Multilingual Content Storage
Stores all localized content (strings, sections, articles, pages).

```sql
key: TEXT (UNIQUE) -- Unique identifier (e.g., "hero_title")
content_ar: TEXT    -- Arabic content
content_en: TEXT    -- English content
content_fr: TEXT    -- French content
section: VARCHAR    -- Content section (homepage, about, courses, blog)
type: VARCHAR       -- Content type (heading, paragraph, card, article)
is_active: BOOLEAN  -- Publishing status
created_at: TIMESTAMP
updated_at: TIMESTAMP
updated_by: UUID    -- Reference to admin user
```

#### 2. `site_settings` - Theme & Global Configuration
Stores theme colors, fonts, and global settings.

```sql
setting_key: VARCHAR -- Unique setting identifier (e.g., "primary_color")
setting_value: TEXT  -- Setting value (hex color, URL, JSON, etc.)
value_type: VARCHAR  -- Data type (color, text, url, json, number)
label: TEXT          -- Display label for admin UI
description: TEXT    -- Help text for admin UI
category: VARCHAR    -- Grouping (colors, typography, layout, branding)
created_at: TIMESTAMP
updated_at: TIMESTAMP
updated_by: UUID
```

#### 3. `translation_history` - Translation Audit Log
Tracks all automatic translation requests for auditing.

### API Routes Created

#### POST `/api/translate`
**Auto-Translation Service** - Translates Arabic text to English and French.

**Request:**
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا بك في الأكاديمية",
    "sourceLang": "ar"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ar": "مرحبا بك في الأكاديمية",
    "en": "Welcome to the academy",
    "fr": "Bienvenue à l'académie"
  },
  "timestamp": "2026-06-18T10:30:00.000Z"
}
```

---

#### GET/POST/DELETE `/api/cms/content`
**Content Management** - CRUD operations for site content.

**GET Examples:**
```bash
# Get all active content
GET /api/cms/content

# Get specific content by key
GET /api/cms/content?key=hero_title

# Get content by section
GET /api/cms/content?section=homepage

# Get content in specific language
GET /api/cms/content?locale=en

# Combine filters
GET /api/cms/content?section=homepage&locale=ar
```

**POST - Create/Update Content:**
```bash
curl -X POST http://localhost:3000/api/cms/content \
  -H "Content-Type: application/json" \
  -d '{
    "key": "hero_title",
    "content_ar": "أكاديمية الحافظ المتميز",
    "content_en": "Al-Hafiz Academy",
    "content_fr": "Académie Al-Hafiz",
    "section": "homepage",
    "type": "heading"
  }'
```

**DELETE Content:**
```bash
DELETE /api/cms/content?key=hero_title
```

---

#### GET/POST/PATCH/DELETE `/api/cms/settings`
**Settings Management** - CRUD operations for site settings.

**GET Examples:**
```bash
# Get all settings as key-value map
GET /api/cms/settings

# Get specific setting
GET /api/cms/settings?key=primary_color

# Get settings by category
GET /api/cms/settings?category=colors
```

**POST - Create/Update Setting:**
```bash
curl -X POST http://localhost:3000/api/cms/settings \
  -H "Content-Type: application/json" \
  -d '{
    "setting_key": "primary_color",
    "setting_value": "#1a4d2e",
    "value_type": "color",
    "label": "Primary Color",
    "category": "colors"
  }'
```

**PATCH - Batch Update:**
```bash
curl -X PATCH http://localhost:3000/api/cms/settings \
  -H "Content-Type: application/json" \
  -d '[
    {
      "setting_key": "primary_color",
      "setting_value": "#2d5f3f"
    },
    {
      "setting_key": "secondary_color",
      "setting_value": "#e6c547"
    }
  ]'
```

---

## Client Utilities

### Import CMS Utilities

```typescript
import {
  fetchContent,
  saveContent,
  deleteContent,
  fetchSettings,
  saveSetting,
  updateSettingsBatch,
  deleteSetting,
  translateText,
  getSetting,
  getContent,
  getAllSettingsMap,
} from '@/lib/cms-client'
```

### Usage Examples

#### Fetch Content
```typescript
// Get all active content
const allContent = await fetchContent()

// Get specific content
const heroTitle = await getContent('hero_title', 'en')

// Get content by section
const homepageContent = await fetchContent(undefined, 'homepage', 'ar')
```

#### Save Content
```typescript
const newContent = await saveContent({
  key: 'about_title',
  content_ar: 'عن الأكاديمية',
  content_en: 'About Us',
  content_fr: 'À Propos',
  section: 'about',
  type: 'heading',
})
```

#### Fetch Settings
```typescript
// Get all settings as map
const settings = await fetchSettings()

// Get specific setting
const primaryColor = await getSetting('primary_color')

// Get settings by category
const colorSettings = await fetchSettings(undefined, 'colors')
```

#### Save Settings
```typescript
await saveSetting({
  setting_key: 'primary_color',
  setting_value: '#ff0000',
  value_type: 'color',
  category: 'colors',
})
```

#### Translate Text
```typescript
const translations = await translateText('مرحبا بك في الأكاديمية')
console.log(translations.en) // "Welcome to the academy"
console.log(translations.fr) // "Bienvenue à l'académie"
```

---

## React Hooks

### Import Hooks

```typescript
import {
  useCMSContent,
  useCMSSettings,
  useTranslate,
  useSingleContent,
  useSingleSetting,
} from '@/hooks/use-cms'
```

### Hook Examples

#### useCMSContent
```typescript
'use client'

export function MyContentComponent() {
  const { data, loading, error, refetch, save } = useCMSContent({
    section: 'homepage',
    locale: 'ar',
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map((item) => (
        <div key={item.key}>{item.content_ar}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

#### useCMSSettings
```typescript
'use client'

export function ThemeSettings() {
  const { data: settings, loading, save } = useCMSSettings({
    category: 'colors',
  })

  if (loading) return <div>Loading...</div>

  const handleColorChange = async (key: string, color: string) => {
    await save(key, color)
  }

  return (
    <div>
      <label>
        Primary Color
        <input
          type="color"
          value={settings?.primary_color || '#1a4d2e'}
          onChange={(e) =>
            handleColorChange('primary_color', e.target.value)
          }
        />
      </label>
    </div>
  )
}
```

#### useTranslate
```typescript
'use client'
import { useState } from 'react'

export function TranslationForm() {
  const { translate, loading, error } = useTranslate()
  const [arabicText, setArabicText] = useState('')
  const [translations, setTranslations] = useState(null)

  const handleTranslate = async () => {
    try {
      const result = await translate(arabicText)
      setTranslations(result)
    } catch (err) {
      console.error('Translation failed:', err)
    }
  }

  return (
    <div>
      <textarea
        value={arabicText}
        onChange={(e) => setArabicText(e.target.value)}
        placeholder="Enter Arabic text..."
      />
      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {translations && (
        <div>
          <p>English: {translations.en}</p>
          <p>French: {translations.fr}</p>
        </div>
      )}
    </div>
  )
}
```

#### useSingleContent
```typescript
'use client'

export function HeroTitle() {
  const { data, loading } = useSingleContent('hero_title', 'en')

  return (
    <h1>
      {loading ? 'Loading...' : data?.content_en}
    </h1>
  )
}
```

---

## Next Steps (Phase 2-4)

### Phase 2: Dynamic Content Form with Auto-Translation
- Build admin form UI
- Integrate "Translate" button
- Auto-fill English/French fields
- Save to database

### Phase 3: Theme Customizer
- Create color picker component
- Map Tailwind colors to CSS variables
- Add typography controls
- Layout customization

### Phase 4: Frontend Refactoring
- Update page components to use `useCMSContent`
- Replace hardcoded text with dynamic content
- Apply dynamic theme/settings
- Support language switching

---

## Database Setup Instructions

1. **Create Supabase Project** (if not already done)
2. **Run Migration:**
   ```bash
   # Copy the SQL migration file
   supabase migration up
   ```
   Or manually run `supabase/migrations/001_create_cms_tables.sql` in Supabase SQL Editor

3. **Verify Tables Created:**
   ```bash
   # In Supabase Dashboard, you should see:
   - site_content
   - site_settings
   - translation_history
   ```

4. **Test API Routes:**
   ```bash
   # Start development server
   pnpm dev

   # Test content endpoint
   curl http://localhost:3000/api/cms/content

   # Test settings endpoint
   curl http://localhost:3000/api/cms/settings

   # Test translation endpoint
   curl -X POST http://localhost:3000/api/translate \
     -H "Content-Type: application/json" \
     -d '{"text":"مرحبا"}'
   ```

---

## Architecture Overview

```
Frontend Components
        ↓
React Hooks (use-cms.ts)
        ↓
CMS Client Utilities (cms-client.ts)
        ↓
API Routes (/api/cms/*, /api/translate)
        ↓
Supabase Database
```

---

## Error Handling

All functions throw descriptive errors:

```typescript
try {
  const content = await saveContent(...)
} catch (error) {
  console.error(error.message) // "Failed to save content"
  // Display error to user
}
```

---

## Performance Considerations

- **Caching:** Consider adding React Query or SWR for client-side caching
- **Batch Operations:** Use PATCH for multiple settings updates
- **Lazy Loading:** Load content sections only when needed
- **Pagination:** Implement pagination for large content lists
- **Search:** Use full-text search (TSVECTOR) for content search

---

## Security

- **Row Level Security (RLS):** Enabled on all tables
- **Auth Check:** All write operations require authentication
- **Input Validation:** All API routes validate input
- **SQL Injection:** Protected via parameterized queries (Supabase)

---

## Support & Documentation

For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- React Hooks: https://react.dev/reference/react
