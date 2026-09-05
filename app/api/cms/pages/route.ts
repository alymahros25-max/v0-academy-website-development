import { requireAdmin } from '@/lib/api-auth'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { revalidateDynamicPages } from '@/lib/api-revalidate'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

const jsonPayload = z.unknown().superRefine((value, context) => {
  try {
    if (JSON.stringify(value).length > 100_000) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'Payload is too large' })
    }
  } catch {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Payload must be JSON serializable' })
  }
})

const sitePageSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens only'),
  title_ar: z.string().trim().max(200).optional(),
  title_en: z.string().trim().max(200).optional(),
  title_fr: z.string().trim().max(200).optional(),
  meta_description_ar: z.string().trim().max(500).optional(),
  meta_description_en: z.string().trim().max(500).optional(),
  meta_description_fr: z.string().trim().max(500).optional(),
  template_type: z.string().trim().min(1).max(50).optional(),
  content_json: jsonPayload.optional(),
  settings_json: jsonPayload.optional(),
  is_published: z.boolean().optional(),
  is_home_page: z.boolean().optional(),
}).strict()

type SitePage = z.infer<typeof sitePageSchema>

function parsePageId(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function parseJsonBody(requestBody: unknown, schema: z.ZodTypeAny) {
  const result = schema.safeParse(requestBody)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid page payload', issues: result.error.issues.map(({ path, message }) => ({ path, message })) },
      { status: 400 },
    )
  }
  return result.data
}

async function revalidateAfterMutation() {
  try {
    await revalidateDynamicPages()
  } catch (error) {
    console.warn('[CMS pages] Revalidation warning:', error)
  }
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured', data: [] }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const published = searchParams.get('published')
    const pageIdParam = searchParams.get('id')
    const pageId = pageIdParam ? parsePageId(pageIdParam) : null

    if (pageIdParam && pageId === null) {
      return NextResponse.json({ error: 'Invalid page ID' }, { status: 400 })
    }
    if (published && published !== 'true' && published !== 'false') {
      return NextResponse.json({ error: 'Invalid published filter' }, { status: 400 })
    }

    let query = supabase.from('site_pages').select('*')
    if (slug) query = query.eq('slug', slug)
    if (pageId !== null) query = query.eq('id', pageId)
    if (published) query = query.eq('is_published', published === 'true')

    const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
    if (error) {
      console.error('[CMS pages] Fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[CMS pages] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const parsed = parseJsonBody(await request.json(), sitePageSchema)
    if (parsed instanceof NextResponse) return parsed
    const body = parsed as SitePage

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
        content_json: body.content_json ?? {},
        settings_json: body.settings_json ?? {},
        is_published: body.is_published ?? false,
        is_home_page: body.is_home_page ?? false,
      })
      .select()

    if (error) {
      console.error('[CMS pages] Creation error:', error)
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
    }

    await revalidateAfterMutation()
    return NextResponse.json({ success: true, data: data?.[0], message: 'Page created successfully', revalidated: true }, { status: 201 })
  } catch (error) {
    console.error('[CMS pages] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const pageId = parsePageId(new URL(request.url).searchParams.get('id'))
    if (pageId === null) return NextResponse.json({ error: 'A valid page ID is required' }, { status: 400 })

    const parsed = parseJsonBody(await request.json(), sitePageSchema.partial())
    if (parsed instanceof NextResponse) return parsed
    const body = parsed as Partial<SitePage>
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

    for (const field of [
      'slug', 'title_ar', 'title_en', 'title_fr', 'meta_description_ar', 'meta_description_en',
      'meta_description_fr', 'template_type', 'content_json', 'settings_json', 'is_published', 'is_home_page',
    ] as const) {
      if (body[field] !== undefined) updateData[field] = body[field]
    }

    const { data, error } = await supabase
      .from('site_pages')
      .update(updateData)
      .eq('id', pageId)
      .select()

    if (error) {
      console.error('[CMS pages] Update error:', error)
      return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
    }

    await revalidateAfterMutation()
    return NextResponse.json({ success: true, data: data?.[0], message: 'Page updated successfully', revalidated: true }, { status: 200 })
  } catch (error) {
    console.error('[CMS pages] PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const pageId = parsePageId(new URL(request.url).searchParams.get('id'))
    if (pageId === null) return NextResponse.json({ error: 'A valid page ID is required' }, { status: 400 })

    const { error } = await supabase.from('site_pages').delete().eq('id', pageId)
    if (error) {
      console.error('[CMS pages] Deletion error:', error)
      return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
    }

    await revalidateAfterMutation()
    return NextResponse.json({ success: true, message: 'Page deleted successfully', revalidated: true }, { status: 200 })
  } catch (error) {
    console.error('[CMS pages] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
