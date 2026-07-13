'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Monitor, Tablet, Smartphone, RefreshCw, Download, Eye } from 'lucide-react'

interface LivePreviewProps {
  previewType: 'theme' | 'page' | 'typography' | 'animations'
  themeOverrides?: Record<string, string>
  pageId?: number
  onRefresh?: () => void
}

export function LivePreview({
  previewType,
  themeOverrides = {},
  pageId,
  onRefresh,
}: LivePreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [error, setError] = useState<string | null>(null)

  // Device viewport dimensions for responsive preview
  const deviceSizes: Record<string, { width: number; height: number; label: string }> = {
    mobile: { width: 375, height: 667, label: 'Mobile (375px)' },
    tablet: { width: 768, height: 1024, label: 'Tablet (768px)' },
    desktop: { width: 1920, height: 1080, label: 'Desktop (1920px)' },
  }

  // Fetch preview from API
  const generatePreview = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/cms/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previewType,
          themeOverrides,
          pageId,
          deviceType,
        }),
      })

      if (!response.ok) {
        throw new Error(`Preview generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      setPreviewHtml(data.html)
    } catch (err) {
      console.error('[v0] Preview generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate preview')
    } finally {
      setLoading(false)
    }
  }, [previewType, themeOverrides, pageId, deviceType])

  // Generate preview on mount and when dependencies change
  useEffect(() => {
    generatePreview()
  }, [generatePreview])

  // Download preview as HTML file
  const downloadPreview = () => {
    try {
      const element = document.createElement('a')
      const file = new Blob([previewHtml], { type: 'text/html' })
      element.href = URL.createObjectURL(file)
      element.download = `preview-${previewType}-${Date.now()}.html`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (err) {
      console.error('[v0] Download error:', err)
    }
  }

  const viewport = deviceSizes[deviceType]

  return (
    <Card className="w-full border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>معاينة مباشرة</CardTitle>
          <CardDescription>
            عرض فوري لتغييراتك قبل الحفظ
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={generatePreview}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadPreview}
            disabled={loading || !previewHtml}
          >
            <Download className="h-4 w-4 mr-2" />
            تحميل
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Device selector tabs */}
        <Tabs defaultValue="desktop" value={deviceType} onValueChange={(value: any) => setDeviceType(value)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="mobile" className="flex gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">موبايل</span>
            </TabsTrigger>
            <TabsTrigger value="tablet" className="flex gap-2">
              <Tablet className="h-4 w-4" />
              <span className="hidden sm:inline">تابلت</span>
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">سطح المكتب</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={deviceType} className="space-y-4">
            {/* Error state */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                خطأ في المعاينة: {error}
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">جاري توليد المعاينة...</p>
                </div>
              </div>
            )}

            {/* Preview iframe */}
            {!loading && previewHtml && (
              <div className="overflow-auto bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <div
                  className="relative border-4 border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-white"
                  style={{
                    width: `${viewport.width}px`,
                    height: `${viewport.height}px`,
                    transform: `scale(${Math.min(1, Math.min(800 / viewport.width, 600 / viewport.height))})`,
                    transformOrigin: 'top center',
                  }}
                >
                  {/* Device frame label */}
                  <div className="absolute -top-6 left-0 right-0 text-center text-xs font-semibold text-gray-600">
                    {viewport.label}
                  </div>

                  {/* iframe with preview HTML */}
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-none"
                    title={`Preview - ${previewType}`}
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !previewHtml && !error && (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg text-gray-500">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">لا توجد معاينة متاحة</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-2">نصيحة:</p>
          <p>
            جميع التغييرات التي تجريها على الألوان والخطوط والحركات سيتم عرضها هنا فوراً.
            لا تحتاج إلى حفظ لترى النتيجة.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
