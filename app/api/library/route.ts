import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { verifyAdminSession } from "@/lib/admin-auth"
import { z } from "zod"

const documentSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  category: z.string().trim().max(100).optional().nullable(),
  file_url: z.string().url().max(2000).optional().nullable(),
  is_published: z.boolean().optional(),
  sort_order: z.number().int().min(0).max(100000).optional(),
}).strict()

async function requireAdmin() {
  return verifyAdminSession()
}

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

export async function GET(request: NextRequest) {
  if (!supabase) return NextResponse.json({ data: [], error: "Database not configured" }, { status: 200 })
  const admin = request.nextUrl.searchParams.get("admin") === "true"
  if (admin && !(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  let query = supabase.from("digital_library_documents").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false })
  if (!admin) query = query.eq("is_published", true)
  const category = request.nextUrl.searchParams.get("category")
  if (category) query = query.eq("category", category)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: "Failed to load library" }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const parsed = documentSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid document data" }, { status: 400 })
  const { data, error } = await supabase.from("digital_library_documents").insert(parsed.data).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath("/library")
  return NextResponse.json({ data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()
  const id = z.string().uuid().safeParse(body.id)
  const parsed = documentSchema.safeParse(body)
  if (!id.success || !parsed.success) return NextResponse.json({ error: "Invalid document data" }, { status: 400 })
  const { data, error } = await supabase.from("digital_library_documents").update(parsed.data).eq("id", id.data).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath("/library")
  return NextResponse.json({ data })
}

export async function DELETE(request: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const parsedId = z.string().uuid().safeParse(request.nextUrl.searchParams.get("id"))
  if (!parsedId.success) return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  const { error } = await supabase.from("digital_library_documents").delete().eq("id", parsedId.data)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath("/library")
  return NextResponse.json({ ok: true })
}
