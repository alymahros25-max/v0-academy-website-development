import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const revalidate = 300

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Missing Supabase credentials')
}

// Helper to extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  if (!url) return null

  try {
    // Handle youtube.com/watch?v=ID format
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (watchMatch?.[1]) return watchMatch[1]

    // Handle youtu.be/ID format
    const youtuMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (youtuMatch?.[1]) return youtuMatch[1]

    // Handle youtube.com/embed/ID format
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embedMatch?.[1]) return embedMatch[1]

    // Handle just the 11-character ID
    const idMatch = url.match(/^([a-zA-Z0-9_-]{11})$/)
    if (idMatch?.[1]) return idMatch[1]

    return null
  } catch {
    console.error('[v0] Error extracting YouTube ID:', url)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('classroom_videos')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch videos', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (err: any) {
    console.error('[v0] GET error:', err?.message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title_ar, title_en, youtube_url, description_ar, category } = body

    // Validate required fields
    if (!title_ar?.trim() || !youtube_url?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: title_ar, youtube_url' },
        { status: 400 }
      )
    }

    // Extract YouTube ID
    const youtube_id = extractYouTubeId(youtube_url)
    if (!youtube_id) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL format' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('classroom_videos')
      .insert([
        {
          title_ar: title_ar.trim(),
          title_en: title_en?.trim() || title_ar.trim(),
          description_ar: description_ar?.trim() || '',
          youtube_url: youtube_url.trim(),
          youtube_embed_id: youtube_id,
          category: category?.trim() || 'general',
          is_published: true,
          display_order: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[v0] Insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save video', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('[v0] POST error:', err?.message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing video ID' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('classroom_videos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0] Delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete video', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error('[v0] DELETE error:', err?.message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
