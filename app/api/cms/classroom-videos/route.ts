import { requireAdmin } from '@/lib/api-auth'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateThemeSettings, revalidateDynamicPages } from '@/lib/api-revalidate'
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube-utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

interface ClassroomVideo {
  id?: string
  title_ar: string
  title_en: string
  title_fr: string
  description_ar?: string
  description_en?: string
  description_fr?: string
  teacher_name_ar?: string
  teacher_name_en?: string
  teacher_name_fr?: string
  youtube_url: string
  youtube_embed_id: string
  category?: string
  thumbnail_url?: string
  is_published?: boolean
  is_featured?: boolean
  display_order?: number
}

// GET: Fetch classroom videos
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured', data: [] }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    let query = supabase
      .from('classroom_videos')
      .select('*')

    if (videoId) {
      query = query.eq('id', videoId)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (published === 'true') {
      query = query.eq('is_published', true)
    } else if (published === 'false') {
      query = query.eq('is_published', false)
    }

    const { data, error } = await query
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[v0] Classroom videos fetch error:', error)
      return NextResponse.json({ error: error.message, data: [] }, { status: 400 })
    }

    return NextResponse.json({ data: data || [] }, { status: 200 })
  } catch (error) {
    console.error('[v0] GET /api/cms/classroom-videos error:', error)
    return NextResponse.json({ error: 'Internal server error', data: [] }, { status: 500 })
  }
}

// POST: Create new classroom video
export async function POST(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body: ClassroomVideo = await request.json()

    // Validate required fields
    if (!body.title_ar || !body.title_en || !body.title_fr) {
      return NextResponse.json({ error: 'titles_required: title_ar, title_en, title_fr' }, { status: 400 })
    }

    if (!body.youtube_url) {
      return NextResponse.json({ error: 'youtube_url is required' }, { status: 400 })
    }

    // Extract YouTube ID from URL
    const embedId = extractYouTubeId(body.youtube_url)
    if (!embedId) {
      return NextResponse.json({ error: 'Invalid YouTube URL format' }, { status: 400 })
    }

    // Check if this embed ID already exists
    const { data: existing } = await supabase
      .from('classroom_videos')
      .select('id')
      .eq('youtube_embed_id', embedId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This video already exists in the database' }, { status: 400 })
    }

    // Generate thumbnail if not provided
    const thumbnail = body.thumbnail_url || getYouTubeThumbnail(embedId, 'high')

    // Create the video record
    const { data, error } = await supabase
      .from('classroom_videos')
      .insert({
        title_ar: body.title_ar,
        title_en: body.title_en,
        title_fr: body.title_fr,
        description_ar: body.description_ar || '',
        description_en: body.description_en || '',
        description_fr: body.description_fr || '',
        teacher_name_ar: body.teacher_name_ar || '',
        teacher_name_en: body.teacher_name_en || '',
        teacher_name_fr: body.teacher_name_fr || '',
        youtube_url: body.youtube_url,
        youtube_embed_id: embedId,
        thumbnail_url: thumbnail,
        category: body.category || 'عام',
        is_published: body.is_published ?? true,
        is_featured: body.is_featured ?? false,
        display_order: body.display_order ?? 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Create classroom video error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Revalidate pages
    await revalidateDynamicPages()

    return NextResponse.json({ data, revalidated: true }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/cms/classroom-videos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update classroom video
export async function PATCH(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (!videoId) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 })
    }

    const body: Partial<ClassroomVideo> = await request.json()

    // If updating YouTube URL, validate and extract new ID
    let embedId = undefined
    if (body.youtube_url) {
      embedId = extractYouTubeId(body.youtube_url)
      if (!embedId) {
        return NextResponse.json({ error: 'Invalid YouTube URL format' }, { status: 400 })
      }

      // Check if new embed ID already exists (excluding current video)
      const { data: existing } = await supabase
        .from('classroom_videos')
        .select('id')
        .eq('youtube_embed_id', embedId)
        .neq('id', videoId)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'This YouTube video already exists in the database' }, { status: 400 })
      }
    }

    const updateData: any = {
      ...(body.title_ar && { title_ar: body.title_ar }),
      ...(body.title_en && { title_en: body.title_en }),
      ...(body.title_fr && { title_fr: body.title_fr }),
      ...(body.description_ar !== undefined && { description_ar: body.description_ar }),
      ...(body.description_en !== undefined && { description_en: body.description_en }),
      ...(body.description_fr !== undefined && { description_fr: body.description_fr }),
      ...(body.teacher_name_ar !== undefined && { teacher_name_ar: body.teacher_name_ar }),
      ...(body.teacher_name_en !== undefined && { teacher_name_en: body.teacher_name_en }),
      ...(body.teacher_name_fr !== undefined && { teacher_name_fr: body.teacher_name_fr }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.is_published !== undefined && { is_published: body.is_published }),
      ...(body.is_featured !== undefined && { is_featured: body.is_featured }),
      ...(body.display_order !== undefined && { display_order: body.display_order }),
      updated_at: new Date().toISOString(),
    }

    // Handle YouTube URL and ID update
    if (body.youtube_url && embedId) {
      updateData.youtube_url = body.youtube_url
      updateData.youtube_embed_id = embedId
      updateData.thumbnail_url = getYouTubeThumbnail(embedId, 'high')
    }

    const { data, error } = await supabase
      .from('classroom_videos')
      .update(updateData)
      .eq('id', videoId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Update classroom video error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Revalidate pages
    await revalidateDynamicPages()

    return NextResponse.json({ data, revalidated: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] PATCH /api/cms/classroom-videos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete classroom video
export async function DELETE(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (!videoId) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('classroom_videos')
      .delete()
      .eq('id', videoId)

    if (error) {
      console.error('[v0] Delete classroom video error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Revalidate pages
    await revalidateDynamicPages()

    return NextResponse.json({ message: 'Video deleted successfully', revalidated: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] DELETE /api/cms/classroom-videos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
