'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <p className="text-3xl font-bold text-foreground mb-2">الصفحة غير موجودة</p>
          <p className="text-xl text-muted-foreground mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تم نقلها
          </p>
        </div>

        {/* Decorative element */}
        <div className="mb-12 text-6xl animate-bounce">
          📖
        </div>

        {/* Return button */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              العودة إلى الصفحة الرئيسية
            </Button>
          </Link>

          <div className="flex gap-2 justify-center flex-wrap">
            <Link href="/quran">
              <Button variant="outline">قرآن الكريم</Button>
            </Link>
            <Link href="/arabic">
              <Button variant="outline">تأسيس العربي</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">اتصل بنا</Button>
            </Link>
          </div>
        </div>

        {/* Additional help text */}
        <div className="mt-12 p-6 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            هل تحتاج مساعدة؟
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            تواصل معنا عبر
            <a href="https://wa.me/201130127894" className="text-primary hover:underline mx-1">
              واتساب
            </a>
            أو
            <a href="https://t.me/acabemy_quraan" className="text-primary hover:underline mx-1">
              تليجرام
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
