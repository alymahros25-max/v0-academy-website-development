'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { AlertCircle, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { PAYMENTS_ENABLED } from '@/lib/payment-feature'

// Lazy load only the appropriate checkout component based on provider
// Don't preload both - this prevents unnecessary script loads
const PaddleCheckout = dynamic(() => import('@/components/paddle-checkout'), { ssr: false })
const StripeCheckout = dynamic(() => import('@/components/stripe-checkout'), { 
  ssr: false,
  loading: () => null, // Don't render anything while loading
})

interface DynamicCheckoutProps {
  productId: string
  customerEmail?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function DynamicCheckout({
  productId,
  customerEmail,
  onSuccess,
  onError,
}: DynamicCheckoutProps) {
  const { locale } = useI18n()

  const [provider, setProvider] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!PAYMENTS_ENABLED) return

    const fetchProvider = async () => {
      try {
        setLoading(true)
        
        const response = await fetch('/api/admin/payment-settings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          // Fallback to Paddle if API fails
          console.warn('[DynamicCheckout] Failed to fetch provider, using Paddle')
          setProvider('paddle')
          setLoading(false)
          return
        }

        const providers = await response.json()
        const activeProvider = providers.find((p: any) => p.is_active)

        if (!activeProvider) {
          // Fallback to Paddle if no active provider configured
          console.warn('[DynamicCheckout] No active provider in response, using Paddle')
          setProvider('paddle')
        } else {
          setProvider(activeProvider.provider_name)
        }
      } catch (err) {
        // Fallback to Paddle on any error
        const errorMsg = err instanceof Error ? err.message : 'Failed to load payment provider'
        console.warn('[Dynamic Checkout] Using Paddle as fallback:', errorMsg)
        setProvider('paddle')
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [onError])

  if (!PAYMENTS_ENABLED) return null

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">جاري تحضير الدفع...</span>
      </div>
    )
  }

  // Always default to Paddle if no provider selected
  if (!provider) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">جاري التحضير...</span>
      </div>
    )
  }

  if (error && provider !== 'paddle') {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-destructive">خطأ في معالجة الدفع</h3>
          <p className="text-sm text-foreground mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-yellow-700">لم يتم تكوين معالج الدفع</h3>
          <p className="text-sm text-foreground mt-1">يرجى الاتصال بالدعم الفني</p>
        </div>
      </div>
    )
  }

  // Render appropriate checkout component based on provider
  if (provider === 'paddle') {
    return (
      <PaddleCheckout
        productId={productId}
        customerEmail={customerEmail}
        onSuccess={onSuccess}
      />
    )
  }

  if (provider === 'stripe') {
    // Stripe is not the active provider, don't render
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-yellow-700">معالج الدفع غير مفعّل</h3>
          <p className="text-sm text-foreground mt-1">يرجى التواصل مع الدعم الفني لتفعيل الدفع عبر Stripe</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-destructive/10 border border-destructive rounded-lg p-6 flex items-start gap-3">
      <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-destructive">معالج دفع غير معروف</h3>
        <p className="text-sm text-foreground mt-1">معالج الدفع {provider} غير مدعوم</p>
      </div>
    </div>
  )
}
