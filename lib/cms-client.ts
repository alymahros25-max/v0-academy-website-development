/**
 * CMS Client Utilities
 * Helper functions for interacting with the CMS APIs
 */

export interface ContentItem {
  id: number
  key: string
  content_ar: string | null
  content_en: string | null
  content_fr: string | null
  section: string | null
  type: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SettingItem {
  id: number
  setting_key: string
  setting_value: string
  value_type: string | null
  label: string | null
  description: string | null
  category: string | null
  created_at: string
  updated_at: string
}

export interface TranslationResult {
  ar: string
  en: string
  fr: string
}

/**
 * Fetch content from the CMS
 * @param key - Optional specific content key
 * @param section - Optional section filter
 * @param locale - Optional locale (ar, en, fr, or all)
 */
export async function fetchContent(
  key?: string,
  section?: string,
  locale?: string
): Promise<ContentItem[]> {
  const params = new URLSearchParams()
  if (key) params.append('key', key)
  if (section) params.append('section', section)
  if (locale) params.append('locale', locale)

  const response = await fetch(`/api/cms/content?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.statusText}`)
  }

  const result = (await response.json()) as { data: ContentItem[] }
  return result.data
}

/**
 * Save or update content
 */
export async function saveContent(data: {
  key: string
  content_ar?: string
  content_en?: string
  content_fr?: string
  section?: string
  type?: string
  is_active?: boolean
}): Promise<ContentItem> {
  const response = await fetch('/api/cms/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = (await response.json()) as { error: string }
    throw new Error(error.error || 'Failed to save content')
  }

  const result = (await response.json()) as { data: ContentItem }
  return result.data
}

/**
 * Delete content
 */
export async function deleteContent(key: string): Promise<void> {
  const response = await fetch(`/api/cms/content?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = (await response.json()) as { error: string }
    throw new Error(error.error || 'Failed to delete content')
  }
}

/**
 * Fetch settings
 */
export async function fetchSettings(
  key?: string,
  category?: string
): Promise<Record<string, string> | SettingItem[]> {
  const params = new URLSearchParams()
  if (key) params.append('key', key)
  if (category) params.append('category', category)

  const response = await fetch(`/api/cms/settings?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch settings: ${response.statusText}`)
  }

  const result = (await response.json()) as { data: Record<string, string> | SettingItem[] }
  return result.data
}

/**
 * Save or update a setting
 */
export async function saveSetting(data: {
  setting_key: string
  setting_value: string
  value_type?: string
  label?: string
  description?: string
  category?: string
}): Promise<SettingItem> {
  const response = await fetch('/api/cms/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = (await response.json()) as { error: string }
    throw new Error(error.error || 'Failed to save setting')
  }

  const result = (await response.json()) as { data: SettingItem }
  return result.data
}

/**
 * Batch update multiple settings
 */
export async function updateSettingsBatch(
  updates: Array<{ setting_key: string; setting_value: string }>
): Promise<SettingItem[]> {
  const response = await fetch('/api/cms/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = (await response.json()) as { error: string }
    throw new Error(error.error || 'Failed to update settings')
  }

  const result = (await response.json()) as { data: SettingItem[] }
  return result.data
}

/**
 * Delete a setting
 */
export async function deleteSetting(key: string): Promise<void> {
  const response = await fetch(`/api/cms/settings?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = (await response.json()) as { error: string }
    throw new Error(error.error || 'Failed to delete setting')
  }
}

/**
 * Translate Arabic text to English and French
 */
export async function translateText(text: string): Promise<TranslationResult> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      sourceLang: 'ar',
    }),
  })

  if (!response.ok) {
    const error = (await response.json()) as { error: string }
    throw new Error(error.error || 'Translation failed')
  }

  const result = (await response.json()) as { data: TranslationResult }
  return result.data
}

/**
 * Get a single setting by key
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const result = await fetchSettings(key)
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0].setting_value
    }
    
    return null
  } catch (error) {
    console.error('[v0] Error fetching setting:', error)
    return null
  }
}

/**
 * Get a single content item by key
 */
export async function getContent(
  key: string,
  locale: string = 'all'
): Promise<ContentItem | null> {
  try {
    const result = await fetchContent(key, undefined, locale)
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('[v0] Error fetching content:', error)
    return null
  }
}

/**
 * Get all settings as a key-value object
 */
export async function getAllSettingsMap(): Promise<Record<string, string>> {
  try {
    const result = await fetchSettings()
    
    if (!Array.isArray(result)) {
      return result
    }
    
    const map: Record<string, string> = {}
    result.forEach((item) => {
      map[item.setting_key] = item.setting_value
    })
    
    return map
  } catch (error) {
    console.error('[v0] Error fetching all settings:', error)
    return {}
  }
}
