'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, AlertCircle, Loader } from 'lucide-react'

interface LibraryItem {
  id?: string
  title?: string
  content_type?: string
  category?: string
  thumbnail_url?: string
  description?: string
  is_published?: boolean
}

export default function SafeDigitalLibraryTab() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/cms/digital-library', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      
      // Safe data validation
      if (Array.isArray(data)) {
        setItems(data || [])
      } else if (data?.items && Array.isArray(data.items)) {
        setItems(data.items)
      } else {
        setItems([])
      }
    } catch (err: any) {
      console.error('[SafeLibraryTab] Error:', err)
      setError(err.message || 'فشل في تحميل البيانات')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      setError('معرف العنصر غير صحيح')
      return
    }

    if (!confirm('هل تريد حذف هذا المحتوى؟')) return

    try {
      const response = await fetch(`/api/cms/digital-library?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
      } else {
        throw new Error('فشل الحذف')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">المكتبة الرقمية</h2>
          <p className="text-sm text-muted-foreground">
            إدارة الكتب والتلاوات والأناشيد والمتون التعليمية
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'إغلاق' : 'إضافة محتوى'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">خطأ</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-900 text-sm mt-2 underline"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-center text-muted-foreground py-8">
            نموذج إضافة المحتوى (متوفر قريباً)
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader className="w-5 h-5 animate-spin" />
            <p>جاري تحميل المحتوى...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && !error && (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-4">لم يتم إضافة أي محتوى حتى الآن</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            أضف المحتوى الأول الآن
          </button>
        </div>
      )}

      {/* Items Grid */}
      {!loading && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((item) => {
            // Safe rendering with fallbacks
            const id = item?.id || Math.random().toString()
            const title = item?.title || 'بدون عنوان'
            const type = item?.content_type || 'unknown'
            const category = item?.category || 'غير محدد'
            const image = item?.thumbnail_url
            const description = item?.description || ''
            const isPublished = item?.is_published || false

            return (
              <div
                key={id}
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition"
              >
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-20 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{title}</h3>
                  {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {type}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {category}
                    </span>
                    {isPublished && (
                      <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded">
                        منشور
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-600 transition flex-shrink-0"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
