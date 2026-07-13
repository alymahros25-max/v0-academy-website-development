import { createClient } from '@supabase/supabase-js'

// Defensive Supabase client with proper error handling
const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('[v0] Missing Supabase credentials')
    return null
  }

  return createClient(url, key)
}

export interface ClassroomVideo {
  id: string
  title_ar?: string
  title_en?: string
  title_fr?: string
  description_ar?: string
  description_en?: string
  description_fr?: string
  youtube_url: string
  youtube_embed_id: string
  thumbnail_url?: string
  category?: string
  is_published?: boolean
  is_featured?: boolean
  display_order?: number
  created_at?: string
  updated_at?: string
}

/**
 * Fetch published classroom videos from Supabase
 * Implements defensive programming with proper error handling and null checks
 */
export async function fetchClassroomVideos(): Promise<ClassroomVideo[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error('[v0] Supabase client unavailable')
      return []
    }

    const { data, error } = await supabase
      .from('classroom_videos')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Fetch videos error:', error)
      return []
    }

    // Defensive null checks
    if (!Array.isArray(data)) {
      console.warn('[v0] Invalid data format from Supabase')
      return []
    }

    return data?.filter((video): video is ClassroomVideo => {
      // Ensure video has required fields
      return !!(video?.id && video?.youtube_embed_id)
    }) || []
  } catch (err) {
    console.error('[v0] Classroom videos fetch exception:', err)
    return []
  }
}

/**
 * Fetch a single video by ID
 */
export async function fetchClassroomVideoById(id: string): Promise<ClassroomVideo | null> {
  try {
    if (!id?.trim()) return null

    const supabase = getSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('classroom_videos')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('[v0] Fetch video by ID error:', error)
      return null
    }

    if (!data?.id || !data?.youtube_embed_id) {
      console.warn('[v0] Invalid video data')
      return null
    }

    return data as ClassroomVideo
  } catch (err) {
    console.error('[v0] Fetch video by ID exception:', err)
    return null
  }
}

/**
 * Get videos by category
 */
export async function fetchVideosByCategory(category: string): Promise<ClassroomVideo[]> {
  try {
    if (!category?.trim()) return []

    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('classroom_videos')
      .select('*')
      .eq('is_published', true)
      .eq('category', category?.trim())
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Fetch by category error:', error)
      return []
    }

    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('[v0] Fetch by category exception:', err)
    return []
  }
}

/**
 * Get featured videos only
 */
export async function fetchFeaturedClassroomVideos(limit = 6): Promise<ClassroomVideo[]> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('classroom_videos')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .limit(limit)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[v0] Fetch featured error:', error)
      return []
    }

    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('[v0] Fetch featured exception:', err)
    return []
  }
}
