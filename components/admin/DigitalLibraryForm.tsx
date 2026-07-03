"use client"

import { useState } from "react"
import { Plus, X, Loader } from "lucide-react"
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
  contentType: "book",
  category: "general",
  pdfUrl: "",
  audioUrl: "",
  thumbnailUrl: "",
  isPublished: false,
  isFree: true,
}

export default function DigitalLibraryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const contentTypes = {
    book: "كتاب",
    quran_audio: "تلاوة قرآنية",
    nasheed: "نشيد",
    tajweed: "متون التجويد",
  }

  const categories = {
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
        throw new Error("فشل حفظ المحتوى")
      }

      toast.success("تم إضافة المحتوى بنجاح")
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      console.error("Error:", error)
      toast.error("حدث خطأ أثناء حفظ المحتوى")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-bold text-foreground">إضافة محتوى جديد</h3>

      {/* Basic Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">العنوان (عربي)</label>
          <input
            type="text"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground ${
              errors.titleAr ? "border-red-500" : "border-border"
            }`}
            placeholder="القرآن الكريم"
          />
          {errors.titleAr && <p className="text-xs text-red-500 mt-1">{errors.titleAr}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">العنوان (إنجليزي)</label>
          <input
            type="text"
            value={formData.titleEn}
            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground ${
              errors.titleEn ? "border-red-500" : "border-border"
            }`}
            placeholder="Holy Quran"
          />
          {errors.titleEn && <p className="text-xs text-red-500 mt-1">{errors.titleEn}</p>}
        </div>
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
              <option key={key} value={key}>
                {label}
              </option>
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
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">الوصف (عربي)</label>
        <textarea
          value={formData.descriptionAr}
          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground h-24 resize-none"
          placeholder="وصف المحتوى..."
        />
      </div>

      {/* URLs */}
      {formData.contentType === "book" && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">رابط PDF</label>
          <input
            type="url"
            value={formData.pdfUrl}
            onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground ${
              errors.pdfUrl ? "border-red-500" : "border-border"
            }`}
            placeholder="https://example.com/book.pdf"
          />
          {errors.pdfUrl && <p className="text-xs text-red-500 mt-1">{errors.pdfUrl}</p>}
        </div>
      )}

      {(formData.contentType === "quran_audio" || formData.contentType === "nasheed") && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">رابط الصوت</label>
          <input
            type="url"
            value={formData.audioUrl}
            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground ${
              errors.audioUrl ? "border-red-500" : "border-border"
            }`}
            placeholder="https://example.com/audio.mp3"
          />
          {errors.audioUrl && <p className="text-xs text-red-500 mt-1">{errors.audioUrl}</p>}
        </div>
      )}

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">رابط الصورة (اختياري)</label>
        <input
          type="url"
          value={formData.thumbnailUrl}
          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">المؤلف</label>
        <input
          type="text"
          value={formData.authorAr}
          onChange={(e) => setFormData({ ...formData, authorAr: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground ${
            errors.authorAr ? "border-red-500" : "border-border"
          }`}
          placeholder="اسم المؤلف"
        />
        {errors.authorAr && <p className="text-xs text-red-500 mt-1">{errors.authorAr}</p>}
      </div>

      {/* Status */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm text-foreground">نشر الآن</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFree}
            onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm text-foreground">مجاني</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition font-semibold flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            إضافة المحتوى
          </>
        )}
      </button>
    </form>
  )
}
