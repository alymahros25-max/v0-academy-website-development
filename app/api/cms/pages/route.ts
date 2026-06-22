import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

interface SitePage {
  id?: number
  slug: string
  title_ar?: string
  title_en?: string
  title_fr?: string
  meta_description_ar?: string
  meta_description_en?: string
  meta_description_fr?: string
  template_type?: string
  content_json?: any
  settings_json?: any
  is_published?: boolean
  is_home_page?: boolean
  created_by?: number
  updated_by?: number
  published_by?: number
}

// GET: Fetch pages
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured', data: [] }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const isPublished = searchParams.get('published')
    const pageId = searchParams.get('id')

    let query = supabase
      .from('site_pages')
      .select('*')

    if (slug) query = query.eq('slug', slug)
    if (pageId) query = query.eq('id', parseInt(pageId))
    if (isPublished) query = query.eq('is_published', isPublished === 'true')

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Pages fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[v0] GET /api/cms/pages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create new page
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body: SitePage = await request.json()

    if (!body.slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('site_pages')
      .insert({
        slug: body.slug,
        title_ar: body.title_ar,
        title_en: body.title_en,
        title_fr: body.title_fr,
        meta_description_ar: body.meta_description_ar,
        meta_description_en: body.meta_description_en,
        meta_description_fr: body.meta_description_fr,
        template_type: body.template_type || 'custom',
        content_json: body.content_json || {},
        settings_json: body.settings_json || {},
        is_published: body.is_published || false,
        is_home_page: body.is_home_page || false,
      })
      .select()

    if (error) {
      console.error('[v0] Page creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/cms/pages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update page
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('id')

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const body: Partial<SitePage> = await request.json()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.title_ar) updateData.title_ar = body.title_ar
    if (body.title_en) updateData.title_en = body.title_en
    if (body.title_fr) updateData.title_fr = body.title_fr
    if (body.meta_description_ar) updateData.meta_description_ar = body.meta_description_ar
    if (body.meta_description_en) updateData.meta_description_en = body.meta_description_en
    if (body.meta_description_fr) updateData.meta_description_fr = body.meta_description_fr
    if (body.template_type) updateData.template_type = body.template_type
    if (body.content_json !== undefined) updateData.content_json = body.content_json
    if (body.settings_json !== undefined) updateData.settings_json = body.settings_json
    if (body.is_published !== undefined) updateData.is_published = body.is_published
    if (body.is_home_page !== undefined) updateData.is_home_page = body.is_home_page

    const { data, error } = await supabase
      .from('site_pages')
      .update(updateData)
      .eq('id', parseInt(pageId))
      .select()

    if (error) {
      console.error('[v0] Page update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 200 })
  } catch (error) {
    console.error('[v0] PATCH /api/cms/pages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete page
export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('id')

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('site_pages')
      .delete()
      .eq('id', parseInt(pageId))

    if (error) {
      console.error('[v0] Page deletion error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('[v0] DELETE /api/cms/pages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
