'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export function TeachersManager() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    qualification: '',
    languages: 'ar,en',
    bio: ''
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  async function fetchTeachers() {
    try {
      const response = await fetch('/api/admin/data?type=teachers')
      const data = await response.json()
      setTeachers(data.teachers || [])
    } catch (error) {
      console.error('Failed to fetch teachers:', error)
    }
  }

  async function handleSave() {
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'teachers',
          action: editingId ? 'update' : 'create',
          id: editingId,
          data: formData
        })
      })

      if (response.ok) {
        resetForm()
        fetchTeachers()
      }
    } catch (error) {
      console.error('Failed to save teacher:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف المعلم؟')) return

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'teachers',
          action: 'delete',
          id
        })
      })

      if (response.ok) {
        fetchTeachers()
      }
    } catch (error) {
      console.error('Failed to delete teacher:', error)
    }
  }

  function handleEdit(teacher: any) {
    setFormData(teacher)
    setEditingId(teacher.id)
    setIsEditing(true)
  }

  function resetForm() {
    setFormData({
      name: '',
      specialization: '',
      experience: '',
      qualification: '',
      languages: 'ar,en',
      bio: ''
    })
    setEditingId(null)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">إضافة/تعديل معلم</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="اسم المعلم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <Input
            placeholder="التخصص (قرآن/عربي)"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />

          <Input
            placeholder="سنوات الخبرة"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />

          <Input
            placeholder="المؤهلات"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          />

          <Input
            placeholder="اللغات (ar,en,fr)"
            value={formData.languages}
            onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
          />

          <Input
            placeholder="نبذة قصيرة"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

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
        {teachers.map((teacher: any) => (
          <Card key={teacher.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{teacher.name}</h4>
                <p className="text-sm text-gray-600">{teacher.specialization}</p>
                <p className="text-sm text-gray-500">{teacher.experience} سنة خبرة</p>
                <p className="text-sm text-gray-500">{teacher.qualification}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(teacher)} variant="outline" size="sm">
                  تعديل
                </Button>
                <Button onClick={() => handleDelete(teacher.id)} variant="destructive" size="sm">
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
