import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const revalidate = 0

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json([], { headers: { "Cache-Control": "no-store" } })
  }

  const { data, error } = await supabaseAdmin
    .from("faq_items")
    .select("id, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, category, sort_order")
    .eq("is_active", true)
    .order("category")
    .order("sort_order")

  if (error) {
    console.error("[Public FAQ] Failed to load FAQ:", error.message)
    return NextResponse.json({ error: "FAQ unavailable" }, { status: 503 })
  }

  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "no-store" },
  })
}
