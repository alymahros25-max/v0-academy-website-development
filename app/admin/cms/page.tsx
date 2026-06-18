'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight } from 'lucide-react'
import { ContentEditor } from '@/components/admin/content-editor'
import { ContentList } from '@/components/admin/content-list'
import useSWR, { mutate } from 'swr'
import { useToast } from '@/hooks/use-toast'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ContentField {
  id?: string
  key: string
  section: string
  type: 'short' | 'long'
  content_ar: string
  content_en: string
  content_fr: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export default function CMSPage() {
  const { toast } = useToast()
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [selectedContent, setSelectedContent] = useState<ContentField | undefined>()
  const [filterSection, setFilterSection] = useState<string>('all')

  // جلب المحتوى من الـ API
  const { data: contentList = [], isLoading, error } = useSWR('/api/cms/content', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  // تصفية المحتوى حسب القسم
  const filteredContent = filterSection === 'all' ? contentList : contentList.filter((item: ContentField) => item.section === filterSection)

  const handleSave = async (content: ContentField) => {
    try {
      const method = mode === 'create' ? 'POST' : 'PATCH'
      const response = await fetch('/api/cms/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      if (!response.ok) throw new Error('فشل الحفظ')

      // إعادة جلب البيانات
      await mutate('/api/cms/content')

      toast({
        title: 'نجاح',
        description: mode === 'create' ? 'تم إضافة المحتوى' : 'تم تحديث المحتوى',
      })

      // العودة إلى وضع الإنشاء
      setMode('create')
      setSelectedContent(undefined)
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async (key: string) => {
    const response = await fetch(`/api/cms/content?key=${key}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('فشل الحذف')
    await mutate('/api/cms/content')
  }

  const handleToggleActive = async (key: string, isActive: boolean) => {
    const response = await fetch('/api/cms/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, is_active: isActive }),
    })
    if (!response.ok) throw new Error('فشل التحديث')
    await mutate('/api/cms/content')
  }

  const handleEditContent = (content: ContentField) => {
    setSelectedContent(content)
    setMode('edit')
    // التمرير إلى أعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setMode('create')
    setSelectedContent(undefined)
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة المحتوى (CMS)</h1>
          <p className="text-muted-foreground mt-1">
            أضف وعدّل المحتوى بثلاث لغات مع ترجمة تلقائية ذكية
          </p>
        </div>
      </div>

      {/* قسم الإضافة والتعديل */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'إضافة محتوى جديد' : 'تعديل المحتوى'}
            </h2>
            {mode === 'edit' && selectedContent && (
              <p className="text-sm text-muted-foreground mt-1">
                تعديل: <span className="font-mono text-xs">{selectedContent.key}</span>
              </p>
            )}
          </div>
          {mode === 'edit' && (
            <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              إضافة جديد
            </Button>
          )}
        </div>

        {/* مكون المحرر */}
        <ContentEditor
          onSave={handleSave}
          initialData={selectedContent}
          isLoading={isLoading}
        />
      </div>

      {/* قسم الإدارة والعرض */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">المحتوى الموجود</h2>
          <div className="flex items-center gap-2">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">جميع الأقسام</option>
              <option value="homepage">الصفحة الرئيسية</option>
              <option value="quran">القرآن</option>
              <option value="arabic">تأسيس العربي</option>
              <option value="about">عن الأكاديمية</option>
              <option value="teachers">المعلمين</option>
              <option value="pages">صفحات عامة</option>
            </select>
          </div>
        </div>

        {/* قائمة المحتوى */}
        <ContentList
          items={filteredContent}
          isLoading={isLoading}
          onEdit={handleEditContent}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">إجمالي المحتوى</p>
          <p className="text-2xl font-bold mt-2">{contentList.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">المفعّل</p>
          <p className="text-2xl font-bold mt-2">
            {contentList.filter((c: ContentField) => c.is_active).length}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">المعطّل</p>
          <p className="text-2xl font-bold mt-2">
            {contentList.filter((c: ContentField) => !c.is_active).length}
          </p>
        </div>
      </div>
    </div>
  )
}
