'use client'

import { useEffect, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useI18n } from '@/lib/i18n'

import { startCheckoutSession } from '@/app/actions/stripe'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface CheckoutProps {
  productId: string
  onSuccess?: () => void
  onCancel?: () => void
}


export default function Checkout({ productId, onSuccess, onCancel }: CheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const { locale } = useI18n()

  useEffect(() => {
    let cancelled = false
    startCheckoutSession(productId, locale).then((secret) => {
      if (!cancelled) setClientSecret(secret)
    })
    return () => {
      cancelled = true
    }
  }, [productId, locale])

  return (
    <div id="stripe-checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret,
          onComplete: onSuccess,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
