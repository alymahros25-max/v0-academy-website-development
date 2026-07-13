'use client'

import React from 'react'
import { PageBuilder } from '@/components/admin/page-builder'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, FileText } from 'lucide-react'

export default function PagesManagementPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex gap-2">
          <FileText className="h-8 w-8" />
          منشئ الصفحات
        </h1>
        <p className="text-gray-600 mt-2">
          أنشئ وأدر صفحات الموقع بسهولة مع الترجمة التلقائية والنماذج الجاهزة
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ميزات البناء</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>✓ نماذج جاهزة</li>
              <li>✓ ترجمة تلقائية</li>
              <li>✓ SEO محسّن</li>
              <li>✓ نشر فوري</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">اللغات المدعومة</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>🇸🇦 العربية</li>
              <li>🇬🇧 English</li>
              <li>🇫🇷 Français</li>
              <li>↔️ ترجمة ذكية</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">النماذج المتاحة</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>• Hero Section</li>
              <li>• Services Grid</li>
              <li>• About Page</li>
              <li>• و 3 نماذج أخرى</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">ملاحظة مهمة</p>
            <p className="text-sm text-amber-800 mt-1">
              جميع الصفحات التي تنشئها يتم ربطها تلقائياً بنظام الـ CMS والترجمة.
              بعد إنشاء الصفحة، يمكنك الوصول إليها من خلال الرابط المباشر.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Page Builder */}
      <PageBuilder />
    </div>
  )
}
