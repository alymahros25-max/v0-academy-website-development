import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Initialize Supabase only if credentials are available
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

/**
 * GET: Fetch site content with optional filtering
 * Query params:
 *  - key?: string - specific content key
 *  - section?: string - filter by section (e.g., "homepage", "about")
 *  - locale?: string - return single language (ar, en, fr) or all
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database not configured',
        data: [] 
      }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const section = searchParams.get('section')
    const locale = searchParams.get('locale') // 'ar', 'en', 'fr', or 'all'

    let query = supabase
      .from('site_content')
      .select('*')
      .eq('is_active', true)

    if (key) {
      query = query.eq('key', key)
    }

    if (section) {
      query = query.eq('section', section)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch content' },
        { status: 500 }
      )
    }

    // Transform data based on requested locale
    const transformedData = data?.map((item) => {
      if (locale && locale !== 'all') {
        const contentKey = `content_${locale}` as keyof typeof item
        return {
          key: item.key,
          content: item[contentKey],
          section: item.section,
          type: item.type,
        }
      }
      return item
    })

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData?.length || 0,
    })
  } catch (error) {
    console.error('[v0] Content API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST: Create or update site content
 * Body: {
 *   key: string,
 *   content_ar: string,
 *   content_en: string,
 *   content_fr: string,
 *   section: string,
 *   type: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      key?: string
      content_ar?: string
      content_en?: string
      content_fr?: string
      section?: string
      type?: string
      is_active?: boolean
    }

    const {
      key,
      content_ar,
      content_en,
      content_fr,
      section,
      type,
      is_active = true,
    } = body

    // Validation
    if (!key) {
      return NextResponse.json(
        { error: 'Content key is required' },
        { status: 400 }
      )
    }

    if (!content_ar && !content_en && !content_fr) {
      return NextResponse.json(
        { error: 'At least one language content is required' },
        { status: 400 }
      )
    }

    // Upsert content (insert or update if exists)
    const { data, error } = await supabase
      .from('site_content')
      .upsert(
        {
          key,
          content_ar: content_ar || null,
          content_en: content_en || null,
          content_fr: content_fr || null,
          section,
          type,
          is_active,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select()

    if (error) {
      console.error('[v0] Upsert error:', error)
      return NextResponse.json(
        { error: 'Failed to save content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
      message: 'Content saved successfully',
    })
  } catch (error) {
    console.error('[v0] Content creation error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Delete content by key
 * Query params: key=string
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Content key is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('key', key)

    if (error) {
      console.error('[v0] Delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    })
  } catch (error) {
    console.error('[v0] Content deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
