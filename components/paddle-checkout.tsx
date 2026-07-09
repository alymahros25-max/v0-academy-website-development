'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { AlertCircle, Loader2 } from 'lucide-react'
import { initializePaddleCheckout } from '@/app/actions/paddle'

interface PaddleCheckoutProps {
  productId: string
  customerEmail?: string
  onSuccess?: () => void
}

export default function PaddleCheckout({
  productId,
  customerEmail: initialEmail,
  onSuccess,
}: PaddleCheckoutProps) {
  const { t } = useI18n()
  const [email, setEmail] = useState(initialEmail || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !email.includes('@')) {
        throw new Error('يرجى إدخال عنوان بريد إلكتروني صحيح')
      }

      // Initialize Paddle checkout
      const result = await initializePaddleCheckout(
        productId,
        'ar',
        email
      )

      if (!result.success) {
        throw new Error(result.error || 'فشل في بدء عملية الدفع')
      }

      if (result.checkoutUrl) {
        // Redirect to Paddle checkout
        window.location.href = result.checkoutUrl
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء المتابعة'
      setError(errorMsg)
      console.error('[Paddle Checkout] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">إتمام الدفع</h2>
        <p className="text-sm text-muted-foreground mt-2">معالج: Paddle</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Checkout Form */}
      <form onSubmit={handleCheckout} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">
            عنوان البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            سنرسل تأكيد الدفع والحصول على الوصول إلى هذا البريد
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">معلومات الدفع</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>✓ دفع آمن وموثوق مع Paddle</li>
            <li>✓ تشفير من الدرجة الأولى</li>
            <li>✓ دعم جميع طرق الدفع العالمية</li>
            <li>✓ بدون رسوم إضافية</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري المتابعة...
            </>
          ) : (
            'متابعة إلى الدفع'
          )}
        </button>

        {/* Security Note */}
        <p className="text-xs text-center text-muted-foreground">
          آمن ومحمي بتقنية التشفير الحديثة
        </p>
      </form>

      {/* Support */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          هل تواجه مشكلة؟{' '}
          <a href="/contact" className="text-primary hover:underline font-semibold">
            تواصل معنا
          </a>
        </p>
      </div>
    </div>
  )
}
