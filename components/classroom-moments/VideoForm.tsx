'use client'

import { useState, useCallback } from 'react'
import { Save, Trash2, RotateCcw, AlertCircle } from 'lucide-react'
import { useApiToast } from '@/hooks/use-api-toast'
import { extractYouTubeId, isValidYouTubeUrl } from '@/lib/youtube-utils'
import { useI18n } from '@/lib/i18n'

interface Video {
  id?: number
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
  const { showToast } = useApiToast()
  const { t } = useTranslation()
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

    // Validate YouTube URL when it changes
    if (name === 'youtube_url' && value.trim()) {
      if (!isValidYouTubeUrl(value)) {
        setYoutubeIdError(t('invalidYoutubeUrl'))
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
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.title_ar,
          targetLangs: ['en', 'fr'],
        }),
      })

      const data = await response.json()

      if (data.translations) {
        setFormData(prev => ({
          ...prev,
          title_en: data.translations.en || prev.title_en,
          title_fr: data.translations.fr || prev.title_fr,
          description_en: data.translations.en || prev.description_en,
          description_fr: data.translations.fr || prev.description_fr,
        }))
        showToast('تمت الترجمة بنجاح', 'success')
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
        showToast(t('enterValidUrl'), 'error')
        setIsLoading(false)
        return
      }

      if (!formData.youtube_url) {
        showToast(t('youtubeUrl'), 'error')
        setIsLoading(false)
        return
      }

      // Validate and extract YouTube ID
      const videoId = extractYouTubeId(formData.youtube_url)
      if (!videoId) {
        showToast(t('invalidYoutubeUrl'), 'error')
        setYoutubeIdError(t('invalidYoutubeUrl'))
        setIsLoading(false)
        return
      }

      // Clear error if validation passes
      setYoutubeIdError('')

      const endpoint = isEditing
        ? `/api/cms/classroom-videos?id=${formData.id}`
        : '/api/cms/classroom-videos'

      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        showToast(result.error || 'فشل في الحفظ', 'error')
        return
      }

      showToast(isEditing ? 'تم تحديث الحصة بنجاح' : 'تمت إضافة الحصة بنجاح', 'success')

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
        {isEditing ? t('edit') + ' ' + t('classroomMoments') : t('add') + ' ' + t('classroomMoments')}
      </h2>

      {/* YouTube URL with validation */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('youtubeUrl')} *
        </label>
        <input
          type="url"
          name="youtube_url"
          value={formData.youtube_url}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=xxxxx or youtu.be/xxxxx"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            youtubeIdError ? 'border-destructive' : 'border-border'
          }`}
          required
        />
        {youtubeIdError && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            {youtubeIdError}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {t('enterValidUrl')}
        </p>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان بالعربية *
          </label>
          <input
            type="text"
            name="title_ar"
            value={formData.title_ar}
            onChange={handleChange}
            placeholder="أدخل العنوان بالعربية"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان بالإنجليزية *
          </label>
          <input
            type="text"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            placeholder="Enter title in English"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان بالفرنسية *
          </label>
          <input
            type="text"
            name="title_fr"
            value={formData.title_fr}
            onChange={handleChange}
            placeholder="Entrez le titre en français"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف ب��لعربية
          </label>
          <textarea
            name="description_ar"
            value={formData.description_ar}
            onChange={handleChange}
            placeholder="أدخل الوصف بالعربية"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف بالإنجليزية
          </label>
          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleChange}
            placeholder="Enter description in English"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف بالفرنسية
          </label>
          <textarea
            name="description_fr"
            value={formData.description_fr}
            onChange={handleChange}
            placeholder="Entrez la description en français"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
          />
        </div>
      </div>

      {/* Auto Translate Button */}
      <button
        type="button"
        onClick={autoTranslate}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-[#d4af37] text-[#1a4d2e] font-medium rounded-lg hover:bg-[#c0a030] disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'جاري الترجمة...' : '🌐 ترجمة تلقائية من العربية'}
      </button>

      {/* Teacher Names */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المعلم بالعربية
          </label>
          <input
            type="text"
            name="teacher_name_ar"
            value={formData.teacher_name_ar}
            onChange={handleChange}
            placeholder="اسم المعلم"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teacher Name (English)
          </label>
          <input
            type="text"
            name="teacher_name_en"
            value={formData.teacher_name_en}
            onChange={handleChange}
            placeholder="Teacher name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l&apos;enseignant (Français)
          </label>
          <input
            type="text"
            name="teacher_name_fr"
            value={formData.teacher_name_fr}
            onChange={handleChange}
            placeholder="Nom de l'enseignant"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الفئة
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1a4d2e] text-white font-medium rounded-lg hover:bg-[#0f3620] disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'جاري الحفظ...' : isEditing ? 'تحديث' : 'حفظ'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة تعيين
        </button>
      </div>
    </form>
  )
}
