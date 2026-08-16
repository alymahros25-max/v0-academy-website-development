'use server'

import { headers } from 'next/headers'

import { stripe } from '../../lib/stripe'
import { PRODUCTS } from '../../lib/products'

export async function startCheckoutSession(productId: string, locale: string = 'ar') {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Get localized product name and description
  const productName = typeof product.name === 'object' ? product.name[locale as keyof typeof product.name] || product.name.ar : product.name
  const productDescription = typeof product.description === 'object' ? product.description[locale as keyof typeof product.description] || product.description.ar : product.description

  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: productDescription,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      productId: product.id,
      category: product.category,
      sessions: String(product.sessions),
    },
  })

  if (!session.client_secret) {
    throw new Error('Stripe did not return a client secret')
  }

  return session.client_secret
}
