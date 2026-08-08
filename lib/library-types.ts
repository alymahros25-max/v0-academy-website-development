export type LibraryLocale = "ar" | "en" | "fr"

export type LibraryDocument = {
  id: string
  slug: string
  title_ar: string
  title_en: string | null
  title_fr: string | null
  description_ar: string | null
  description_en: string | null
  description_fr: string | null
  surahs_ar: string | null
  author_ar: string | null
  author_en: string | null
  author_fr: string | null
  category: string
  tags: string[]
  drive_url: string
  file_type: string
  cover_url: string | null
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export function drivePreviewUrl(url: string, fileType: string) {
  const match = url.match(/[-\w]{25,}/)
  const id = match?.[0]
  if (!id) return url
  if (fileType === "pdf" || fileType === "image") return `https://drive.google.com/file/d/${id}/preview`
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`
}

export function localizedValue(item: LibraryDocument, field: "title" | "description" | "author", locale: LibraryLocale) {
  return item[`${field}_${locale}`] || item[`${field}_ar`] || ""
}
