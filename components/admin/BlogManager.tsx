"use client"

import { useState } from "react"
import useSWR, { mutate as globalMutate } from "swr"
import { Plus, Edit3, Trash2, Eye, EyeOff, Check, X, ChevronDown, ChevronUp, Wand2, Loader2 } from "lucide-react"
import type { BlogPost } from "@/components/BlogSection"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const BLOG_API = "/api/blog?all=true"

// Lightweight client-side auto-translate helper (no external API needed)
function autoTranslate(arText: string, targetLang: "en" | "fr"): string {
  if (!arText?.trim()) return ""
  // Return the Arabic text as a placeholder — the admin can refine it.
  // This prevents empty fields without requiring paid translation APIs.
  return arText.trim()
}

interface FormData {
  title_ar: string; title_en: string; title_fr: string
  excerpt_ar: string; excerpt_en: string; excerpt_fr: string
  content_ar: string; content_en: string; content_fr: string
  cover_image: string
  category_ar: string; category_en: string; category_fr: string
  author_ar: string; author_en: string; author_fr: string
  read_time: number
  is_published: boolean
  slug: string
}

const emptyForm = (): FormData => ({
  title_ar: "", title_en: "", title_fr: "",
  excerpt_ar: "", excerpt_en: "", excerpt_fr: "",
  content_ar: "", content_en: "", content_fr: "",
  cover_image: "/images/hero-children.jpg",
  category_ar: "عام", category_en: "General", category_fr: "Général",
  author_ar: "فريق الأكاديمية", author_en: "Academy Team", author_fr: "Équipe de l'académie",
  read_time: 5,
  is_published: false,
  slug: "",
})

type Mode = "list" | "create" | "edit"
type Lang = "ar" | "en" | "fr"

