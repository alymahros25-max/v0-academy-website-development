'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Lock, AlertCircle } from 'lucide-react'
import { UsersManager } from '@/components/admin/users-manager'
import { PermissionsMatrix } from '@/components/admin/permissions-matrix'

export default function UsersAndPermissionsPage() {
  const [usersUpdated, setUsersUpdated] = useState(false)

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex gap-2">
          <Users className="h-8 w-8" />
          إدارة المستخدمين والصلاحيات
        </h1>
        <p className="text-gray-600 mt-2">
          أدر المستخدمين وحدد صلاحيات كل دور داخل النظام بشكل مرن وآمن
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">مسؤول</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">كل الصلاحيات</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">مشرف</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">إدارة محدودة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">معلم</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">محتواه فقط</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">طالب</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">قراءة فقط</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">تنبيه أمان</p>
            <p className="text-sm text-amber-800 mt-1">
              تأكد من تحديد الصلاحيات بشكل صحيح. الصلاحيات الزائدة قد تعرض الأمان للخطر.
              تحقق دائماً من الصلاحيات قبل إضافة مستخدم جديد.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex gap-2">
            <Users className="h-4 w-4" />
            المستخدمون
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex gap-2">
            <Lock className="h-4 w-4" />
            الصلاحيات
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 mt-4">
          <UsersManager onUserUpdated={() => setUsersUpdated(!usersUpdated)} />
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4 mt-4">
          <PermissionsMatrix />
        </TabsContent>
      </Tabs>
    </div>
  )
}
