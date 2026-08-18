import { createClient } from '@supabase/supabase-js'
import { extractYouTubeId } from '@/lib/youtube-utils'
import type { VideoData } from '@/components/classroom-moments/VideoGrid'

export type LandingVideo = VideoData & {
  published: boolean
  order: number
  showOnLandingPages: boolean
  videoUrl: string
  poster?: string
}

export async function getPublishedClassroomVideos(): Promise<LandingVideo[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from('classroom_videos')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[v0] classroom videos adapter error:', error.message)
    return []
  }

  return (data ?? []).map((video: Record<string, unknown>, index): LandingVideo => {
    const videoUrl = String(video.youtube_url ?? '')
    const embedId = extractYouTubeId(videoUrl) ?? String(video.youtube_embed_id ?? '')
    return {
      id: String(video.id ?? index),
      title_ar: String(video.title_ar ?? 'بدون عنوان'),
      title_en: String(video.title_en ?? video.title_ar ?? 'No title'),
      title_fr: String(video.title_fr ?? video.title_ar ?? 'Sans titre'),
      description_ar: String(video.description_ar ?? ''),
      description_en: String(video.description_en ?? ''),
      description_fr: String(video.description_fr ?? ''),
      youtube_embed_id: embedId,
      thumbnail_url: String(video.thumbnail_url ?? `https://img.youtube.com/vi/${embedId}/sddefault.jpg`),
      category: String(video.category ?? ''),
      teacher_name_ar: String(video.teacher_name_ar ?? ''),
      teacher_name_en: String(video.teacher_name_en ?? ''),
      teacher_name_fr: String(video.teacher_name_fr ?? ''),
      duration_seconds: typeof video.duration_seconds === 'number' ? video.duration_seconds : undefined,
      is_featured: Boolean(video.is_featured),
      published: true,
      order: Number(video.display_order ?? index),
      showOnLandingPages: video.show_on_landing_pages !== false,
      videoUrl,
      poster: String(video.thumbnail_url ?? `https://img.youtube.com/vi/${embedId}/sddefault.jpg`),
    }
  }).filter((video) => /^[a-zA-Z0-9_-]{11}$/.test(video.youtube_embed_id) && video.showOnLandingPages)
}

export type { VideoData }

// Future Supabase adapter boundary: keep landing pages dependent on this function,
// so replacing the backing store does not require changing their UI.
