import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/api-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const faqSchema = z.object({
  question_ar: z.string().trim().min(1).max(500),
  question_en: z.string().trim().max(500).nullable().optional(),
  question_fr: z.string().trim().max(500).nullable().optional(),
  answer_ar: z.string().trim().min(1).max(10000),
  answer_en: z.string().trim().max(10000).nullable().optional(),
  answer_fr: z.string().trim().max(10000).nullable().optional(),
  category: z.string().trim().min(1).max(50).default("general"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
})

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json([])

  const { data, error } = await supabaseAdmin.from("faq_items").select("*").order("category").order("sort_order")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 })

  const parsed = faqSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid FAQ data" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("faq_items").insert(parsed.data).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 })

  const body = await request.json()
  const id = z.coerce.number().int().positive().safeParse(body.id)
  if (!id.success) return NextResponse.json({ error: "Invalid FAQ id" }, { status: 400 })
  const parsed = faqSchema.partial().safeParse(body.data)
  if (!parsed.success) return NextResponse.json({ error: "Invalid FAQ data" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("faq_items").update(parsed.data).eq("id", id.data).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin()
  if (authError) return authError
  if (!supabaseAdmin) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 })

  const id = z.coerce.number().int().positive().safeParse(new URL(request.url).searchParams.get("id"))
  if (!id.success) return NextResponse.json({ error: "Invalid FAQ id" }, { status: 400 })
  const { error } = await supabaseAdmin.from("faq_items").delete().eq("id", id.data)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
