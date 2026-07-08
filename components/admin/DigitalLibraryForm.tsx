"use client"

import { useState } from "react"
import { Plus, Loader } from "lucide-react"
import { toast } from "@/lib/toast"

type ContentType = "book" | "quran_audio" | "nasheed" | "tajweed"

interface FormData {
  titleAr: string
  titleEn: string
  titleFr: string
  descriptionAr: string
  descriptionEn: string
  descriptionFr: string
  authorAr: string
  authorEn: string
  authorFr: string
  contentType: ContentType
  category: string
  pdfUrl: string
  audioUrl: string
  thumbnailUrl: string
  isPublished: boolean
  isFree: boolean
}

const initialFormData: FormData = {
  titleAr: "",
  titleEn: "",
  titleFr: "",
  descriptionAr: "",
  descriptionEn: "",
  descriptionFr: "",
  authorAr: "",
  authorEn: "",
  authorFr: "",
  contentType: "book",
  category: "general",
  pdfUrl: "",
  audioUrl: "",
  thumbnailUrl: "",
  isPublished: true, // default to published so items appear on the site immediately
  isFree: true,
}

interface DigitalLibraryFormProps {
  onSuccess?: () => void
}

export default function DigitalLibraryForm({ onSuccess }: DigitalLibraryFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const contentTypes: Record<ContentType, string> = {
    book: "كتاب",
    quran_audio: "تلاوة قرآنية",
    nasheed: "نشيد",
    tajweed: "متون التجويد",
  }

  const categories: Record<string, string> = {
    general: "عام",
    quran: "قرآن الكريم",
    arabic: "اللغة العربية",
    islamic: "إسلاميات",
    children: "الأطفال",
    tajweed: "التجويد",
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.titleAr.trim()) newErrors.titleAr = "العنوان بالعربية مطلوب"
    if (!formData.titleEn.trim()) newErrors.titleEn = "العنوان بالإنجليزية مطلوب"
    if (!formData.titleFr.trim()) newErrors.titleFr = "العنوان بالفرنسية مطلوب"
    if (!formData.authorAr.trim()) newErrors.authorAr = "المؤلف مطلوب"

    if (formData.contentType === "book" && !formData.pdfUrl.trim()) {
      newErrors.pdfUrl = "رابط PDF مطلوب للكتب"
    }

    if (
      (formData.contentType === "quran_audio" || formData.contentType === "nasheed") &&
      !formData.audioUrl.trim()
    ) {
      newErrors.audioUrl = "رابط الصوت مطلوب"
    }

    // Validate URLs to prevent XSS
    const urlFields: Array<keyof FormData> = ["pdfUrl", "audioUrl", "thumbnailUrl"]
    for (const field of urlFields) {
      const val = formData[field] as string
      if (val.trim() && !val.startsWith("http://") && !val.startsWith("https://")) {
        newErrors[field] = "الرابط يجب أن يبدأ بـ http:// أو https://"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Auto-translate Arabic fields (title, description, author) to English and French
   * simultaneously using the /api/translate endpoint.
   */
  const autoTranslate = async () => {
    if (!formData.titleAr.trim()) {
      toast.error("الرجاء إدخال العنوان بالعربية أولاً")
      return
    }

    setIsTranslating(true)
    try {
      const fields: Array<{ key: "title" | "description" | "author"; text: string }> = [
        { key: "title", text: formData.titleAr },
        { key: "description", text: formData.descriptionAr },
        { key: "author", text: formData.authorAr },
      ].filter(f => f.text.trim() !== "")

      const results = await Promise.all(
        fields.map(({ key, text }) =>
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          })
            .then(r => r.json())
            .then(data => ({ key, data }))
        )
      )

      const updates: Partial<FormData> = {}
      for (const { key, data } of results) {
        const translations = data?.data ?? data?.translations
        if (!translations) continue
        if (key === "title") {
          if (translations.en) updates.titleEn = translations.en
          if (translations.fr) updates.titleFr = translations.fr
        } else if (key === "description") {
          if (translations.en) updates.descriptionEn = translations.en
          if (translations.fr) updates.descriptionFr = translations.fr
        } else if (key === "author") {
          if (translations.en) updates.authorEn = translations.en
          if (translations.fr) updates.authorFr = translations.fr
        }
      }

      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({ ...prev, ...updates }))
        toast.success("تمت الترجمة التلقائية لجميع الحقول بنجاح")
      } else {
        toast.error("لم يتم إرجاع أي ترجمات")
      }
    } catch {
      toast.error("فشل في الترجمة التلقائية")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/cms/digital-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title_ar: formData.titleAr,
          title_en: formData.titleEn,
          title_fr: formData.titleFr,
          description_ar: formData.descriptionAr,
          description_en: formData.descriptionEn,
          description_fr: formData.descriptionFr,
          author_ar: formData.authorAr,
          author_en: formData.authorEn,
          author_fr: formData.authorFr,
          content_type: formData.contentType,
          category: formData.category,
          pdf_url: formData.pdfUrl || null,
          audio_url: formData.audioUrl || null,
          thumbnail_url: formData.thumbnailUrl || null,
          is_published: formData.isPublished,
          is_free: formData.isFree,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error || "فشل حفظ المحتوى")
      }

      // Trigger ISR revalidation so the public /library page updates immediately
      fetch("/api/revalidate?path=/library").catch(() => {/* non-fatal */})

      toast.success("تم إضافة المحتوى بنجاح وسيظهر على الموقع فوراً")
      setFormData(initialFormData)
      setErrors({})
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء حفظ المحتوى")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition ${
      errors[field] ? "border-destructive" : "border-border"
    }`

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">إضافة محتوى جديد للمكتبة</h3>
      </div>

      {/* Type & Category */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">نوع المحتوى</label>
          <select
            value={formData.contentType}
            onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            {Object.entries(contentTypes).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">الفئة</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Arabic fields */}
      <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide">الحقول العربية (مطلوبة)</p>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">العنوان (عربي) *</label>
          <input
            type="text"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            className={inputClass("titleAr")}
            placeholder="مثال: القرآن الكريم"
          />
          {errors.titleAr && <p className="text-xs text-destructive mt-1">{errors.titleAr}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">الوصف (عربي)</label>
          <textarea
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground h-20 resize-none focus:ring-2 focus:ring-primary"
            placeholder="وصف مختصر للمحتوى..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">المؤلف (عربي) *</label>
          <input
            type="text"
            value={formData.authorAr}
            onChange={(e) => setFormData({ ...formData, authorAr: e.target.value })}
            className={inputClass("authorAr")}
            placeholder="اسم المؤلف"
          />
          {errors.authorAr && <p className="text-xs text-destructive mt-1">{errors.authorAr}</p>}
        </div>
      </div>

      {/* Auto-translate button */}
      <button
        type="button"
        onClick={autoTranslate}
        disabled={isTranslating || isLoading || !formData.titleAr.trim()}
        className="w-full py-2.5 px-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 transition font-semibold flex items-center justify-center gap-2"
      >
        {isTranslating ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            جاري الترجمة التلقائية...
          </>
        ) : (
          "ترجمة تلقائية شاملة من العربية (العنوان + الوصف + المؤلف)"
        )}
      </button>

      {/* English fields */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">الحقول الإنجليزية *</p>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">العنوان (English) *</label>
          <input
            type="text"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            className={inputClass("titleEn")}
            placeholder="Holy Quran"
          />
          {errors.titleEn && <p className="text-xs text-destructive mt-1">{errors.titleEn}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">الوصف (English)</label>
          <textarea
            value={formData.descriptionEn}
            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground h-20 resize-none focus:ring-2 focus:ring-primary"
            placeholder="Content description in English..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">المؤلف (English)</label>
          <input
            type="text"
            value={formData.authorEn}
            onChange={(e) => setFormData({ ...formData, authorEn: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
            placeholder="Author name"
          />
        </div>
      </div>

      {/* French fields */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">الحقول الفرنسية *</p>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Titre (Français) *</label>
          <input
            type="text"
            value={formData.titleFr}
            onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
            className={inputClass("titleFr")}
            placeholder="Saint Coran"
          />
          {errors.titleFr && <p className="text-xs text-destructive mt-1">{errors.titleFr}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Description (Français)</label>
          <textarea
            value={formData.descriptionFr}
            onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground h-20 resize-none focus:ring-2 focus:ring-primary"
            placeholder="Description du contenu en français..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">{"Nom de l'auteur (Français)"}</label>
          <input
            type="text"
            value={formData.authorFr}
            onChange={(e) => setFormData({ ...formData, authorFr: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
            placeholder={"Nom de l'auteur"}
          />
        </div>
      </div>

      {/* URLs */}
      {formData.contentType === "book" && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">رابط PDF *</label>
          <input
            type="url"
            value={formData.pdfUrl}
            onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
            className={inputClass("pdfUrl")}
            placeholder="https://example.com/book.pdf"
            dir="ltr"
          />
          {errors.pdfUrl && <p className="text-xs text-destructive mt-1">{errors.pdfUrl}</p>}
        </div>
      )}

      {(formData.contentType === "quran_audio" || formData.contentType === "nasheed") && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">رابط الصوت *</label>
          <input
            type="url"
            value={formData.audioUrl}
            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
            className={inputClass("audioUrl")}
            placeholder="https://example.com/audio.mp3"
            dir="ltr"
          />
          {errors.audioUrl && <p className="text-xs text-destructive mt-1">{errors.audioUrl}</p>}
        </div>
      )}

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">رابط الصورة المصغرة (اختياري)</label>
        <input
          type="url"
          value={formData.thumbnailUrl}
          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
          placeholder="https://example.com/image.jpg"
          dir="ltr"
        />
        {errors.thumbnailUrl && <p className="text-xs text-destructive mt-1">{errors.thumbnailUrl}</p>}
      </div>

      {/* Status */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground">نشر على الموقع فوراً</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFree}
            onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground">مجاني</span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition font-semibold flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            جاري الحفظ والنشر...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            حفظ ونشر المحتوى
          </>
        )}
      </button>
    </form>
  )
}
