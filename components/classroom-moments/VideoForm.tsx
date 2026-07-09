'use client'

import { useState, useCallback } from 'react'
import { Save, Trash2, RotateCcw, AlertCircle } from 'lucide-react'
import { useApiToast } from '@/hooks/use-api-toast'
import { extractYouTubeId, isValidYouTubeUrl } from '@/lib/youtube-utils'
import { useI18n } from '@/lib/i18n'

interface Video {
  id?: string
  title_ar: string
  title_en: string
  title_fr: string
  description_ar: string
  description_en: string
  description_fr: string
  youtube_url: string
  category: string
  teacher_name_ar: string
  teacher_name_en: string
  teacher_name_fr: string
}

interface VideoFormProps {
  initialData?: Video
  onSuccess?: () => void
  isEditing?: boolean
}

const CATEGORIES = ['تجويد', 'قرآن كريم', 'لغة عربية', 'ترويجي', 'عام']

export function VideoForm({ initialData, onSuccess, isEditing = false }: VideoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccess, showError } = useApiToast()
  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    if (type === 'success') showSuccess(msg)
    else showError(msg)
  }
  const { t } = useI18n()
  const [youtubeIdError, setYoutubeIdError] = useState<string>('')

  const [formData, setFormData] = useState<Video>(
    initialData || {
      title_ar: '',
      title_en: '',
      title_fr: '',
      description_ar: '',
      description_en: '',
      description_fr: '',
      youtube_url: '',
      category: 'عام',
      teacher_name_ar: '',
      teacher_name_en: '',
      teacher_name_fr: '',
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Validate YouTube URL in real time as the user types
    if (name === 'youtube_url') {
      if (value.trim() && !isValidYouTubeUrl(value)) {
        setYoutubeIdError('رابط يوتيوب غير صحيح')
      } else {
        setYoutubeIdError('')
      }
    }
  }

  const autoTranslate = async () => {
    if (!formData.title_ar) {
      showToast('الرجاء إدخال العنوان بالعربية أولاً', 'error')
      return
    }

    setIsLoading(true)
    try {
      // Translate all three text fields in parallel for speed
      const fields: Array<{ key: 'title' | 'description' | 'teacher_name'; text: string }> = [
        { key: 'title', text: formData.title_ar },
        { key: 'description', text: formData.description_ar },
        { key: 'teacher_name', text: formData.teacher_name_ar },
      ].filter(f => f.text.trim() !== '')

      const results = await Promise.all(
        fields.map(({ key, text }) =>
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          })
            .then(r => r.json())
            .then(data => ({ key, data }))
        )
      )

      const updates: Partial<typeof formData> = {}
      for (const { key, data } of results) {
        // translate API returns { success, data: { ar, en, fr } }
        const translations = data?.data ?? data?.translations
        if (!translations) continue
        if (key === 'title') {
          if (translations.en) updates.title_en = translations.en
          if (translations.fr) updates.title_fr = translations.fr
        } else if (key === 'description') {
          if (translations.en) updates.description_en = translations.en
          if (translations.fr) updates.description_fr = translations.fr
        } else if (key === 'teacher_name') {
          if (translations.en) updates.teacher_name_en = translations.en
          if (translations.fr) updates.teacher_name_fr = translations.fr
        }
      }

      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({ ...prev, ...updates }))
        showToast('تمت الترجمة التلقائية لجميع الحقول بنجاح', 'success')
      } else {
        showToast('لم يتم إرجاع أي ترجمات', 'error')
      }
    } catch (error) {
      showToast('فشل في الترجمة التلقائية', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (!formData.title_ar || !formData.title_en || !formData.title_fr) {
        showToast('يرجى إدخال العنوان بالعربية والإنجليزية والفرنسية', 'error')
        setIsLoading(false)
        return
      }

      if (!formData.youtube_url?.trim()) {
        showToast('يرجى إدخال رابط يوتيوب', 'error')
        setIsLoading(false)
        return
      }

      // Validate and extract YouTube ID
      const videoId = extractYouTubeId(formData.youtube_url)
      if (!videoId) {
        const msg = 'رابط يوتيوب غير صحيح. تأكد من استخدام رابط مثل: https://youtu.be/XXXXXXXXXXX'
        showToast(msg, 'error')
        setYoutubeIdError(msg)
        setIsLoading(false)
        return
      }

      // Clear error if validation passes
      setYoutubeIdError('')

      const endpoint = isEditing
        ? `/api/cms/classroom-videos?id=${formData.id}`
        : '/api/cms/classroom-videos'

      const method = isEditing ? 'PATCH' : 'POST'

      // Explicitly publish the video and include the pre-extracted embed ID.
      // Without is_published: true the API defaults to false, making the video
      // invisible on the public page.
      const payload = {
        ...formData,
        youtube_embed_id: videoId,
        is_published: true,
        is_featured: formData.id === undefined ? true : undefined, // first video defaults to featured
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        showToast(result.error || 'فشل في الحفظ', 'error')
        return
      }

      showToast(isEditing ? 'تم تحديث الحصة بنجاح' : 'تمت إضافة الحصة بنجاح', 'success')

      // Revalidate the public classroom-moments page so the new video
      // appears immediately without waiting for the 60-second ISR window.
      fetch('/api/revalidate?path=/classroom-moments').catch(() => {/* non-fatal */})

      // Reset form if creating new
      if (!isEditing) {
        setFormData({
          title_ar: '',
          title_en: '',
          title_fr: '',
          description_ar: '',
          description_en: '',
          description_fr: '',
          youtube_url: '',
          category: 'عام',
          teacher_name_ar: '',
          teacher_name_en: '',
          teacher_name_fr: '',
        })
      }

      onSuccess?.()
    } catch (error) {
      showToast('حدث خطأ: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData(
      initialData || {
        title_ar: '',
        title_en: '',
        title_fr: '',
        description_ar: '',
        description_en: '',
        description_fr: '',
        youtube_url: '',
        category: 'عام',
        teacher_name_ar: '',
        teacher_name_en: '',
        teacher_name_fr: '',
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold text-foreground">
        {isEditing ? 'تعديل الفيديو' : 'إضافة فيديو من الحصص'}
      </h2>

      {/* YouTube URL with validation */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          رابط يوتيوب *
        </label>
        {/* Use type="text" — mobile browsers reject youtu.be URLs with type="url" */}
        <input
          type="text"
          name="youtube_url"
          value={formData.youtube_url}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=YzChqKd6TT8"
          dir="ltr"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm ${
            youtubeIdError ? 'border-destructive' : 'border-border'
          }`}
          required
        />

        {/* Live ID preview — shows the extracted 11-char ID so the admin can verify */}
        {formData.youtube_url && !youtubeIdError && (() => {
          const previewId = extractYouTubeId(formData.youtube_url)
          return previewId ? (
            <p className="text-xs text-green-600 mt-1 font-mono">
              ID: {previewId}
            </p>
          ) : null
        })()}

        {youtubeIdError && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            {youtubeIdError}
          </div>
        )}

        {/* Helper text listing accepted formats */}
        <div className="mt-2 p-3 bg-muted rounded-lg text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground mb-1">الصيغ المقبولة:</p>
          <p dir="ltr" className="font-mono">https://www.youtube.com/watch?v=YzChqKd6TT8</p>
          <p dir="ltr" className="font-mono">https://youtu.be/YzChqKd6TT8</p>
          <p dir="ltr" className="font-mono">https://youtu.be/YzChqKd6TT8?si=XXXXXX</p>
          <p dir="ltr" className="font-mono">https://www.youtube.com/shorts/YzChqKd6TT8</p>
          <p dir="ltr" className="font-mono">https://www.youtube.com/embed/YzChqKd6TT8</p>
        </div>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('admin.titleAr')} *
          </label>
          <input
            type="text"
            name="title_ar"
            value={formData.title_ar}
            onChange={handleChange}
            placeholder="أدخل العنوان بالعربية"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('admin.titleEn')} *
          </label>
          <input
            type="text"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            placeholder="Enter title in English"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('admin.titleFr')} *
          </label>
          <input
            type="text"
            name="title_fr"
            value={formData.title_fr}
            onChange={handleChange}
            placeholder="Entrez le titre en français"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('admin.descriptionAr')}
          </label>
          <textarea
            name="description_ar"
            value={formData.description_ar}
            onChange={handleChange}
            placeholder="أدخل الوصف بالعربية"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('admin.descriptionEn')}
          </label>
          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleChange}
            placeholder="Enter description in English"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('admin.descriptionFr')}
          </label>
          <textarea
            name="description_fr"
            value={formData.description_fr}
            onChange={handleChange}
            placeholder="Entrez la description en français"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Auto Translate Button — translates title, description, and teacher name in one click */}
      <button
        type="button"
        onClick={autoTranslate}
        disabled={isLoading || !formData.title_ar}
        className="w-full px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {isLoading
          ? t('classroom.translating')
          : 'ترجمة تلقائية شاملة من العربية (العنوان + الوصف + اسم المعلم)'}
      </button>

      {/* Teacher Names */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            اسم المعلم بالعربية
          </label>
          <input
            type="text"
            name="teacher_name_ar"
            value={formData.teacher_name_ar}
            onChange={handleChange}
            placeholder="اسم المعلم"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Teacher Name (English)
          </label>
          <input
            type="text"
            name="teacher_name_en"
            value={formData.teacher_name_en}
            onChange={handleChange}
            placeholder="Teacher name"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nom de l&apos;enseignant (Français)
          </label>
          <input
            type="text"
            name="teacher_name_fr"
            value={formData.teacher_name_fr}
            onChange={handleChange}
            placeholder="Nom de l'enseignant"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          الفئة
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? t('admin.loading') : isEditing ? t('admin.edit') : t('admin.save')}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t('admin.cancel')}
        </button>
      </div>
    </form>
  )
}
