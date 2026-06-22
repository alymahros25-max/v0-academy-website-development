'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Plus, Edit2, Trash2, Shield, Eye, EyeOff } from 'lucide-react'
import useSWR from 'swr'
import { useToast } from '@/hooks/use-toast'

type RoleType = 'admin' | 'supervisor' | 'teacher' | 'student'

interface CMSUser {
  id?: number
  email: string
  full_name?: string
  role_type: RoleType
  is_active: boolean
  phone?: string
}

interface UsersManagerProps {
  onUserUpdated?: () => void
}

const ROLE_COLORS: Record<RoleType, string> = {
  admin: 'bg-red-100 text-red-800',
  supervisor: 'bg-purple-100 text-purple-800',
  teacher: 'bg-blue-100 text-blue-800',
  student: 'bg-green-100 text-green-800',
}

const ROLE_LABELS: Record<RoleType, string> = {
  admin: 'مسؤول',
  supervisor: 'مشرف',
  teacher: 'معلم',
  student: 'طالب',
}

export function UsersManager({ onUserUpdated }: UsersManagerProps) {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState<CMSUser>({
    email: '',
    full_name: '',
    role_type: 'student',
    is_active: true,
    phone: '',
  })

  // Fetch users
  const { data: usersData, mutate: mutateUsers } = useSWR('/api/cms/users', async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
  })

  const users = usersData?.data || []

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveUser = async () => {
    try {
      if (!formData.email) {
        toast({
          title: 'خطأ',
          description: 'يرجى إدخال البريد الإلكتروني',
          variant: 'destructive',
        })
        return
      }

      setIsCreating(true)
      console.log('[v0] Saving user:', formData)

      const method = editingId ? 'PATCH' : 'POST'
      const url = editingId ? `/api/cms/users?id=${editingId}` : '/api/cms/users'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('[v0] Save result:', result)

      toast({
        title: 'تم بنجاح',
        description: `تم ${editingId ? 'تحديث' : 'إضافة'} المستخدم بنجاح${result.revalidated ? ' وتحديث النظام' : ''}`,
        duration: 3000,
      })

      resetForm()
      mutateUsers()
      onUserUpdated?.()
    } catch (error) {
      console.error('[v0] Save user error:', error)
      const errorMsg =
        error instanceof Error ? error.message : 'فشل حفظ المستخدم'
      toast({
        title: 'خطأ',
        description: errorMsg,
        variant: 'destructive',
        duration: 4000,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const editUser = (user: CMSUser) => {
    setFormData(user)
    setEditingId(user.id || null)
  }

  const deleteUser = async (id: number) => {
    if (!confirm('هل تريد حذف هذا المستخدم؟')) return

    try {
      const response = await fetch(`/api/cms/users?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف المستخدم بنجاح',
        })
        mutateUsers()
      }
    } catch (error) {
      console.error('[v0] Delete user error:', error)
      toast({
        title: 'خطأ',
        description: 'فشل حذف المستخدم',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      role_type: 'student',
      is_active: true,
      phone: '',
    })
    setEditingId(null)
  }

  const toggleUserStatus = async (user: CMSUser) => {
    try {
      const response = await fetch(`/api/cms/users?id=${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...user,
          is_active: !user.is_active,
        }),
      })

      if (response.ok) {
        toast({
          title: 'تم التحديث',
          description: `المستخدم الآن ${!user.is_active ? 'مفعّل' : 'معطّل'}`,
        })
        mutateUsers()
      }
    } catch (error) {
      console.error('[v0] Toggle user status error:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحديث حالة المستخدم',
        variant: 'destructive',
      })
    }
  }

  // Group users by role
  const usersByRole = users.reduce((acc: any, user: CMSUser) => {
    if (!acc[user.role_type]) {
      acc[user.role_type] = []
    }
    acc[user.role_type].push(user)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* User Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>البريد الإلكتروني *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
                placeholder="user@example.com"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>الاسم الكامل</Label>
              <Input
                value={formData.full_name || ''}
                onChange={e => handleFormChange('full_name', e.target.value)}
                placeholder="أحمد محمد"
              />
            </div>

            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <Input
                type="tel"
                value={formData.phone || ''}
                onChange={e => handleFormChange('phone', e.target.value)}
                placeholder="+201234567890"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>نوع الدور *</Label>
              <select
                value={formData.role_type}
                onChange={e => handleFormChange('role_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="admin">مسؤول</option>
                <option value="supervisor">مشرف</option>
                <option value="teacher">معلم</option>
                <option value="student">طالب</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={e => handleFormChange('is_active', e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">تفعيل الحساب</span>
          </label>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={saveUser}
              disabled={isCreating}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? 'تحديث' : 'إضافة'}
            </Button>
            {editingId && (
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users List by Role */}
      {Object.entries(ROLE_LABELS).map(([roleType, roleLabel]) => {
        const roleUsers = usersByRole[roleType] || []
        if (roleUsers.length === 0) return null

        return (
          <Card key={roleType}>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Shield className="h-5 w-5" />
                {roleLabel}ون ({roleUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roleUsers.map((user: CMSUser) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{user.full_name || user.email}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleUserStatus(user)}
                      >
                        {user.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4 opacity-50" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editUser(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteUser(user.id!)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {users.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            لا يوجد مستخدمون حالياً. أضف المستخدم الأول!
          </CardContent>
        </Card>
      )}
    </div>
  )
}
