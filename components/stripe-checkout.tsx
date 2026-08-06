'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useI18n } from '@/lib/i18n'

import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

interface CheckoutProps {
  productId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function Checkout({ productId, onSuccess, onCancel }: CheckoutProps) {
  const { locale } = useI18n()

  const startCheckoutSessionForProduct = useCallback(
    async () => {
      const clientSecret = await startCheckoutSession(productId, locale)
      return clientSecret
    },
    [productId, locale],
  )

  return (
    <div id="stripe-checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ 
          clientSecret: startCheckoutSessionForProduct,
          onComplete: onSuccess,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
