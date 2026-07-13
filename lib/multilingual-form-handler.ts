import { extractYouTubeId } from './youtube-utils'
import { supabase } from './supabaseClient'

export interface MultilingualFormData {
  title_ar: string
  title_en: string
  title_fr: string
  description_ar?: string
  description_en?: string
  description_fr?: string
  [key: string]: any
}

export interface FormValidationError {
  field: string
  message: string
}

/**
 * Validates multilingual form data
 * Checks that all language fields are filled
 */
export function validateMultilingualForm(
  data: Partial<MultilingualFormData>,
  requiredFields: string[] = ['title_ar', 'title_en', 'title_fr']
): FormValidationError[] {
  const errors: FormValidationError[] = []

  requiredFields.forEach(field => {
    if (!data[field] || String(data[field]).trim() === '') {
      errors.push({
        field,
        message: `${field} is required and cannot be empty`
      })
    }
  })

  return errors
}

/**
 * Sanitizes form input to prevent XSS
 */
export function sanitizeFormInput(input: string): string {
  if (!input) return ''
  return String(input)
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 1000) // Limit length
}

/**
 * Saves classroom video to Supabase with proper error handling
 */
export async function saveClassroomVideoToSupabase(
  videoData: {
    title: string
    youtube_url: string
    youtube_embed_id: string
    title_ar?: string
    title_en?: string
    title_fr?: string
    is_published?: boolean
  },
  isEditing: boolean = false,
  videoId?: string
) {
  try {
    // Validate YouTube URL
    if (!videoData.youtube_url || !videoData.youtube_embed_id) {
      throw new Error('Invalid YouTube URL')
    }

    // Prepare data for Supabase
    const payload = {
      title: sanitizeFormInput(videoData.title),
      youtube_url: videoData.youtube_url,
      youtube_embed_id: videoData.youtube_embed_id,
      is_published: videoData.is_published ?? true,
      ...(videoData.title_ar && { title_ar: sanitizeFormInput(videoData.title_ar) }),
      ...(videoData.title_en && { title_en: sanitizeFormInput(videoData.title_en) }),
      ...(videoData.title_fr && { title_fr: sanitizeFormInput(videoData.title_fr) }),
    }

    let result
    if (isEditing && videoId) {
      // Update existing video
      const { data, error } = await supabase
        .from('classroom_videos')
        .update(payload)
        .eq('id', videoId)
        .select()

      if (error) throw error
      result = data?.[0]
    } else {
      // Insert new video
      const { data, error } = await supabase
        .from('classroom_videos')
        .insert([payload])
        .select()

      if (error) throw error
      result = data?.[0]
    }

    return {
      success: true,
      data: result,
      message: isEditing ? 'Video updated successfully' : 'Video added successfully'
    }
  } catch (error) {
    console.error('[v0] Error saving video to Supabase:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save video',
      message: error instanceof Error ? error.message : 'An error occurred while saving'
    }
  }
}

/**
 * Formats form data for display and editing
 * Handles missing translations gracefully
 */
export function formatFormDataForDisplay(data: Partial<MultilingualFormData>) {
  return {
    title_ar: data?.title_ar || '',
    title_en: data?.title_en || '',
    title_fr: data?.title_fr || '',
    description_ar: data?.description_ar || '',
    description_en: data?.description_en || '',
    description_fr: data?.description_fr || '',
    youtube_url: data?.youtube_url || '',
    ...data
  }
}
