'use client'

import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'
import { AlertCircle, Loader2, Save, X } from 'lucide-react'
import type { LegalPageSlug, LegalPage, Locale } from '@/lib/legal-service'

const PAGES: { slug: LegalPageSlug; label_ar: string; label_en: string }[] = [
  { slug: 'terms', label_ar: 'الشروط والأحكام', label_en: 'Terms' },
  { slug: 'privacy', label_ar: 'سياسة الخصوصية', label_en: 'Privacy' },
  { slug: 'refund-policy', label_ar: 'سياسة الاسترداد', label_en: 'Refund Policy' },
]

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
]

export function LegalSettingsTab() {
  const { t, locale } = useI18n()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [selectedPage, setSelectedPage] = useState<LegalPageSlug>('terms')
  const [selectedLocale, setSelectedLocale] = useState<Locale>('ar')
  const [pages, setPages] = useState<Record<string, LegalPage | null>>({})
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const loadPages = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/legal-pages?page=${selectedPage}`)

      if (!response.ok) {
        throw new Error('فشل في تحميل الصفحات')
      }

      const data = await response.json()

      // Create a map of locale -> page
      const pageMap: Record<string, LegalPage> = {}
      data.forEach((page: LegalPage) => {
        pageMap[page.locale] = page
      })

      setPages(pageMap)

      // Set content for current locale
      const currentPage = pageMap[selectedLocale]
      if (currentPage) {
        setEditTitle(currentPage.title)
        setEditContent(currentPage.content)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [selectedPage, selectedLocale])

  // Load pages when selection changes
  useEffect(() => {
    void loadPages()
  }, [loadPages])

  // Load content when locale changes
  useEffect(() => {
    const currentPage = pages[selectedLocale]
    if (currentPage) {
      setEditTitle(currentPage.title)
      setEditContent(currentPage.content)
    } else {
      setEditTitle('')
      setEditContent('')
    }
  }, [selectedLocale, pages])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const currentPage = pages[selectedLocale]

      if (!currentPage) {
        throw new Error('الصفحة غير موجودة')
      }

      const response = await fetch(`/api/admin/legal-pages/${currentPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })

      if (!response.ok) {
        throw new Error('فشل في حفظ الصفحة')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Reload pages
      await loadPages()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const pageLabel = PAGES.find(p => p.slug === selectedPage)
    ? locale === 'ar'
      ? PAGES.find(p => p.slug === selectedPage)?.label_ar
      : PAGES.find(p => p.slug === selectedPage)?.label_en
    : selectedPage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">إعدادات الصفحات القانونية</h2>
        <p className="text-sm text-muted-foreground mt-1">
          إدارة صفحات الشروط والخصوصية والاسترداد بجميع اللغات
        </p>
      </div>

      {/* Page Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PAGES.map(page => (
          <button
            key={page.slug}
            onClick={() => {
              setSelectedPage(page.slug)
              setSelectedLocale('ar') // Reset to Arabic when changing page
            }}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedPage === page.slug
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="font-bold">{locale === 'ar' ? page.label_ar : page.label_en}</div>
            <div className="text-xs text-muted-foreground mt-1">{page.slug}</div>
          </button>
        ))}
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2 border-b">
        {LOCALES.map(loc => (
          <button
            key={loc.code}
            onClick={() => setSelectedLocale(loc.code)}
            className={`px-4 py-2 font-medium border-b-2 transition-all ${
              selectedLocale === loc.code
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-destructive">خطأ</h3>
            <p className="text-sm text-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-start gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-green-700">تم الحفظ بنجاح</h3>
            <p className="text-sm text-foreground mt-1">تم تحديث الصفحة بنجاح</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">جاري التحميل...</span>
        </div>
      ) : (
        <>
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium mb-2">العنوان</label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="أدخل عنوان الصفحة"
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">المحتوى (Markdown)</label>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full h-96 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none"
              placeholder="أدخل محتوى الصفحة بصيغة Markdown"
            />
            <p className="text-xs text-muted-foreground mt-2">
              يمكنك استخدام صيغة Markdown: # للعناوين، **للغامق**، - للقوائم
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
              <p className="text-foreground">
                📝 <strong>نصيحة:</strong> تغييراتك ستظهر مباشرة على الموقع لجميع الزوار
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
