'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, Settings, Eye, Save, Trash2, Copy, Globe } from 'lucide-react'
import useSWR from 'swr'
import { useToast } from '@/hooks/use-toast'

interface PageData {
  id?: number
  slug: string
  title_ar: string
  title_en: string
  title_fr: string
  meta_description_ar: string
  meta_description_en: string
  meta_description_fr: string
  template_type: string
  is_published: boolean
  is_home_page: boolean
}

interface PageBuilderProps {
  onPageSaved?: (page: PageData) => void
}

const PAGE_TEMPLATES = [
  { id: 'hero_section', name: 'Hero Section', description: 'قسم بطل مع صورة خلفية' },
  { id: 'services_grid', name: 'Services Grid', description: 'شبكة الخدمات' },
  { id: 'about_full', name: 'About Page', description: 'صفحة معلومات كاملة' },
  { id: 'testimonials', name: 'Testimonials', description: 'شهادات العملاء' },
  { id: 'faq_section', name: 'FAQ Section', description: 'أسئلة شائعة' },
  { id: 'contact_form', name: 'Contact Form', description: 'نموذج تواصل' },
]

export function PageBuilder({ onPageSaved }: PageBuilderProps) {
  const { toast } = useToast()
  const [isCreatingPage, setIsCreatingPage] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const [formData, setFormData] = useState<PageData>({
    slug: '',
    title_ar: '',
    title_en: '',
    title_fr: '',
    meta_description_ar: '',
    meta_description_en: '',
    meta_description_fr: '',
    template_type: 'custom',
    is_published: false,
    is_home_page: false,
  })

  // Fetch existing pages
  const { data: pages, mutate: mutatePage } = useSWR<any>('/api/cms/pages', async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch pages')
    return res.json()
  })

  const pagesList = pages?.data || []

  // Handle form change
  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Save page
  const savePage = async () => {
    try {
      if (!formData.slug || !formData.title_ar) {
        toast({
          title: 'خطأ',
          description: 'يرجى ملء الحقول المطلوبة (slug والعنوان بالعربية)',
          variant: 'destructive',
        })
        return
      }

      setIsCreatingPage(true)
      console.log('[v0] Saving page:', formData)

      // Prepare the URL - for PATCH, append ID as query parameter
      let url = '/api/cms/pages'
      if (formData.id) {
        url = `/api/cms/pages?id=${formData.id}`
      }

      const response = await fetch(url, {
        method: formData.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          template_type: selectedTemplate || formData.template_type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('[v0] Save result:', result)

      if (result.success || result.data) {
        toast({
          title: 'تم بنجاح',
          description: `تم ${formData.id ? 'تحديث' : 'إنشاء'} الصفحة بنجاح وتحديث الموقع`,
          duration: 3000,
        })

        onPageSaved?.(result.data)
        mutatePage()
        resetForm()
      } else {
        throw new Error(result.error || 'Unexpected response')
      }
    } catch (error) {
      console.error('[v0] Save page error:', error)
      const errorMsg =
        error instanceof Error ? error.message : 'فشل حفظ الصفحة'
      toast({
        title: 'خطأ',
        description: errorMsg,
        variant: 'destructive',
        duration: 4000,
      })
    } finally {
      setIsCreatingPage(false)
    }
  }

  // Delete page
  const deletePage = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return

    try {
      const response = await fetch(`/api/cms/pages?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف الصفحة بنجاح',
        })
        mutatePage()
      }
    } catch (error) {
      console.error('[v0] Delete page error:', error)
      toast({
        title: 'خطأ',
        description: 'فشل حذف الصفحة',
        variant: 'destructive',
      })
    }
  }

  // Edit page
  const editPage = (page: any) => {
    setFormData({
      id: page.id,
      slug: page.slug,
      title_ar: page.title_ar,
      title_en: page.title_en,
      title_fr: page.title_fr,
      meta_description_ar: page.meta_description_ar,
      meta_description_en: page.meta_description_en,
      meta_description_fr: page.meta_description_fr,
      template_type: page.template_type,
      is_published: page.is_published,
      is_home_page: page.is_home_page,
    })
    setSelectedTemplate(page.template_type)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      slug: '',
      title_ar: '',
      title_en: '',
      title_fr: '',
      meta_description_ar: '',
      meta_description_en: '',
      meta_description_fr: '',
      template_type: 'custom',
      is_published: false,
      is_home_page: false,
    })
    setSelectedTemplate(null)
  }

  // Auto-translate using the translation API
  const autoTranslate = async () => {
    if (!formData.title_ar && !formData.meta_description_ar) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء العنوان أو الوصف بالعربية أولاً',
        variant: 'destructive',
      })
      return
    }

    try {
      const textToTranslate = formData.title_ar || formData.meta_description_ar
      console.log('[v0] Starting translation for:', textToTranslate)

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang: 'ar',
        }),
      })

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('[v0] Translation result:', result)

      if (result.success && result.data) {
        // Update form with translated text
        setFormData(prev => ({
          ...prev,
          title_en: formData.title_ar ? (result.data.en || '') : prev.title_en,
          title_fr: formData.title_ar ? (result.data.fr || '') : prev.title_fr,
          meta_description_en: formData.meta_description_ar
            ? (result.data.en || '')
            : prev.meta_description_en,
          meta_description_fr: formData.meta_description_ar
            ? (result.data.fr || '')
            : prev.meta_description_fr,
        }))

        toast({
          title: 'تم الترجمة بنجاح',
          description: 'تم ترجمة النصوص تلقائياً إلى الإنجليزية والفرنسية',
          duration: 3000,
        })
      } else {
        throw new Error(result.error || 'Translation failed')
      }
    } catch (error) {
      console.error('[v0] Auto-translate error:', error)
      const errorMsg =
        error instanceof Error ? error.message : 'فشل الترجمة التلقائية'
      toast({
        title: 'خطأ الترجمة',
        description: errorMsg,
        variant: 'destructive',
        duration: 4000,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      {!formData.slug && (
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2">
              <FileText className="h-5 w-5" />
              اختر نموذج الصفحة
            </CardTitle>
            <CardDescription>
              اختر نموذج للبدء - يمكنك تخصيصه بالكامل
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PAGE_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setFormData(prev => ({
                      ...prev,
                      template_type: template.id,
                    }))
                  }}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <p className="font-semibold">{template.name}</p>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2">
            <Settings className="h-5 w-5" />
            {formData.id ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Slug */}
          <div className="space-y-2">
            <Label>slug (URL)</Label>
            <Input
              value={formData.slug}
              onChange={e => handleFormChange('slug', e.target.value)}
              placeholder="اسم-الصفحة"
              dir="ltr"
            />
            <p className="text-xs text-gray-500">الرابط سيكون: /page/{formData.slug}</p>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>العنوان (عربي)</Label>
              <Input
                value={formData.title_ar}
                onChange={e => handleFormChange('title_ar', e.target.value)}
                placeholder="اسم الصفحة"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={formData.title_en}
                onChange={e => handleFormChange('title_en', e.target.value)}
                placeholder="Page Name"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>Titre (Français)</Label>
              <Input
                value={formData.title_fr}
                onChange={e => handleFormChange('title_fr', e.target.value)}
                placeholder="Nom de la page"
                dir="ltr"
              />
            </div>
          </div>

          {/* Auto-translate button */}
          <Button
            onClick={autoTranslate}
            variant="outline"
            className="w-full"
          >
            ترجمة العنوان تلقائياً
          </Button>

          {/* Meta Descriptions */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-4">وصف الصفحة (SEO)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">الوصف (عربي)</Label>
                <textarea
                  value={formData.meta_description_ar}
                  onChange={e => handleFormChange('meta_description_ar', e.target.value)}
                  placeholder="وصف قصير للصفحة"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Description (English)</Label>
                <textarea
                  value={formData.meta_description_en}
                  onChange={e => handleFormChange('meta_description_en', e.target.value)}
                  placeholder="Short description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Description (Français)</Label>
                <textarea
                  value={formData.meta_description_fr}
                  onChange={e => handleFormChange('meta_description_fr', e.target.value)}
                  placeholder="Courte description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Publishing options */}
          <div className="pt-4 border-t space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={e => handleFormChange('is_published', e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">نشر الصفحة</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_home_page}
                onChange={e => handleFormChange('is_home_page', e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">اجعل هذه الصفحة الرئيسية</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t flex gap-2">
            <Button
              onClick={savePage}
              disabled={isCreatingPage}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isCreatingPage ? 'جاري الحفظ...' : 'حفظ الصفحة'}
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      {pagesList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الصفحات الموجودة</CardTitle>
            <CardDescription>
              {pagesList.length} صفحة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pagesList.map((page: any) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{page.title_ar}</p>
                    <p className="text-sm text-gray-600">/{page.slug}</p>
                    <div className="flex gap-2 mt-1">
                      {page.is_published && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          منشور
                        </span>
                      )}
                      {page.is_home_page && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          الصفحة الرئيسية
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editPage(page)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePage(page.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
