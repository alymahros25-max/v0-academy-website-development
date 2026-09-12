import { unstable_cache } from "next/cache"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import type { PublicContent } from "@/lib/public-content"

const getCachedPublicContent = unstable_cache(
  async (keys: string[]): Promise<Record<string, PublicContent>> => {
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
  },
  ["public-site-content"],
  { revalidate: 3600, tags: ["site-content"] },
)

export async function getPublicContent(keys: string[]): Promise<Record<string, PublicContent>> {
  return getCachedPublicContent(keys)
}
