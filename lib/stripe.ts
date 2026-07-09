import 'server-only'

import Stripe from 'stripe'
import { getProductById } from './products'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Server-side price validation
 * Prevents client-side price manipulation by looking up actual price from products array
 */
export function validateProductPrice(productId: string, clientPriceInCents: number): boolean {
  const product = getProductById(productId)
  if (!product) return false
  return product.priceInCents === clientPriceInCents
}
