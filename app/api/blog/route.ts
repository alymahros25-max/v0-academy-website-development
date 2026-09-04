import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

// GET: fetch published posts (public) or all posts (admin with service key)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const all = searchParams.get('all') === 'true'

    const key = all ? supabaseServiceKey : supabaseAnonKey
    const supabase = createClient(supabaseUrl, key)

    if (slug) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json(data)
    }

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (!all) {
      query = query.eq('is_published', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] blog GET error:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog GET exception:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title_ar, title_en, title_fr,
      excerpt_ar, excerpt_en, excerpt_fr,
      content_ar, content_en, content_fr,
      cover_image, category_ar, category_en, category_fr,
      author_ar, author_en, author_fr,
      read_time, is_published, slug: customSlug
    } = body

    if (!title_ar?.trim()) {
      return NextResponse.json({ error: 'title_ar is required' }, { status: 400 })
    }

    const slug = customSlug?.trim() || slugify(title_ar) || `post-${Date.now()}`
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        slug,
        title_ar: title_ar.trim(),
        title_en: title_en?.trim() || title_ar.trim(),
        title_fr: title_fr?.trim() || title_ar.trim(),
        excerpt_ar: excerpt_ar?.trim() || '',
        excerpt_en: excerpt_en?.trim() || excerpt_ar?.trim() || '',
        excerpt_fr: excerpt_fr?.trim() || excerpt_ar?.trim() || '',
        content_ar: content_ar?.trim() || '',
        content_en: content_en?.trim() || content_ar?.trim() || '',
        content_fr: content_fr?.trim() || content_ar?.trim() || '',
        cover_image: cover_image?.trim() || '/images/hero-children.webp',
        category_ar: category_ar?.trim() || 'عام',
        category_en: category_en?.trim() || 'General',
        category_fr: category_fr?.trim() || 'Général',
        author_ar: author_ar?.trim() || 'فريق الأكاديمية',
        author_en: author_en?.trim() || 'Academy Team',
        author_fr: author_fr?.trim() || "Équipe de l'académie",
        read_time: read_time || 5,
        is_published: is_published ?? false,
        published_at: is_published ? new Date().toISOString() : null,
      }])
      .select()
      .single()

    if (error) {
      console.error('[v0] blog POST error:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create post', details: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog POST exception:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: update post (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...fields } = body

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: Record<string, unknown> = { ...fields, updated_at: new Date().toISOString() }

    if (fields.is_published && !fields.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] blog PUT error:', error)
      return NextResponse.json({ error: 'Failed to update post', details: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog PUT exception:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: delete post (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0] blog DELETE error:', error)
      return NextResponse.json({ error: 'Failed to delete post', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[v0] blog DELETE exception:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
