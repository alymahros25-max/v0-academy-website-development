import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { verifyAdminSession } from "@/lib/admin-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const resourceSchema = z.enum(["content", "packages", "faq", "links"])
const idSchema = z.coerce.number().int().positive()
const patchSchema = z.object({
  resource: resourceSchema,
  id: idSchema,
  changes: z.record(z.string(), z.unknown()),
}).strict()

const fieldAllowList: Record<z.infer<typeof resourceSchema>, Set<string>> = {
  content: new Set(["content_ar", "content_en", "content_fr", "content_type", "section", "href", "is_active", "sort_order"]),
  packages: new Set(["program", "name_ar", "name_en", "name_fr", "description_ar", "description_en", "description_fr", "price", "billing_period", "sessions_per_month", "features_ar", "features_en", "features_fr", "is_popular", "is_active", "sort_order"]),
  faq: new Set(["question_ar", "question_en", "question_fr", "answer_ar", "answer_en", "answer_fr", "is_active", "sort_order"]),
  links: new Set(["label_ar", "label_en", "label_fr", "href", "link_type", "is_external", "is_active", "sort_order"]),
}

function safeChanges(resource: z.infer<typeof resourceSchema>, changes: Record<string, unknown>) {
  const allowed = fieldAllowList[resource]
  return Object.fromEntries(Object.entries(changes).filter(([key]) => allowed.has(key)))
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })

  const slug = request.nextUrl.searchParams.get("slug")
  let areasQuery = supabaseAdmin
    .from("site_areas")
    .select("id, slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol, is_active")
    .order("area_type", { ascending: true })
    .order("slug", { ascending: true })
  if (slug) areasQuery = areasQuery.eq("slug", slug)
  const { data: areas, error: areasError } = await areasQuery
  if (areasError) return NextResponse.json({ error: "Failed to load areas" }, { status: 500 })
  if (!areas?.length) return NextResponse.json({ areas: [] })

  const areaIds = areas.map((area) => area.id)
  const [{ data: content }, { data: packages }, { data: faq }, { data: links }] = await Promise.all([
    supabaseAdmin.from("area_content").select("id, area_id, content_key, content_ar, content_en, content_fr, content_type, section, href, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_packages").select("id, area_id, program, package_key, name_ar, name_en, name_fr, description_ar, description_en, description_fr, price, currency_code, billing_period, sessions_per_month, features_ar, features_en, features_fr, is_popular, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_faq_items").select("id, area_id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_links").select("id, area_id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
  ])

  return NextResponse.json({
    areas,
    content: content ?? [],
    packages: packages ?? [],
    faq: faq ?? [],
    links: links ?? [],
  }, { headers: { "Cache-Control": "no-store" } })
}

export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const parsed = patchSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid area update" }, { status: 400 })
  const changes = safeChanges(parsed.data.resource, parsed.data.changes)
  if (!Object.keys(changes).length) return NextResponse.json({ error: "No editable fields supplied" }, { status: 400 })

  const table = parsed.data.resource === "packages" ? "area_packages" : parsed.data.resource === "faq" ? "area_faq_items" : parsed.data.resource === "links" ? "area_links" : "area_content"
  const { data, error } = await supabaseAdmin.from(table).update({ ...changes, updated_at: new Date().toISOString() }).eq("id", parsed.data.id).select().single()
  if (error) return NextResponse.json({ error: "Failed to update area record" }, { status: 400 })
  return NextResponse.json({ data })
}
