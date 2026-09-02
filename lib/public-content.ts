import { supabaseAdmin } from "@/lib/supabaseAdmin"

export type PublicContent = {
  key: string
  content_ar: string | null
  content_en: string | null
  content_fr: string | null
}

/**
 * Reads active public content through the server-side Supabase client.
 * The fallback keeps the page renderable during local development or when
 * Supabase is temporarily unavailable.
 */
export async function getPublicContent(keys: string[]): Promise<Record<string, PublicContent>> {
  if (!supabaseAdmin || keys.length === 0) return {}

  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("key, content_ar, content_en, content_fr")
    .in("key", keys)
    .eq("is_active", true)

  if (error) {
    console.warn("[Public Content] Supabase read failed:", error.message)
    return {}
  }

  return Object.fromEntries((data ?? []).map((item) => [item.key, item as PublicContent]))
}

export function localizedContent(
  item: PublicContent | undefined,
  locale: string,
  fallback: string,
): string {
  if (!item) return fallback
  const value = locale === "en" ? item.content_en : locale === "fr" ? item.content_fr : item.content_ar
  return value?.trim() || fallback
}
