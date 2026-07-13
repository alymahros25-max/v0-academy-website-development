import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Home, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { generatePageMetadata } from '@/lib/metadata-utils'

export const metadata: Metadata = generatePageMetadata('checkout-success')

async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const params = await searchParams
  const sessionId = params.session_id

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background">
      {/* Success Container */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-400/20 blur-2xl" />
            <CheckCircle className="relative h-24 w-24 text-green-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          شكراً لك!
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          تم تأكيد اشتراكك بنجاح
        </p>
        <p className="text-base text-muted-foreground mb-8">
          جميع التفاصيل تم إرسالها إلى بريدك الإلكتروني
        </p>

        {/* Session ID (for testing) */}
        {sessionId && (
          <div className="mb-8 rounded-lg bg-muted p-4 text-sm font-mono text-muted-foreground">
            <p>Session ID: {sessionId}</p>
          </div>
        )}

        {/* Info Cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {/* Email Confirmation */}
          <div className="rounded-lg border border-border bg-card p-6">
            <Mail className="mb-3 h-6 w-6 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">
              تأكيد بريدي
            </h3>
            <p className="text-sm text-muted-foreground">
              تحقق من بريدك الإلكتروني للحصول على تفاصيل الطلب
            </p>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg border border-border bg-card p-6">
            <CheckCircle className="mb-3 h-6 w-6 text-green-600 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">
              الخطوات التالية
            </h3>
            <p className="text-sm text-muted-foreground">
              سيتواصل معك فريقنا قريباً لتحديد موعد الحصة الأولى
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
          >
            <Home className="h-4 w-4" />
            العودة للرئيسية
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-muted transition"
          >
            عرض طلباتي
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            هل تواجه مشكلة في الدفع؟
          </p>
          <Link
            href="/contact"
            className="text-primary hover:underline font-semibold"
          >
            تواصل معنا الآن
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccessPage
