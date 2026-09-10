import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { verifyAdminSession } from "@/lib/admin-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const resourceSchema = z.enum(["content", "packages", "faq", "links", "themes", "cities", "timezones"])
const idSchema = z.coerce.number().int().positive()
const patchSchema = z.object({
  resource: resourceSchema,
  id: idSchema,
  changes: z.record(z.string(), z.unknown()),
}).strict()
const deleteSchema = z.object({ resource: z.literal("packages"), id: idSchema }).strict()

const fieldAllowList: Record<z.infer<typeof resourceSchema>, Set<string>> = {
  content: new Set(["content_ar", "content_en", "content_fr", "content_type", "section", "href", "is_active", "sort_order"]),
  packages: new Set(["program", "name_ar", "name_en", "name_fr", "description_ar", "description_en", "description_fr", "price", "billing_period", "sessions_per_month", "features_ar", "features_en", "features_fr", "is_popular", "is_active", "sort_order"]),
  faq: new Set(["question_ar", "question_en", "question_fr", "answer_ar", "answer_en", "answer_fr", "is_active", "sort_order"]),
  links: new Set(["label_ar", "label_en", "label_fr", "href", "link_type", "is_external", "is_active", "sort_order"]),
  themes: new Set(["theme_name_ar", "theme_name_en", "primary_color", "secondary_color", "accent_color", "background_color", "text_color", "quran_fact_title_ar", "quran_fact_body_ar", "quran_fact_reference_ar", "is_active", "sort_order"]),
  cities: new Set(["name_ar", "name_en", "region_name", "is_active", "sort_order"]),
  timezones: new Set(["timezone_name", "label_ar", "label_en", "is_primary", "is_active", "sort_order"]),
}

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/)
const enrichmentChangeSchemas = {
  themes: z.object({
    theme_name_ar: z.string().trim().min(1).max(120),
    theme_name_en: z.string().trim().max(120),
    primary_color: hexColorSchema,
    secondary_color: hexColorSchema,
    accent_color: hexColorSchema,
    background_color: hexColorSchema,
    text_color: hexColorSchema,
    quran_fact_title_ar: z.string().trim().min(1).max(160),
    quran_fact_body_ar: z.string().trim().min(1).max(700),
    quran_fact_reference_ar: z.string().trim().min(1).max(120),
    is_active: z.boolean(),
    sort_order: z.number().int().min(0).max(10000),
  }).partial().strict(),
  cities: z.object({
    name_ar: z.string().trim().min(1).max(100),
    name_en: z.string().trim().min(1).max(100),
    region_name: z.string().trim().max(120),
    is_active: z.boolean(),
    sort_order: z.number().int().min(0).max(10000),
  }).partial().strict(),
  timezones: z.object({
    timezone_name: z.string().trim().regex(/^[A-Za-z_+-]+\/[A-Za-z0-9_+/-]+$/).max(100),
    label_ar: z.string().trim().min(1).max(100),
    label_en: z.string().trim().min(1).max(100),
    is_primary: z.boolean(),
    is_active: z.boolean(),
    sort_order: z.number().int().min(0).max(10000),
  }).partial().strict(),
} as const

function safeChanges(resource: z.infer<typeof resourceSchema>, changes: Record<string, unknown>) {
  const allowed = fieldAllowList[resource]
  const filtered = Object.fromEntries(Object.entries(changes).filter(([key]) => allowed.has(key)))
  if (resource !== "themes" && resource !== "cities" && resource !== "timezones") return filtered
  const parsed = enrichmentChangeSchemas[resource].safeParse(filtered)
  return parsed.success ? parsed.data : {}
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
  const [
    { data: content },
    { data: packages },
    { data: faq },
    { data: links },
    { data: themes },
    { data: cities },
    { data: timezones },
  ] = await Promise.all([
    supabaseAdmin.from("area_content").select("id, area_id, content_key, content_ar, content_en, content_fr, content_type, section, href, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_packages").select("id, area_id, program, package_key, name_ar, name_en, name_fr, description_ar, description_en, description_fr, price, currency_code, billing_period, sessions_per_month, features_ar, features_en, features_fr, is_popular, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_faq_items").select("id, area_id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_links").select("id, area_id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_themes").select("id, area_id, theme_name_ar, theme_name_en, primary_color, secondary_color, accent_color, background_color, text_color, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_cities").select("id, area_id, city_key, name_ar, name_en, region_name, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_timezones").select("id, area_id, timezone_name, label_ar, label_en, is_primary, is_active, sort_order").in("area_id", areaIds).order("sort_order", { ascending: true }),
  ])

  return NextResponse.json({
    areas,
    content: content ?? [],
    packages: packages ?? [],
    faq: faq ?? [],
    links: links ?? [],
    themes: themes ?? [],
    cities: cities ?? [],
    timezones: timezones ?? [],
  }, { headers: { "Cache-Control": "no-store" } })
}

export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const parsed = patchSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid area update" }, { status: 400 })
  const changes = safeChanges(parsed.data.resource, parsed.data.changes)
  if (!Object.keys(changes).length) return NextResponse.json({ error: "No editable fields supplied" }, { status: 400 })

  const tableByResource = {
    content: "area_content",
    packages: "area_packages",
    faq: "area_faq_items",
    links: "area_links",
    themes: "area_themes",
    cities: "area_cities",
    timezones: "area_timezones",
  } as const
  const table = tableByResource[parsed.data.resource]
  const { data, error } = await supabaseAdmin.from(table).update({ ...changes, updated_at: new Date().toISOString() }).eq("id", parsed.data.id).select().single()
  if (error) return NextResponse.json({ error: "Failed to update area record" }, { status: 400 })
  const { data: area } = await supabaseAdmin.from("site_areas").select("slug").eq("id", data.area_id).maybeSingle()
  if (area?.slug) revalidatePath(`/${area.slug}`)
  return NextResponse.json({ data })
}

export async function DELETE(request: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  const parsed = deleteSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Only package records can be deleted" }, { status: 400 })

  const { data: packageBeforeDelete } = await supabaseAdmin
    .from("area_packages")
    .select("id, area_id")
    .eq("id", parsed.data.id)
    .maybeSingle()
  if (!packageBeforeDelete) return NextResponse.json({ error: "Package not found" }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from("area_packages")
    .delete()
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle()
  if (error) return NextResponse.json({ error: "Failed to delete package" }, { status: 400 })
  if (!data) return NextResponse.json({ error: "Package not found" }, { status: 404 })
  const { data: area } = await supabaseAdmin.from("site_areas").select("slug").eq("id", packageBeforeDelete.area_id).maybeSingle()
  if (area?.slug) revalidatePath(`/${area.slug}`)
  return NextResponse.json({ deleted: true, id: data.id }, { headers: { "Cache-Control": "no-store" } })
}