export function BlogManager() {
  const { data: posts, isLoading, error } = useSWR<BlogPost[]>(BLOG_API, fetcher, {
    revalidateOnFocus: false,
  })

  const [mode, setMode] = useState<Mode>("list")
  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm())
  const [activeLang, setActiveLang] = useState<Lang>("ar")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const showMsg = (text: string, ok = true) => {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 3500)
  }

  const startCreate = () => {
    setForm(emptyForm())
    setEditPost(null)
    setActiveLang("ar")
    setMode("create")
  }

  const startEdit = (post: BlogPost) => {
    setForm({
      title_ar: post.title_ar || "", title_en: post.title_en || "", title_fr: post.title_fr || "",
      excerpt_ar: post.excerpt_ar || "", excerpt_en: post.excerpt_en || "", excerpt_fr: post.excerpt_fr || "",
      content_ar: post.content_ar || "", content_en: post.content_en || "", content_fr: post.content_fr || "",
      cover_image: post.cover_image || "/images/hero-children.jpg",
      category_ar: post.category_ar || "عام", category_en: post.category_en || "General", category_fr: post.category_fr || "Général",
      author_ar: post.author_ar || "فريق الأكاديمية", author_en: post.author_en || "Academy Team", author_fr: post.author_fr || "Équipe de l'académie",
      read_time: post.read_time || 5,
      is_published: post.is_published || false,
      slug: post.slug || "",
    })
    setEditPost(post)
    setActiveLang("ar")
    setMode("edit")
  }

  const handleAutoFill = () => {
    setForm(f => ({
      ...f,
      title_en: f.title_en || autoTranslate(f.title_ar, "en"),
      title_fr: f.title_fr || autoTranslate(f.title_ar, "fr"),
      excerpt_en: f.excerpt_en || autoTranslate(f.excerpt_ar, "en"),
      excerpt_fr: f.excerpt_fr || autoTranslate(f.excerpt_ar, "fr"),
      content_en: f.content_en || autoTranslate(f.content_ar, "en"),
      content_fr: f.content_fr || autoTranslate(f.content_ar, "fr"),
      category_en: f.category_en || autoTranslate(f.category_ar, "en"),
      category_fr: f.category_fr || autoTranslate(f.category_ar, "fr"),
    }))
    showMsg("تم ملء الحقول الفارغة تلقائياً — يمكنك تعديلها", true)
  }

  const handleSave = async () => {
    if (!form.title_ar.trim()) {
      showMsg("العنوان بالعربية مطلوب", false)
      return
    }
    setSaving(true)
    try {
      const isEdit = mode === "edit" && editPost
      const url = "/api/blog"
      const body = isEdit ? { id: editPost!.id, ...form } : form
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        showMsg(data.error || "خطأ في الحفظ", false)
        return
      }
      showMsg(isEdit ? "تم تحديث المقال بنجاح" : "تم نشر المقال بنجاح")
      globalMutate(BLOG_API)
      setMode("list")
    } catch {
      showMsg("خطأ في الاتصال بالخادم", false)
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, is_published: !post.is_published }),
      })
      if (res.ok) {
        showMsg(post.is_published ? "تم إخفاء المقال" : "تم نشر المقال")
        globalMutate(BLOG_API)
      }
    } catch {
      showMsg("خطأ في تغيير حالة النشر", false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع.")) return
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        showMsg("تم حذف المقال")
        globalMutate(BLOG_API)
      }
    } catch {
      showMsg("خطأ في الحذف", false)
    }
  }

  const set = (k: keyof FormData, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
  const labelCls = "text-xs text-muted-foreground mb-1 block font-medium"

  const langTabs: { id: Lang; label: string }[] = [
    { id: "ar", label: "العربية" },
    { id: "en", label: "English" },
    { id: "fr", label: "Français" },
  ]

  // FORM view
  if (mode === "create" || mode === "edit") {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">
            {mode === "create" ? "إضافة مقال جديد" : "تعديل المقال"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFill}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              ملء تلقائي
            </button>
            <button
              onClick={() => setMode("list")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
              إلغاء
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.ok ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-5">
          {/* Slug + Cover + Read Time + Status */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>الرابط المختصر (Slug)</label>
              <input className={inputCls} value={form.slug} onChange={e => set("slug", e.target.value)}
                placeholder="quran-memorization-tips" dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>وقت القراءة (دقيقة)</label>
              <input type="number" min={1} max={60} className={inputCls} value={form.read_time}
                onChange={e => set("read_time", parseInt(e.target.value) || 5)} />
            </div>
            <div>
              <label className={labelCls}>حالة النشر</label>
              <button
                onClick={() => set("is_published", !form.is_published)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${form.is_published ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "border-border bg-muted text-muted-foreground"}`}
              >
                {form.is_published ? <><Eye className="w-4 h-4" /> منشور</> : <><EyeOff className="w-4 h-4" /> مسودة</>}
              </button>
            </div>
          </div>

          <div>
            <label className={labelCls}>صورة الغلاف (URL)</label>
            <input className={inputCls} value={form.cover_image} onChange={e => set("cover_image", e.target.value)}
              placeholder="/images/hero-children.jpg" dir="ltr" />
          </div>

          {/* Language tabs */}
          <div>
            <div className="flex items-center gap-1 mb-4 border-b border-border pb-1">
              {langTabs.map(l => (
                <button key={l.id}
                  onClick={() => setActiveLang(l.id)}
                  className={`px-4 py-1.5 rounded-t-lg text-sm font-medium transition-colors ${activeLang === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {langTabs.map(l => activeLang === l.id && (
              <div key={l.id} className="flex flex-col gap-4" dir={l.id === "ar" ? "rtl" : "ltr"}>
                {/* Title */}
                <div>
                  <label className={labelCls}>العنوان</label>
                  <input className={inputCls}
                    value={form[`title_${l.id}` as keyof FormData] as string}
                    onChange={e => set(`title_${l.id}` as keyof FormData, e.target.value)}
                    placeholder={l.id === "ar" ? "عنوان المقال بالعربية" : l.id === "en" ? "Article title in English" : "Titre de l'article en français"} />
                </div>

                {/* Category + Author */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>الفئة</label>
                    <input className={inputCls}
                      value={form[`category_${l.id}` as keyof FormData] as string}
                      onChange={e => set(`category_${l.id}` as keyof FormData, e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>الكاتب</label>
                    <input className={inputCls}
                      value={form[`author_${l.id}` as keyof FormData] as string}
                      onChange={e => set(`author_${l.id}` as keyof FormData, e.target.value)} />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className={labelCls}>المقتطف</label>
                  <textarea rows={3} className={inputCls}
                    value={form[`excerpt_${l.id}` as keyof FormData] as string}
                    onChange={e => set(`excerpt_${l.id}` as keyof FormData, e.target.value)}
                    placeholder={l.id === "ar" ? "وصف مختصر للمقال يظهر في القائمة..." : "Short description shown in listing..."} />
                </div>

                {/* Content */}
                <div>
                  <label className={labelCls}>المحتوى الكامل (HTML مسموح)</label>
                  <textarea rows={10} className={`${inputCls} font-mono text-xs`}
                    value={form[`content_${l.id}` as keyof FormData] as string}
                    onChange={e => set(`content_${l.id}` as keyof FormData, e.target.value)}
                    placeholder="<h2>العنوان الفرعي</h2><p>محتوى المقال...</p>" />
                </div>
              </div>
            ))}
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {saving ? "جاري الحفظ..." : mode === "create" ? "نشر المقال" : "حفظ التعديلات"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // LIST view
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">إدارة المدونة</h2>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          مقال جديد
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.ok ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
          {message.text}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm dark:bg-red-950 dark:text-red-300">
          خطأ في تحميل المقالات
        </div>
      )}

      {!isLoading && !error && (!posts || posts.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-4">لا توجد مقالات بعد</p>
          <button onClick={startCreate} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
            أضف أول مقال
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {Array.isArray(posts) && posts.map(post => {
          const isExpanded = expandedId === post.id
          return (
            <div key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-4 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status dot */}
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${post.is_published ? "bg-green-500" : "bg-amber-400"}`} />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{post.title_ar}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.category_ar} &middot; {post.read_time} دقيقة &middot; {post.is_published ? "منشور" : "مسودة"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    title={post.is_published ? "إخفاء" : "نشر"}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(post)}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-border px-4 py-3 bg-muted/30 grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Slug:</span> {post.slug}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">EN:</span> {post.title_en || "—"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">FR:</span> {post.title_fr || "—"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">نُشر:</span>{" "}
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("ar-SA") : "—"}
                  </div>
                  {post.excerpt_ar && (
                    <div className="sm:col-span-2">
                      <span className="font-medium text-foreground">المقتطف:</span> {post.excerpt_ar.slice(0, 120)}...
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
