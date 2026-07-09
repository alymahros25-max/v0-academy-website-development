'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { AlertCircle, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const StripeCheckout = dynamic(() => import('@/components/stripe-checkout'), { ssr: false })
const PaddleCheckout = dynamic(() => import('@/components/paddle-checkout'), { ssr: false })

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
    const fetchProvider = async () => {
      try {
        setLoading(true)
        
        const response = await fetch('/api/admin/payment-settings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch payment provider')
        }

        const providers = await response.json()
        const activeProvider = providers.find((p: any) => p.is_active)

        if (!activeProvider) {
          throw new Error('No active payment provider configured')
        }

        setProvider(activeProvider.provider_name)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load payment provider'
        setError(errorMsg)
        onError?.(errorMsg)
        console.error('[Dynamic Checkout] Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [onError])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">جاري تحضير الدفع...</span>
      </div>
    )
  }

  if (error) {
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
    return (
      <StripeCheckout
        productId={productId}
        onSuccess={onSuccess}
      />
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
