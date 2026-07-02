import { createClient } from "@supabase/supabase-js"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schema
const LibraryItemSchema = z.object({
  title_ar: z.string().min(1),
  title_en: z.string().min(1),
  title_fr: z.string().min(1),
  description_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_fr: z.string().optional(),
  author_ar: z.string().optional(),
  author_en: z.string().optional(),
  author_fr: z.string().optional(),
  content_type: z.enum(["book", "quran_audio", "nasheed", "tajweed"]),
  pdf_url: z.string().optional(),
  audio_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  qari_name_ar: z.string().optional(),
  qari_name_en: z.string().optional(),
  is_quran_audio: z.boolean().optional(),
  nasheed_artist_ar: z.string().optional(),
  nasheed_artist_en: z.string().optional(),
  lyrics_ar: z.string().optional(),
  lyrics_en: z.string().optional(),
  is_nasheed: z.boolean().optional(),
  tajweed_level: z.string().optional(),
  tajweed_category: z.string().optional(),
  is_tajweed: z.boolean().optional(),
  duration_seconds: z.number().optional(),
  file_size_mb: z.number().optional(),
  page_count: z.number().optional(),
  publication_year: z.number().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_free: z.boolean().optional(),
  display_order: z.number().optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const contentType = searchParams.get("type")
    const category = searchParams.get("category")
    const published = searchParams.get("published") !== "false"

    let query = supabase
      .from("digital_library")
      .select("*")
      .order("display_order", { ascending: true })

    if (published) {
      query = query.eq("is_published", true)
    }

    if (contentType) {
      query = query.eq("content_type", contentType)
    }

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) throw error

    return Response.json(data || [])
  } catch (error) {
    console.error("Digital library GET error:", error)
    return Response.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = LibraryItemSchema.parse(body)

    const { data, error } = await supabase
      .from("digital_library")
      .insert([validated])
      .select()

    if (error) throw error

    revalidateTag("digital-library")
    return Response.json(data?.[0], { status: 201 })
  } catch (error) {
    console.error("Digital library POST error:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    return Response.json({ error: "Failed to create item" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 })
    }

    const body = await req.json()
    const validated = LibraryItemSchema.partial().parse(body)

    const { data, error } = await supabase
      .from("digital_library")
      .update({ ...validated, updated_at: new Date() })
      .eq("id", id)
      .select()

    if (error) throw error

    revalidateTag("digital-library")
    return Response.json(data?.[0])
  } catch (error) {
    console.error("Digital library PATCH error:", error)
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    return Response.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("digital_library")
      .delete()
      .eq("id", id)

    if (error) throw error

    revalidateTag("digital-library")
    return Response.json({ success: true })
  } catch (error) {
    console.error("Digital library DELETE error:", error)
    return Response.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
