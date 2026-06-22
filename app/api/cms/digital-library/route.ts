import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { revalidateTag } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schema
const DigitalLibrarySchema = z.object({
  title_ar: z.string().min(1, "العنوان العربي مطلوب"),
  title_en: z.string().optional(),
  title_fr: z.string().optional(),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_fr: z.string().optional(),
  author_ar: z.string().optional(),
  author_en: z.string().optional(),
  author_fr: z.string().optional(),
  content_type: z.enum(['book', 'quran_audio', 'nasheed', 'tajweed']),
  pdf_url: z.string().url().optional().or(z.literal('')),
  audio_url: z.string().url().optional().or(z.literal('')),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  qari_name_ar: z.string().optional(),
  qari_name_en: z.string().optional(),
  nasheed_artist_ar: z.string().optional(),
  nasheed_artist_en: z.string().optional(),
  lyrics_ar: z.string().optional(),
  lyrics_en: z.string().optional(),
  tajweed_level: z.string().optional(),
  tajweed_category: z.string().optional(),
  duration_seconds: z.number().optional(),
  page_count: z.number().optional(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
})

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const content_type = url.searchParams.get('content_type')
    const published = url.searchParams.get('published') === 'true'
    const featured = url.searchParams.get('featured') === 'true'

    let query = supabase
      .from('digital_library')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (published) query = query.eq('is_published', true)
    if (featured) query = query.eq('is_featured', true)
    if (content_type) query = query.eq('content_type', content_type)

    const { data, error } = await query

    if (error) {
      console.error('[v0] Supabase error:', error)
      return Response.json({ error: 'Failed to fetch content' }, { status: 500 })
    }

    return Response.json(data || [])
  } catch (error) {
    console.error('[v0] API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = DigitalLibrarySchema.parse(body)

    // Auto-generate EN/FR translations if missing
    const data = {
      ...validated,
      title_en: validated.title_en || validated.title_ar,
      title_fr: validated.title_fr || validated.title_ar,
      description_en: validated.description_en || validated.description_ar || '',
      description_fr: validated.description_fr || validated.description_ar || '',
    }

    const { data: result, error } = await supabase
      .from('digital_library')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('[v0] Insert error:', error)
      return Response.json({ error: 'Failed to create content' }, { status: 500 })
    }

    revalidateTag('digital-library')
    return Response.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('[v0] POST error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'ID required' }, { status: 400 })
    }

    const body = await request.json()
    const validated = DigitalLibrarySchema.partial().parse(body)

    const { data, error } = await supabase
      .from('digital_library')
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq('id', parseInt(id))
      .select()
      .single()

    if (error) {
      console.error('[v0] Update error:', error)
      return Response.json({ error: 'Failed to update content' }, { status: 500 })
    }

    revalidateTag('digital-library')
    return Response.json(data)
  } catch (error) {
    console.error('[v0] PATCH error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('digital_library')
      .delete()
      .eq('id', parseInt(id))

    if (error) {
      console.error('[v0] Delete error:', error)
      return Response.json({ error: 'Failed to delete content' }, { status: 500 })
    }

    revalidateTag('digital-library')
    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
