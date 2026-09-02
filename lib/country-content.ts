import { supabaseAdmin } from "@/lib/supabaseAdmin"

export type AreaPackage = {
  id: number
  program: "quran" | "arabic" | "other"
  package_key: string
  name_ar: string
  name_en: string | null
  name_fr: string | null
  description_ar: string | null
  description_en: string | null
  description_fr: string | null
  price: number | string
  currency_code: string
  sessions_per_month: number | null
  features_ar: unknown
  features_en: unknown
  features_fr: unknown
  is_popular: boolean
  sort_order: number
}

export type AreaDisplayPlan = {
  id: string
  program: "quran" | "arabic"
  duration: number
  monthlySessions: number
  weeklySessions: number
  price: number
  name: string
  description: string
  features: string[]
  popular: boolean
}

export type AreaLink = {
  id: number
  link_key: string
  label_ar: string | null
  label_en: string | null
  label_fr: string | null
  href: string
  link_type: string
  is_external: boolean
  sort_order: number
}

export type SiteArea = {
  id: number
  slug: string
  area_type: "global" | "country"
  country_code: string | null
  name_ar: string
  name_en: string | null
  name_fr: string | null
  currency_code: string | null
  currency_symbol: string | null
}

export async function getSiteArea(slug: string): Promise<SiteArea | null> {
  if (!supabaseAdmin || !slug) return null
  const { data, error } = await supabaseAdmin
    .from("site_areas")
    .select("id, slug, area_type, country_code, name_ar, name_en, name_fr, currency_code, currency_symbol")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()
  if (error) {
    console.warn("[Country Content] area read failed:", error.message)
    return null
  }
  return data as SiteArea | null
}

export async function getAreaPackages(slug: string) {
  const area = await getSiteArea(slug)
  if (!area || !supabaseAdmin) return { area, packages: [] }
  const { data, error } = await supabaseAdmin
    .from("area_packages")
    .select("id, program, package_key, name_ar, name_en, name_fr, description_ar, description_en, description_fr, price, currency_code, billing_period, sessions_per_month, features_ar, features_en, features_fr, is_popular, sort_order")
    .eq("area_id", area.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (error) console.warn("[Country Content] packages read failed:", error.message)
  return { area, packages: data ?? [] }
}

export async function getAreaFaq(slug: string) {
  const area = await getSiteArea(slug)
  if (!area || !supabaseAdmin) return { area, faq: [] }
  const { data, error } = await supabaseAdmin
    .from("area_faq_items")
    .select("id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, sort_order")
    .eq("area_id", area.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (error) console.warn("[Country Content] FAQ read failed:", error.message)
  return { area, faq: data ?? [] }
}

export async function getAreaContent(slug: string, section?: string) {
  const area = await getSiteArea(slug)
  if (!area || !supabaseAdmin) return { area, content: [] }
  let query = supabaseAdmin
    .from("area_content")
    .select("id, content_key, content_ar, content_en, content_fr, content_type, section, href, sort_order")
    .eq("area_id", area.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (section) query = query.eq("section", section)
  const { data, error } = await query
  if (error) console.warn("[Country Content] content read failed:", error.message)
  return { area, content: data ?? [] }
}

export async function getAreaLandingData(slug: string) {
  const area = await getSiteArea(slug)
  if (!area || !supabaseAdmin) return { area, packages: [], faq: [], content: [], links: [] }
  const [{ data: packages, error: packagesError }, { data: faq, error: faqError }, { data: content, error: contentError }, { data: links, error: linksError }] = await Promise.all([
    supabaseAdmin.from("area_packages").select("id, program, package_key, name_ar, name_en, name_fr, description_ar, description_en, description_fr, price, currency_code, billing_period, sessions_per_month, features_ar, features_en, features_fr, is_popular, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_faq_items").select("id, question_key, question_ar, question_en, question_fr, answer_ar, answer_en, answer_fr, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_content").select("id, content_key, content_ar, content_en, content_fr, content_type, section, href, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
    supabaseAdmin.from("area_links").select("id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, sort_order").eq("area_id", area.id).eq("is_active", true).order("sort_order", { ascending: true }),
  ])
  if (packagesError) console.warn("[Country Content] landing packages read failed:", packagesError.message)
  if (faqError) console.warn("[Country Content] landing FAQ read failed:", faqError.message)
  if (contentError) console.warn("[Country Content] landing content read failed:", contentError.message)
  if (linksError) console.warn("[Country Content] landing links read failed:", linksError.message)
  return { area, packages: packages ?? [], faq: faq ?? [], content: content ?? [], links: links ?? [] }
}

export function areaLocalized(value: { content_ar?: string | null; content_en?: string | null; content_fr?: string | null } | undefined, locale = "ar") {
  if (!value) return ""
  return (locale === "en" ? value.content_en : locale === "fr" ? value.content_fr : value.content_ar)?.trim() || ""
}

export function packageFeatures(pkg: { features_ar?: unknown; features_en?: unknown; features_fr?: unknown }, locale = "ar"): string[] {
  const key = locale === "en" ? "features_en" : locale === "fr" ? "features_fr" : "features_ar"
  const value = pkg[key as keyof typeof pkg]
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

export function packageDuration(packageKey: string): number {
  const match = packageKey.match(/-(30|40|60)-/)
  return match ? Number(match[1]) : 30
}

export function packageWeeklySessions(sessionsPerMonth: number | null | undefined): number {
  return Math.max(1, Math.round((sessionsPerMonth ?? 4) / 4))
}

export function getAreaLinkHref(links: Array<Partial<AreaLink>> | undefined, linkKey: string, fallback: string): string {
  const match = links?.find((link) => link.link_key === linkKey && typeof link.href === "string" && link.href.trim())
  return match?.href?.trim() || fallback
}

export function getAreaWhatsAppUrl(links: Array<Partial<AreaLink>> | undefined, planName: string, fallback: string): string {
  const configured = getAreaLinkHref(links, "whatsapp", fallback)
  const base = configured.replace(/[?&]text=[^&]*/g, "")
  const separator = base.includes("?") ? "&" : "?"
  return `${base}${separator}text=${encodeURIComponent(`السلام عليكم، أرغب في حجز باقة ${planName}.`)}`
}

export function toAreaDisplayPlan(pkg: AreaPackage): AreaDisplayPlan {
  return {
    id: String(pkg.id),
    program: pkg.program === "arabic" ? "arabic" : "quran",
    duration: packageDuration(pkg.package_key),
    monthlySessions: pkg.sessions_per_month ?? 4,
    weeklySessions: packageWeeklySessions(pkg.sessions_per_month),
    price: Number(pkg.price),
    name: areaLocalized({ content_ar: pkg.name_ar, content_en: pkg.name_en, content_fr: pkg.name_fr }) || pkg.name_ar,
    description: areaLocalized({ content_ar: pkg.description_ar, content_en: pkg.description_en, content_fr: pkg.description_fr }) || "",
    features: packageFeatures(pkg),
    popular: Boolean(pkg.is_popular),
  }
}

export async function getAreaLinks(slug: string) {
  const area = await getSiteArea(slug)
  if (!area || !supabaseAdmin) return { area, links: [] }
  const { data, error } = await supabaseAdmin
    .from("area_links")
    .select("id, link_key, label_ar, label_en, label_fr, href, link_type, is_external, sort_order")
    .eq("area_id", area.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (error) console.warn("[Country Content] links read failed:", error.message)
  return { area, links: data ?? [] }
}
