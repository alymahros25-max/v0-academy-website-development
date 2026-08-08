import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

export async function GET(request: NextRequest) {
  if (!supabase) return NextResponse.json({ data: [], error: "Database not configured" }, { status: 200 })
  const admin = request.nextUrl.searchParams.get("admin") === "true"
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
  const body = await request.json()
  const { data, error } = await supabase.from("digital_library_documents").insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath("/library")
  return NextResponse.json({ data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const { id, ...updates } = await request.json()
  const { data, error } = await supabase.from("digital_library_documents").update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath("/library")
  return NextResponse.json({ data })
}

export async function DELETE(request: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const id = request.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const { error } = await supabase.from("digital_library_documents").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath("/library")
  return NextResponse.json({ ok: true })
}
