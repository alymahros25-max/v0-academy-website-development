'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Edit3, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ContentItem {
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

interface ContentListProps {
  items: ContentItem[]
  isLoading: boolean
  onEdit: (item: ContentItem) => void
  onDelete: (key: string) => Promise<void>
  onToggleActive: (key: string, isActive: boolean) => Promise<void>
}

export function ContentList({
  items,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: ContentListProps) {
  const { toast } = useToast()
  const [deletingKey, setDeletingKey] = useState<string | null>(null)
  const [togglingKey, setTogglingKey] = useState<string | null>(null)

  const handleDelete = async (key: string) => {
    if (!confirm('هل تريد حذف هذا المحتوى بالفعل؟')) return

    setDeletingKey(key)
    try {
      await onDelete(key)
      toast({
        title: 'نجاح',
        description: 'تم حذف المحتوى',
      })
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل الحذف',
        variant: 'destructive',
      })
    } finally {
      setDeletingKey(null)
    }
  }

  const handleToggle = async (key: string, currentActive: boolean) => {
    setTogglingKey(key)
    try {
      await onToggleActive(key, !currentActive)
      toast({
        title: 'نجاح',
        description: !currentActive ? 'تم تفعيل المحتوى' : 'تم تعطيل المحتوى',
      })
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل التحديث',
        variant: 'destructive',
      })
    } finally {
      setTogglingKey(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">لا يوجد محتوى حتى الآن</p>
      </div>
    )
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">المفتاح</th>
                <th className="px-4 py-3 text-right font-semibold">القسم</th>
                <th className="px-4 py-3 text-right font-semibold">النوع</th>
                <th className="px-4 py-3 text-right font-semibold">النص العربي</th>
                <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                <th className="px-4 py-3 text-right font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.key} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{item.key}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {item.section}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.type === 'short' ? (
                      <span className="text-xs">قصير</span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        طويل
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="truncate max-w-xs text-muted-foreground text-xs">
                      {item.content_ar}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {item.is_active ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        مفعّل
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        معطّل
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggle(item.key, item.is_active)}
                        disabled={togglingKey === item.key}
                        className="h-8 w-8 p-0"
                      >
                        {item.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.key)}
                        disabled={deletingKey === item.key}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
