import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const revalidate = 0

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")
  const locale = new URL(request.url).searchParams.get("locale") ?? "ar"

  if (!slug || !["terms", "privacy", "refund-policy"].includes(slug)) {
    return NextResponse.json({ error: "Invalid legal page" }, { status: 400 })
  }

  if (!supabaseAdmin) return NextResponse.json(null, { headers: { "Cache-Control": "no-store" } })

  const { data, error } = await supabaseAdmin
    .from("legal_pages")
    .select("page_slug, locale, title, content, updated_at")
    .eq("page_slug", slug)
    .eq("locale", ["ar", "en", "fr"].includes(locale) ? locale : "ar")
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[Public Legal] Failed to load legal page:", error.message)
    return NextResponse.json({ error: "Legal page unavailable" }, { status: 503 })
  }

  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } })
}
