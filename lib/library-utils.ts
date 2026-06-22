/**
 * Library Utilities
 * Helpers for PDF, Audio, and Digital Content Management
 */

export interface LibraryItem {
  id: number
  title_ar: string
  title_en?: string
  title_fr?: string
  description_ar?: string
  description_en?: string
  description_fr?: string
  author_ar?: string
  author_en?: string
  content_type: 'book' | 'quran_audio' | 'nasheed' | 'tajweed'
  pdf_url?: string
  audio_url?: string
  thumbnail_url?: string
  category?: string
  qari_name_ar?: string
  qari_name_en?: string
  nasheed_artist_ar?: string
  nasheed_artist_en?: string
  lyrics_ar?: string
  lyrics_en?: string
  tajweed_level?: string
  duration_seconds?: number
  page_count?: number
  is_published?: boolean
  is_featured?: boolean
  created_at?: string
}

// Get title in specified language
export function getTitle(item: LibraryItem, locale: string = 'ar'): string {
  if (locale === 'en') return item.title_en || item.title_ar
  if (locale === 'fr') return item.title_fr || item.title_ar
  return item.title_ar
}

// Get description in specified language
export function getDescription(item: LibraryItem, locale: string = 'ar'): string {
  if (locale === 'en') return item.description_en || item.description_ar || ''
  if (locale === 'fr') return item.description_fr || item.description_ar || ''
  return item.description_ar || ''
}

// Get author name in specified language
export function getAuthor(item: LibraryItem, locale: string = 'ar'): string {
  if (locale === 'en') return item.author_en || item.author_ar || ''
  return item.author_ar || ''
}

// Get content type label
export function getContentTypeLabel(type: string, locale: string = 'ar'): string {
  const labels = {
    ar: {
      book: 'كتاب إسلامي',
      quran_audio: 'تلاوة قرآنية',
      nasheed: 'أنشودة دينية',
      tajweed: 'متن تجويدي'
    },
    en: {
      book: 'Islamic Book',
      quran_audio: 'Quranic Recitation',
      nasheed: 'Islamic Nasheed',
      tajweed: 'Tajweed Text'
    },
    fr: {
      book: 'Livre Islamique',
      quran_audio: 'Récitation Coranique',
      nasheed: 'Chant Religieux',
      tajweed: 'Texte de Tajweed'
    }
  }
  
  return labels[locale as keyof typeof labels]?.[type as keyof typeof labels.ar] || type
}

// Format duration (seconds to MM:SS)
export function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Get Qari name
export function getQariName(item: LibraryItem, locale: string = 'ar'): string {
  if (locale === 'en') return item.qari_name_en || item.qari_name_ar || ''
  return item.qari_name_ar || ''
}

// Get Nasheed artist
export function getNasheedArtist(item: LibraryItem, locale: string = 'ar'): string {
  if (locale === 'en') return item.nasheed_artist_en || item.nasheed_artist_ar || ''
  return item.nasheed_artist_ar || ''
}

// Get lyrics
export function getLyrics(item: LibraryItem, locale: string = 'ar'): string {
  if (locale === 'en') return item.lyrics_en || item.lyrics_ar || ''
  return item.lyrics_ar || ''
}

// Get Tajweed level label
export function getTajweedLevelLabel(level: string | undefined, locale: string = 'ar'): string {
  const labels = {
    ar: { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' },
    en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
  }
  
  return labels[locale as keyof typeof labels]?.[level as keyof typeof labels.ar] || level || ''
}

// Validate PDF URL
export function isValidPdfUrl(url: string | undefined): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.toLowerCase().endsWith('.pdf') || 
           url.includes('pdf') || 
           url.includes('drive.google.com') ||
           url.includes('archive.org')
  } catch {
    return false
  }
}

// Validate audio URL
export function isValidAudioUrl(url: string | undefined): boolean {
  if (!url) return false
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac']
  const path = url.toLowerCase()
  return audioExts.some(ext => path.includes(ext))
}

// Get color for content type
export function getContentTypeColor(type: string): { bg: string; text: string; border: string } {
  const colors = {
    book: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    quran_audio: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    nasheed: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    tajweed: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
  }
  
  return colors[type as keyof typeof colors] || colors.book
}

// Filter and organize content by sections
export function organizeBySection(items: LibraryItem[]): Record<string, LibraryItem[]> {
  return items.reduce((acc, item) => {
    const type = item.content_type
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {} as Record<string, LibraryItem[]>)
}
