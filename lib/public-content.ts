export type PublicContent = {
  key: string
  content_ar: string | null
  content_en: string | null
  content_fr: string | null
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
