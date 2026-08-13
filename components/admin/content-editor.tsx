'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Zap, Save, Plus, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ContentField {
  key: string
  section: string
  type: 'short' | 'long'
  content_ar: string
  content_en: string
  content_fr: string
  is_active: boolean
}

interface ContentEditorProps {
  onSave: (content: ContentField) => Promise<void>
  initialData?: ContentField
  isLoading?: boolean
}

export function ContentEditor({ onSave, initialData, isLoading = false }: ContentEditorProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState<ContentField>(
    initialData || {
      key: '',
      section: 'homepage',
      type: 'short',
      content_ar: '',
      content_en: '',
      content_fr: '',
      is_active: true,
    }
  )

  // جمع جميع الحقول العربية من النموذج
  const collectArabicFields = useCallback(() => {
    return {
      key: formData.key,
      section: formData.section,
      type: formData.type,
      content_ar: formData.content_ar,
    }
  }, [formData])

  // الزر الرئيسي العام: ترجمة جميع الحقول العربية دفعة واحدة
  const handleGlobalTranslate = async () => {
    if (!formData.content_ar.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء الحقل العربي أولاً',
        variant: 'destructive',
      })
      return
    }

    setIsTranslating(true)
    try {
      // استدعاء API الترجمة بجميع النصوص العربية
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.content_ar,
          targetLanguages: ['en', 'fr'],
        }),
      })

      if (!response.ok) throw new Error('فشلت الترجمة')

      const translations = await response.json()

      // ملء جميع الحقول المترجمة تلقائياً
      setFormData((prev) => ({
        ...prev,
        content_en: translations.en || prev.content_en,
        content_fr: translations.fr || prev.content_fr,
      }))

      toast({
        title: 'نجاح',
        description: 'تم ترجمة جميع الحقول تلقائياً',
      })
    } catch (error) {
      console.error('[v0] Translation error:', error)
      toast({
        title: 'خطأ في الترجمة',
        description: error instanceof Error ? error.message : 'حدث خطأ ما',
        variant: 'destructive',
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.key.trim() || !formData.content_ar.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول الإلزامية',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      await onSave(formData)
      toast({
        title: 'نجاح',
        description: 'تم حفظ المحتوى بنجاح',
      })
      // إعادة تعيين النموذج بعد الحفظ الناجح
      if (!initialData) {
        setFormData({
          key: '',
          section: 'homepage',
          type: 'short',
          content_ar: '',
          content_en: '',
          content_fr: '',
          is_active: true,
        })
      }
    } catch (error) {
      console.error('[v0] Save error:', error)
      toast({
        title: 'خطأ في الحفظ',
        description: error instanceof Error ? error.message : 'حدث خطأ ما',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSave} className="space-y-6 bg-card p-6 rounded-lg border" dir="rtl">
      {/* ===== الزر الرئيسي العام للترجمة في الأعلى ===== */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <h3 className="text-lg font-semibold">محرر المحتوى</h3>
        <Button
          type="button"
          onClick={handleGlobalTranslate}
          disabled={isTranslating || !formData.content_ar.trim()}
          className="gap-2 bg-amber-600 hover:bg-amber-700"
        >
          {isTranslating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الترجمة...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              ترجمة تلقائية شاملة
            </>
          )}
        </Button>
      </div>

      {/* ===== حقول البيانات الأساسية ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">مفتاح المحتوى *</label>
          <Input
            placeholder="مثال: hero_title"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            disabled={!!initialData}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">القسم</label>
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="homepage">الصفحة الرئيسية</option>
            <option value="quran">القرآن</option>
            <option value="arabic">تأسيس العربي</option>
            <option value="about">عن الأكاديمية</option>
            <option value="teachers">المعلمين والمعلمات</option>
            <option value="pages">صفحات عامة</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">النوع</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="short"
              checked={formData.type === 'short'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'short' | 'long' })}
            />
            <span>نص قصير</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="long"
              checked={formData.type === 'long'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'short' | 'long' })}
            />
            <span>نص طويل</span>
          </label>
        </div>
      </div>

      {/* ===== حقول اللغات الثلاث ===== */}
      <div className="space-y-6 pt-4 border-t">
        <h4 className="font-semibold text-base">المحتوى بثلاث لغات</h4>

        {/* العربية */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">
              ع
            </span>
            العربية *
          </label>
          {formData.type === 'short' ? (
            <Input
              placeholder="ادخل النص بالعربية"
              value={formData.content_ar}
              onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
              className="text-right"
            />
          ) : (
            <Textarea
              placeholder="ادخل النص الطويل بالعربية"
              value={formData.content_ar}
              onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
              rows={5}
              className="text-right"
            />
          )}
          <p className="text-xs text-muted-foreground">
            {formData.content_ar.length} حرف - ادخل النص هنا، ثم اضغط "ترجمة تلقائية"
          </p>
        </div>

        {/* الإنجليزية */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              EN
            </span>
            English
          </label>
          {formData.type === 'short' ? (
            <Input
              placeholder="Auto-filled by translation"
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              disabled={isTranslating}
            />
          ) : (
            <Textarea
              placeholder="Auto-filled by translation"
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              rows={5}
              disabled={isTranslating}
            />
          )}
          <p className="text-xs text-muted-foreground">
            يتم ملأ هذا الحقل تلقائياً عند الضغط على زر الترجمة
          </p>
        </div>

        {/* الفرنسية */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
              FR
            </span>
            Français
          </label>
          {formData.type === 'short' ? (
            <Input
              placeholder="Auto-filled by translation"
              value={formData.content_fr}
              onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
              disabled={isTranslating}
            />
          ) : (
            <Textarea
              placeholder="Auto-filled by translation"
              value={formData.content_fr}
              onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
              rows={5}
              disabled={isTranslating}
            />
          )}
          <p className="text-xs text-muted-foreground">
            يتم ملأ هذا الحقل تلقائياً عند الضغط على زر الترجمة
          </p>
        </div>
      </div>

      {/* ===== حقل التفعيل ===== */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="h-4 w-4 rounded border-input"
        />
        <label htmlFor="is_active" className="text-sm font-medium">
          تفعيل هذا المحتوى
        </label>
      </div>

      {/* ===== أزرار الإجراء ===== */}
      <div className="flex gap-3 justify-end pt-6 border-t">
        <Button type="button" variant="outline">
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isSaving || isLoading}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ المحتوى
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
