'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    rating: 5,
    text: '',
    approved: false
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    try {
      const response = await fetch('/api/admin/data?type=testimonials')
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    }
  }

  async function handleSave() {
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'testimonials',
          action: editingId ? 'update' : 'create',
          id: editingId,
          data: formData
        })
      })

      if (response.ok) {
        resetForm()
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'testimonials',
          action: 'delete',
          id
        })
      })

      if (response.ok) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
    }
  }

  function handleEdit(testimonial: any) {
    setFormData(testimonial)
    setEditingId(testimonial.id)
    setIsEditing(true)
  }

  function resetForm() {
    setFormData({
      studentName: '',
      parentName: '',
      rating: 5,
      text: '',
      approved: false
    })
    setEditingId(null)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">إضافة/تعديل تقييم</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="اسم الطالب"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          />
          
          <Input
            placeholder="اسم ولي الأمر"
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
          />

          <select
            className="px-4 py-2 border rounded-lg"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} نجوم</option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.approved}
              onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
            />
            <span>منشور</span>
          </label>
        </div>

        <textarea
          className="w-full mt-4 px-3 py-2 border rounded-lg"
          rows={4}
          placeholder="نص التقييم"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        />

        <div className="flex gap-2 mt-4">
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            {editingId ? 'تحديث' : 'إضافة'}
          </Button>
          {isEditing && (
            <Button onClick={resetForm} variant="outline">
              إلغاء
            </Button>
          )}
        </div>
      </Card>

      <div className="grid gap-4">
        {testimonials.map((testimonial: any) => (
          <Card key={testimonial.id} className={`p-4 ${!testimonial.approved ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{testimonial.studentName}</h4>
                <p className="text-sm text-gray-600">من {testimonial.parentName}</p>
                <div className="flex gap-1 my-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-sm text-gray-700">{testimonial.text}</p>
                {!testimonial.approved && (
                  <p className="text-xs text-orange-600 mt-2">قيد المراجعة</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(testimonial)} variant="outline" size="sm">
                  تعديل
                </Button>
                <Button onClick={() => handleDelete(testimonial.id)} variant="destructive" size="sm">
                  حذف
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
