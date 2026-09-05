'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[App error boundary]', error)
  }, [error])

  return (
    <main dir="rtl" className="flex min-h-[60vh] items-center justify-center px-6 py-24 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-destructive">500</p>
        <h1 className="mt-4 text-3xl font-extrabold text-foreground sm:text-4xl">حدث خطأ غير متوقع</h1>
        <p className="mt-4 leading-8 text-muted-foreground">تعذر تحميل هذه الصفحة مؤقتًا. جرّب إعادة المحاولة، أو انتقل إلى الصفحة الرئيسية.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">إعادة المحاولة</button>
          <Link href="/" className="rounded-xl border border-border px-5 py-3 font-bold text-foreground">العودة للرئيسية</Link>
        </div>
      </div>
    </main>
  )
}
