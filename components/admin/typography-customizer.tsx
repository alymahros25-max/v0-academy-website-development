'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sliders, Type, Palette } from 'lucide-react'

interface TypographySettings {
  headerFont?: string
  bodyFont?: string
  h1Size?: number
  h2Size?: number
  h3Size?: number
  bodySize?: number
  lineHeight?: number
  headerColor?: string
  textColor?: string
  accentColor?: string
  headerWeight?: number
  bodyWeight?: number
}

interface TypographyCustomizerProps {
  onChangeTheme?: (settings: TypographySettings) => void
  initialSettings?: TypographySettings
}

const FONT_FAMILIES = [
  { value: 'Noto Sans Arabic', label: 'Noto Sans Arabic' },
  { value: 'Segoe UI', label: 'Segoe UI' },
  { value: 'Droid Arabic Kufi', label: 'Droid Arabic Kufi' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Jost', label: 'Jost' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
]

export function TypographyCustomizer({
  onChangeTheme,
  initialSettings = {},
}: TypographyCustomizerProps) {
  const [settings, setSettings] = useState<TypographySettings>({
    headerFont: 'Noto Sans Arabic',
    bodyFont: 'Inter',
    h1Size: 32,
    h2Size: 24,
    h3Size: 20,
    bodySize: 16,
    lineHeight: 1.6,
    headerColor: '#1a4d2e',
    textColor: '#000000',
    accentColor: '#d4af37',
    headerWeight: 700,
    bodyWeight: 400,
    ...initialSettings,
  })

  // Update theme on change
  useEffect(() => {
    onChangeTheme?.(settings)
  }, [settings, onChangeTheme])

  const handleFontChange = (type: 'header' | 'body', font: string) => {
    setSettings(prev => ({
      ...prev,
      [type === 'header' ? 'headerFont' : 'bodyFont']: font,
    }))
  }

  const handleSizeChange = (key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleColorChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Type className="h-5 w-5" />
          مخصص الخطوط والأحجام
        </CardTitle>
        <CardDescription>
          تخصيص الخطوط والأحجام والألوان للعناوين والنصوص
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="fonts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fonts">الخطوط</TabsTrigger>
            <TabsTrigger value="sizes">الأحجام</TabsTrigger>
            <TabsTrigger value="colors">الألوان</TabsTrigger>
          </TabsList>

          {/* Fonts Tab */}
          <TabsContent value="fonts" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="header-font">خط العناوين</Label>
                <select
                  id="header-font"
                  value={settings.headerFont || 'Noto Sans Arabic'}
                  onChange={e => handleFontChange('header', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {FONT_FAMILIES.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
                <p
                  className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                  style={{ fontFamily: settings.headerFont || 'Noto Sans Arabic' }}
                >
                  معاينة: هذا نص العنوان
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body-font">خط النصوص</Label>
                <select
                  id="body-font"
                  value={settings.bodyFont || 'Inter'}
                  onChange={e => handleFontChange('body', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {FONT_FAMILIES.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
                <p
                  className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                  style={{ fontFamily: settings.bodyFont || 'Inter' }}
                >
                  معاينة: هذا نص عادي من النص الأساسي
                </p>
              </div>
            </div>

            {/* Font weights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>وزن خط العناوين</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="300"
                    max="900"
                    step="100"
                    value={settings.headerWeight || 700}
                    onChange={e => handleSizeChange('headerWeight', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold">{settings.headerWeight || 700}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>وزن خط النصوص</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="300"
                    max="700"
                    step="100"
                    value={settings.bodyWeight || 400}
                    onChange={e => handleSizeChange('bodyWeight', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold">{settings.bodyWeight || 400}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sizes Tab */}
          <TabsContent value="sizes" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">أحجام العناوين</h3>

                <div className="space-y-2">
                  <Label>حجم H1</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="24"
                      max="48"
                      value={settings.h1Size || 32}
                      onChange={e => handleSizeChange('h1Size', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{settings.h1Size}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>حجم H2</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="18"
                      max="36"
                      value={settings.h2Size || 24}
                      onChange={e => handleSizeChange('h2Size', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{settings.h2Size}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>حجم H3</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="16"
                      max="28"
                      value={settings.h3Size || 20}
                      onChange={e => handleSizeChange('h3Size', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{settings.h3Size}px</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm">أحجام النصوص</h3>

                <div className="space-y-2">
                  <Label>حجم النص الأساسي</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={settings.bodySize || 16}
                      onChange={e => handleSizeChange('bodySize', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{settings.bodySize}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ارتفاع السطر</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1.2"
                      max="2.0"
                      step="0.1"
                      value={settings.lineHeight || 1.6}
                      onChange={e => handleSizeChange('lineHeight', parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{settings.lineHeight}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>لون العناوين</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.headerColor || '#1a4d2e'}
                    onChange={e => handleColorChange('headerColor', e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.headerColor || '#1a4d2e'}
                    onChange={e => handleColorChange('headerColor', e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>لون النصوص</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.textColor || '#000000'}
                    onChange={e => handleColorChange('textColor', e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.textColor || '#000000'}
                    onChange={e => handleColorChange('textColor', e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>اللون الإضافي</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.accentColor || '#d4af37'}
                    onChange={e => handleColorChange('accentColor', e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.accentColor || '#d4af37'}
                    onChange={e => handleColorChange('accentColor', e.target.value)}
                    className="flex-1"
                    placeholder="#d4af37"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          <p className="font-semibold mb-2">تلميح:</p>
          <p>جميع التغييرات تُطبق فوراً على المعاينة الحية. اضغط "حفظ" عندما تكون راضٍ عن التصميم.</p>
        </div>
      </CardContent>
    </Card>
  )
}
