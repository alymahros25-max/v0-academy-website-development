'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export function PackagesManager() {
  const [packages, setPackages] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'quran',
    sessions: 4,
    price: 15,
    duration: 30,
    features: ''
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  async function fetchPackages() {
    try {
      const response = await fetch('/api/admin/data?type=packages')
      const data = await response.json()
      setPackages(data.packages || [])
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    }
  }

  async function handleSave() {
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'packages',
          action: editingId ? 'update' : 'create',
          id: editingId,
          data: formData
        })
      })

      if (response.ok) {
        resetForm()
        fetchPackages()
      }
    } catch (error) {
      console.error('Failed to save package:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'packages',
          action: 'delete',
          id
        })
      })

      if (response.ok) {
        fetchPackages()
      }
    } catch (error) {
      console.error('Failed to delete package:', error)
    }
  }

  function handleEdit(pkg: any) {
    setFormData(pkg)
    setEditingId(pkg.id)
    setIsEditing(true)
  }

  function resetForm() {
    setFormData({
      name: '',
      type: 'quran',
      sessions: 4,
      price: 15,
      duration: 30,
      features: ''
    })
    setEditingId(null)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">إضافة/تعديل باقة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="اسم الباقة"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <select
            className="px-4 py-2 border rounded-lg"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="quran">قرآن</option>
            <option value="arabic">عربي</option>
          </select>

          <Input
            type="number"
            placeholder="عدد الحصص"
            value={formData.sessions}
            onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) })}
          />

          <Input
            type="number"
            placeholder="السعر ($)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          />

          <Input
            type="number"
            placeholder="مدة الحصة (دقيقة)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          />

          <Input
            placeholder="المميزات (مفصولة بفاصلة)"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
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
        {packages.map((pkg: any) => (
          <Card key={pkg.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{pkg.name}</h4>
                <p className="text-sm text-gray-600">{pkg.sessions} حصة - ${pkg.price}</p>
                <p className="text-sm text-gray-500">{pkg.features}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(pkg)} variant="outline" size="sm">
                  تعديل
                </Button>
                <Button onClick={() => handleDelete(pkg.id)} variant="destructive" size="sm">
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
