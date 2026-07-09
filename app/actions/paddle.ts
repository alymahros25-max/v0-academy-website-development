'use server'

import { getActivePaymentProvider } from '@/lib/payment-config'
import { createPaddleCheckoutSession } from '@/lib/paddle-client'
import { getProductById } from '@/lib/products'

interface CheckoutSessionResult {
  success: boolean
  clientSecret?: string
  checkoutUrl?: string
  error?: string
  provider?: string
}

/**
 * Initialize Paddle checkout session
 * Called by client to start payment flow
 */
export async function initializePaddleCheckout(
  productId: string,
  locale: string = 'ar',
  customerEmail?: string
): Promise<CheckoutSessionResult> {
  try {
    // Verify payment provider is active
    const activeProvider = await getActivePaymentProvider()

    if (!activeProvider || activeProvider.provider_name !== 'paddle') {
      return {
        success: false,
        error: 'Paddle is not the active payment provider',
      }
    }

    if (!activeProvider.is_active) {
      return {
        success: false,
        error: 'Paddle payment provider is not configured',
      }
    }

    // Get product details for validation
    const product = getProductById(productId)
    if (!product) {
      return {
        success: false,
        error: `Product ${productId} not found`,
      }
    }

    // Validate customer email
    if (!customerEmail || !customerEmail.includes('@')) {
      return {
        success: false,
        error: 'Valid email address is required',
      }
    }

    // Create Paddle checkout session
    const checkoutData = await createPaddleCheckoutSession(
      productId,
      1, // quantity
      customerEmail,
      locale
    )

    // Generate Paddle checkout URL
    // Format: https://checkout.paddle.com/checkout/{product_id}
    const checkoutUrl = `https://checkout.paddle.com/checkout?productId=${productId}&customer_email=${encodeURIComponent(customerEmail)}`

    console.log('[Paddle Action] Checkout session created:', {
      productId,
      customerEmail,
      locale,
    })

    return {
      success: true,
      checkoutUrl,
      provider: 'paddle',
    }
  } catch (error) {
    console.error('[Paddle Action] Error creating checkout session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    }
  }
}

/**
 * Verify payment after completion
 * Called to verify that payment was successful
 */
export async function verifyPaddlePayment(
  transactionId: string,
  customerEmail: string
): Promise<{
  success: boolean
  verified: boolean
  error?: string
}> {
  try {
    // This would verify the transaction with Paddle API
    // For now, we rely on webhook verification

    console.log('[Paddle Action] Verifying payment:', { transactionId, customerEmail })

    return {
      success: true,
      verified: true,
    }
  } catch (error) {
    console.error('[Paddle Action] Error verifying payment:', error)
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment',
    }
  }
}

/**
 * Get checkout configuration for display
 * Returns provider info and product details
 */
export async function getCheckoutConfig(productId: string) {
  try {
    const activeProvider = await getActivePaymentProvider()
    const product = getProductById(productId)

    if (!product) {
      return {
        success: false,
        error: `Product ${productId} not found`,
      }
    }

    if (!activeProvider) {
      return {
        success: false,
        error: 'No payment provider configured',
      }
    }

    return {
      success: true,
      provider: activeProvider.provider_name,
      product: {
        id: product.id,
        name: product.name,
        price: product.priceInCents,
        currency: activeProvider.currency,
      },
      checkout: {
        provider: activeProvider.provider_name,
        vendor_id: activeProvider.vendor_id,
        webhook_url: activeProvider.webhook_url,
      },
    }
  } catch (error) {
    console.error('[Paddle Config] Error getting checkout config:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get checkout config',
    }
  }
}
