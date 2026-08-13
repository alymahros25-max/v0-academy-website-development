'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Save, RotateCcw } from 'lucide-react'
import { LivePreview } from '@/components/admin/live-preview'
import { TypographyCustomizer } from '@/components/admin/typography-customizer'
import { WidgetsManager } from '@/components/admin/widgets-manager'
import { useToast } from '@/hooks/use-toast'
import { batchSaveSettings } from '@/lib/api-client'

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  [key: string]: string
}

export default function ThemeCustomizerPage() {
  const { toast } = useToast()
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: '#2C5680',
    secondaryColor: '#5680A8',
    backgroundColor: '#C5D6E5',
    textColor: '#000000',
  })

  const [typographySettings, setTypographySettings] = useState({
    headerFont: 'Noto Sans Arabic',
    bodyFont: 'Inter',
    h1Size: 32,
    bodySize: 16,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [previewType, setPreviewType] = useState<'theme' | 'typography'>('theme')

  // Handle color change
  const handleColorChange = (colorKey: string, value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      [colorKey]: value,
    }))
  }

  // Handle typography change
  const handleTypographyChange = (settings: any) => {
    setTypographySettings(settings)
  }

  // Save theme to database using batch API
  const saveTheme = async () => {
    try {
      setIsSaving(true)
      console.log('[v0] Saving theme settings...')

      // Prepare batch update with all theme and typography settings
      const settingsToUpdate = [
        {
          setting_key: 'primary_color',
          setting_value: themeSettings.primaryColor,
        },
        {
          setting_key: 'secondary_color',
          setting_value: themeSettings.secondaryColor,
        },
        {
          setting_key: 'background_color',
          setting_value: themeSettings.backgroundColor,
        },
        {
          setting_key: 'text_color',
          setting_value: themeSettings.textColor,
        },
        {
          setting_key: 'header_font',
          setting_value: typographySettings.headerFont,
        },
        {
          setting_key: 'body_font',
          setting_value: typographySettings.bodyFont,
        },
      ]

      // Call batch API
      const response = await batchSaveSettings(settingsToUpdate)

      if (response.success) {
        console.log('[v0] Theme saved successfully:', response.data)
        toast({
          title: 'تم الحفظ بنجاح',
          description: 'تم حفظ إعدادات المظهر والخطوط وتحديث الموقع تلقائياً',
          duration: 3000,
        })
      } else {
        throw new Error(response.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('[v0] Save theme error:', error)
      const errorMsg =
        error instanceof Error ? error.message : 'فشل حفظ الإعدادات'
      toast({
        title: 'خطأ',
        description: errorMsg,
        variant: 'destructive',
        duration: 4000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to defaults
  const resetTheme = () => {
    setThemeSettings({
      primaryColor: '#1a4d2e',
      secondaryColor: '#d4af37',
      backgroundColor: '#ffffff',
      textColor: '#000000',
    })
    setTypographySettings({
      headerFont: 'Noto Sans Arabic',
      bodyFont: 'Inter',
      h1Size: 32,
      bodySize: 16,
    })
    toast({
      title: 'تم الاستعادة',
      description: 'تم استعادة الإعدادات الافتراضية',
    })
  }

  const combinedSettings = {
    ...themeSettings,
    ...typographySettings,
  }

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">مخصص المظهر والخطوط</h1>
        <p className="text-gray-600 mt-2">
          خصص ألوان موقعك والخطوط والحركات والأدوات بشكل فوري مع معاينة مباشرة
        </p>
      </div>

      {/* Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">نصيحة التخصيص</p>
            <p className="text-sm text-blue-800 mt-1">
              استخدم الأجزاء على اليسار لتعديل الإعدادات والمعاينة الحية على اليمين تتحدث فوراً.
              اضغط "حفظ" فقط عندما تكون راضٍ عن التصميم.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors" className="text-xs">الألوان</TabsTrigger>
              <TabsTrigger value="fonts" className="text-xs">الخطوط</TabsTrigger>
              <TabsTrigger value="widgets" className="text-xs">الأدوات</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">الألوان الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Primary Color */}
                  <div className="space-y-2">
                    <Label>اللون الأساسي (أخضر)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={e => handleColorChange('primaryColor', e.target.value)}
                        className="h-10 w-16 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={themeSettings.primaryColor}
                        onChange={e => handleColorChange('primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="space-y-2">
                    <Label>اللون الثانوي (ذهبي)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={e => handleColorChange('secondaryColor', e.target.value)}
                        className="h-10 w-16 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={themeSettings.secondaryColor}
                        onChange={e => handleColorChange('secondaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="space-y-2">
                    <Label>لون الخلفية</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={themeSettings.backgroundColor}
                        onChange={e => handleColorChange('backgroundColor', e.target.value)}
                        className="h-10 w-16 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={themeSettings.backgroundColor}
                        onChange={e => handleColorChange('backgroundColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-2">
                    <Label>لون النص</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={themeSettings.textColor}
                        onChange={e => handleColorChange('textColor', e.target.value)}
                        className="h-10 w-16 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={themeSettings.textColor}
                        onChange={e => handleColorChange('textColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fonts Tab */}
            <TabsContent value="fonts" className="mt-4">
              <TypographyCustomizer
                onChangeTheme={handleTypographyChange}
                initialSettings={typographySettings}
              />
            </TabsContent>

            {/* Widgets Tab */}
            <TabsContent value="widgets" className="mt-4">
              <WidgetsManager />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              onClick={saveTheme}
              disabled={isSaving}
              className="w-full"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
            <Button
              onClick={resetTheme}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              استعادة الافتراضي
            </Button>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="lg:col-span-2">
          <LivePreview
            previewType={previewType}
            themeOverrides={Object.fromEntries(Object.entries(combinedSettings).map(([key, value]) => [key, String(value)]))}
            onRefresh={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
