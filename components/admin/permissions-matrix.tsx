'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, CheckCircle2, XCircle } from 'lucide-react'
import useSWR from 'swr'
import { useToast } from '@/hooks/use-toast'

type RoleType = 'admin' | 'supervisor' | 'teacher' | 'student'

interface Permission {
  id?: number
  role_type: RoleType
  module_name: string
  action: string
  is_allowed: boolean
  description?: string
}

interface PermissionsMatrixProps {
  onPermissionUpdated?: () => void
}

const MODULES = [
  'content_management',
  'theme_settings',
  'page_builder',
  'user_management',
  'widget_management',
]

const MODULE_LABELS: Record<string, string> = {
  content_management: 'إدارة المحتوى',
  theme_settings: 'إعدادات المظهر',
  page_builder: 'منشئ الصفحات',
  user_management: 'إدارة المستخدمين',
  widget_management: 'إدارة الأدوات',
}

const ACTIONS = ['create', 'read', 'update', 'delete', 'publish']

const ACTION_LABELS: Record<string, string> = {
  create: 'إنشاء',
  read: 'قراءة',
  update: 'تعديل',
  delete: 'حذف',
  publish: 'نشر',
}

export function PermissionsMatrix({ onPermissionUpdated }: PermissionsMatrixProps) {
  const { toast } = useToast()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Fetch permissions
  const { data: permissionsData, mutate: mutatePermissions } = useSWR(
    '/api/cms/permissions',
    async (url) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch permissions')
      return res.json()
    }
  )

  useEffect(() => {
    if (permissionsData?.data) {
      setPermissions(permissionsData.data)
    }
  }, [permissionsData])

  const togglePermission = async (
    roleType: RoleType,
    moduleName: string,
    action: string,
    currentValue: boolean
  ) => {
    try {
      setIsSaving(true)

      // Find the permission record
      const permission = permissions.find(
        p => p.role_type === roleType && p.module_name === moduleName && p.action === action
      )

      if (!permission) {
        toast({
          title: 'خطأ',
          description: 'لم يتم العثور على الصلاحية',
          variant: 'destructive',
        })
        return
      }

      const response = await fetch(`/api/cms/permissions?id=${permission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_allowed: !currentValue,
        }),
      })

      if (response.ok) {
        setPermissions(perms =>
          perms.map(p =>
            p.id === permission.id ? { ...p, is_allowed: !currentValue } : p
          )
        )

        toast({
          title: 'تم التحديث',
          description: 'تم تحديث الصلاحيات بنجاح',
        })

        mutatePermissions()
        onPermissionUpdated?.()
      }
    } catch (error) {
      console.error('[v0] Toggle permission error:', error)
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الصلاحيات',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getPermission = (
    roleType: RoleType,
    moduleName: string,
    action: string
  ): Permission | undefined => {
    return permissions.find(
      p => p.role_type === roleType && p.module_name === moduleName && p.action === action
    )
  }

  const roles: RoleType[] = ['admin', 'supervisor', 'teacher', 'student']

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Lock className="h-5 w-5" />
          مصفوفة الصلاحيات
        </CardTitle>
        <CardDescription>
          تحكم دقيق بصلاحيات كل دور في النظام
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="admin">مسؤول</TabsTrigger>
            <TabsTrigger value="supervisor">مشرف</TabsTrigger>
            <TabsTrigger value="teacher">معلم</TabsTrigger>
            <TabsTrigger value="student">طالب</TabsTrigger>
          </TabsList>

          {roles.map(roleType => (
            <TabsContent key={roleType} value={roleType} className="space-y-4 mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">الميزة</th>
                      {ACTIONS.map(action => (
                        <th key={action} className="text-center p-2">
                          {ACTION_LABELS[action]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map(module => (
                      <tr key={module} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-semibold text-right">
                          {MODULE_LABELS[module]}
                        </td>
                        {ACTIONS.map(action => {
                          const permission = getPermission(roleType, module, action)
                          const isAllowed = permission?.is_allowed || false

                          return (
                            <td key={action} className="text-center p-2">
                              <button
                                onClick={() =>
                                  togglePermission(roleType, module, action, isAllowed)
                                }
                                disabled={isSaving}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-gray-200"
                              >
                                {isAllowed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex gap-2 items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>مسموح</span>
                </div>
                <div className="flex gap-2 items-center">
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span>غير مسموح</span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-2">ملاحظة:</p>
          <ul className="space-y-1 text-xs">
            <li>• المسؤول: له كل الصلاحيات</li>
            <li>• المشرف: يمكنه إدارة المحتوى والصفحات بدون حذف</li>
            <li>• المعلم: يمكنه إنشاء وتعديل المحتوى الخاص به فقط</li>
            <li>• الطالب: له وصول قراءة فقط</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
