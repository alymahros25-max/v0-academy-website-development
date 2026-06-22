'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageCircle, Menu, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface WhatsAppConfig {
  position: 'left' | 'right'
  phone: string
  size: 'small' | 'medium' | 'large'
  color: string
  showLabel: boolean
  labelAr: string
  labelEn: string
  labelFr: string
}

interface NavbarConfig {
  position: 'top' | 'bottom'
  style: 'light' | 'dark'
  alignment: 'left' | 'right' | 'center'
  items: string[]
}

interface WidgetsManagerProps {
  onWidgetUpdate?: (widgetType: string, config: any) => void
}

export function WidgetsManager({ onWidgetUpdate }: WidgetsManagerProps) {
  const { toast } = useToast()
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    position: 'right',
    phone: '+201130127894',
    size: 'large',
    color: '#1a4d2e',
    showLabel: true,
    labelAr: 'اتصل بنا',
    labelEn: 'Contact Us',
    labelFr: 'Nous contacter',
  })

  const [navbarConfig, setNavbarConfig] = useState<NavbarConfig>({
    position: 'top',
    style: 'light',
    alignment: 'right',
    items: ['home', 'courses', 'about', 'teachers', 'contact'],
  })

  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [navbarEnabled, setNavbarEnabled] = useState(true)

  // Handle WhatsApp config changes
  const updateWhatsAppConfig = (key: string, value: any) => {
    const updated = { ...whatsappConfig, [key]: value }
    setWhatsappConfig(updated)
    onWidgetUpdate?.('whatsapp_button', updated)
  }

  // Handle Navbar config changes
  const updateNavbarConfig = (key: string, value: any) => {
    const updated = { ...navbarConfig, [key]: value }
    setNavbarConfig(updated)
    onWidgetUpdate?.('navbar', updated)
  }

  // Add navbar item
  const addNavbarItem = (item: string) => {
    if (item && !navbarConfig.items.includes(item)) {
      const updated = {
        ...navbarConfig,
        items: [...navbarConfig.items, item],
      }
      setNavbarConfig(updated)
      onWidgetUpdate?.('navbar', updated)
    }
  }

  // Remove navbar item
  const removeNavbarItem = (index: number) => {
    const updated = {
      ...navbarConfig,
      items: navbarConfig.items.filter((_, i) => i !== index),
    }
    setNavbarConfig(updated)
    onWidgetUpdate?.('navbar', updated)
  }

  // Move navbar item up
  const moveNavbarItemUp = (index: number) => {
    if (index > 0) {
      const items = [...navbarConfig.items]
      const temp = items[index]
      items[index] = items[index - 1]
      items[index - 1] = temp
      const updated = { ...navbarConfig, items }
      setNavbarConfig(updated)
      onWidgetUpdate?.('navbar', updated)
    }
  }

  // Move navbar item down
  const moveNavbarItemDown = (index: number) => {
    if (index < navbarConfig.items.length - 1) {
      const items = [...navbarConfig.items]
      const temp = items[index]
      items[index] = items[index + 1]
      items[index + 1] = temp
      const updated = { ...navbarConfig, items }
      setNavbarConfig(updated)
      onWidgetUpdate?.('navbar', updated)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Menu className="h-5 w-5" />
          مدير الأدوات والقوائم
        </CardTitle>
        <CardDescription>
          إدارة الأزرار العائمة والقوائم والعناصر المتحركة
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whatsapp" className="flex gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </TabsTrigger>
            <TabsTrigger value="navbar" className="flex gap-2">
              <Menu className="h-4 w-4" />
              <span>القائمة</span>
            </TabsTrigger>
          </TabsList>

          {/* WhatsApp Widget Tab */}
          <TabsContent value="whatsapp" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">زر WhatsApp</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setWhatsappEnabled(!whatsappEnabled)
                  toast({
                    title: 'تم التحديث',
                    description: `زر WhatsApp ${!whatsappEnabled ? 'مفعّل' : 'معطّل'} الآن`,
                  })
                }}
              >
                {whatsappEnabled ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    مفعّل
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    معطّل
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone number */}
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  type="tel"
                  value={whatsappConfig.phone}
                  onChange={e => updateWhatsAppConfig('phone', e.target.value)}
                  placeholder="+20XXXXXXXXXXX"
                />
                <p className="text-xs text-gray-600">
                  استخدم الصيغة الدولية (مثل: +20)
                </p>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label>الموضع</Label>
                <select
                  value={whatsappConfig.position}
                  onChange={e => updateWhatsAppConfig('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="left">اليسار</option>
                  <option value="right">اليمين</option>
                </select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label>الحجم</Label>
                <select
                  value={whatsappConfig.size}
                  onChange={e => updateWhatsAppConfig('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="small">صغير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">كبير</option>
                </select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label>اللون</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={whatsappConfig.color}
                    onChange={e => updateWhatsAppConfig('color', e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={whatsappConfig.color}
                    onChange={e => updateWhatsAppConfig('color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-semibold text-sm">التسميات (متعدد اللغات)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>عربي</Label>
                  <Input
                    value={whatsappConfig.labelAr}
                    onChange={e => updateWhatsAppConfig('labelAr', e.target.value)}
                    placeholder="اتصل بنا"
                  />
                </div>
                <div className="space-y-2">
                  <Label>English</Label>
                  <Input
                    value={whatsappConfig.labelEn}
                    onChange={e => updateWhatsAppConfig('labelEn', e.target.value)}
                    placeholder="Contact Us"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Français</Label>
                  <Input
                    value={whatsappConfig.labelFr}
                    onChange={e => updateWhatsAppConfig('labelFr', e.target.value)}
                    placeholder="Nous contacter"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Navbar Tab */}
          <TabsContent value="navbar" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">شريط التنقل</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNavbarEnabled(!navbarEnabled)
                  toast({
                    title: 'تم التحديث',
                    description: `شريط التنقل ${!navbarEnabled ? 'مفعّل' : 'معطّل'} الآن`,
                  })
                }}
              >
                {navbarEnabled ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    مفعّل
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    معطّل
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Position */}
              <div className="space-y-2">
                <Label>الموضع</Label>
                <select
                  value={navbarConfig.position}
                  onChange={e => updateNavbarConfig('position', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="top">أعلى</option>
                  <option value="bottom">أسفل</option>
                </select>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label>الأسلوب</Label>
                <select
                  value={navbarConfig.style}
                  onChange={e => updateNavbarConfig('style', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="light">فاتح</option>
                  <option value="dark">داكن</option>
                </select>
              </div>

              {/* Alignment */}
              <div className="space-y-2">
                <Label>المحاذاة</Label>
                <select
                  value={navbarConfig.alignment}
                  onChange={e => updateNavbarConfig('alignment', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="left">يسار</option>
                  <option value="center">وسط</option>
                  <option value="right">يمين</option>
                </select>
              </div>
            </div>

            {/* Navbar Items */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-semibold text-sm">عناصر القائمة (اسحب لإعادة الترتيب)</h3>

              <div className="space-y-2">
                {navbarConfig.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-sm capitalize">{item}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveNavbarItemUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveNavbarItemDown(index)}
                        disabled={index === navbarConfig.items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeNavbarItem(index)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new item */}
              <div className="flex gap-2 pt-2">
                <Input
                  id="new-item"
                  placeholder="أضف عنصر جديد"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget
                      addNavbarItem(input.value)
                      input.value = ''
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('new-item') as HTMLInputElement
                    if (input) {
                      addNavbarItem(input.value)
                      input.value = ''
                    }
                  }}
                >
                  إضافة
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
          <p className="font-semibold mb-2">ملاحظة:</p>
          <p>يمكنك إعادة ترتيب عناصر القائمة بالنقر على الأزرار أعلى وأسفل. سيتم حفظ التغييرات فوراً.</p>
        </div>
      </CardContent>
    </Card>
  )
}
