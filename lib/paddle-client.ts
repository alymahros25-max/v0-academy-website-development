import 'server-only'

import { getPaymentProvider } from './payment-config'

/**
 * Initialize Paddle client with dynamic API key from database
 * Ensures we're using the latest configuration without restart
 */
export async function initializePaddleClient() {
  const paddleSettings = await getPaymentProvider('paddle')

  if (!paddleSettings || !paddleSettings.is_active) {
    throw new Error('Paddle payment provider is not active or configured')
  }

  if (!paddleSettings.api_key) {
    throw new Error('Paddle API key is not configured')
  }

  return {
    apiKey: paddleSettings.api_key,
    vendorId: paddleSettings.vendor_id,
    settings: paddleSettings,
  }
}

/**
 * Create a Paddle checkout session for a product
 * Returns the checkout URL for redirect or iframe embed
 */
export async function createPaddleCheckoutSession(
  productId: string,
  quantity: number = 1,
  customerEmail: string,
  locale: string = 'ar'
) {
  const paddle = await initializePaddleClient()

  if (!paddle.vendorId) {
    throw new Error('Paddle Vendor ID is not configured')
  }

  try {
    // Paddle checkout URL format
    // Using Paddle's inline checkout or custom form
    const checkoutData = {
      vendor_id: paddle.vendorId,
      product_id: productId,
      quantity: quantity,
      customer_email: customerEmail,
      // Metadata for tracking
      custom_data: JSON.stringify({
        product_id: productId,
        quantity: quantity,
        locale: locale,
        timestamp: new Date().toISOString(),
      }),
      // Success and error URLs
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-success?provider=paddle`,
      error_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-error?provider=paddle`,
    }

    console.log('[Paddle] Creating checkout session:', { productId, customerEmail, quantity })

    // Return checkout data - frontend will handle the actual checkout
    return checkoutData
  } catch (error) {
    console.error('[Paddle] Error creating checkout session:', error)
    throw error
  }
}

/**
 * Verify Paddle webhook signature
 * Ensures the webhook came from Paddle
 */
export async function verifyPaddleWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const paddle = await initializePaddleClient()

  if (!paddle.settings.webhook_secret) {
    console.error('[Paddle] Webhook secret is not configured')
    return false
  }

  try {
    const crypto = require('crypto')
    
    // Paddle uses HMAC SHA1 for webhook signatures
    const hash = crypto
      .createHmac('sha1', paddle.settings.webhook_secret)
      .update(body)
      .digest('base64')

    const isValid = hash === signature
    
    if (!isValid) {
      console.warn('[Paddle] Invalid webhook signature')
    }

    return isValid
  } catch (error) {
    console.error('[Paddle] Error verifying webhook signature:', error)
    return false
  }
}

/**
 * Parse Paddle webhook payload
 */
export function parsePaddleWebhook(data: Record<string, any>) {
  return {
    event_type: data.alert_name,
    transaction_id: data.order_id,
    product_id: data.product_id,
    customer_email: data.customer_email,
    amount: parseFloat(data.sale_gross || data.gross || '0'),
    currency: data.currency,
    status: data.status,
    custom_data: data.custom_data ? JSON.parse(data.custom_data) : {},
    timestamp: data.event_time,
  }
}

/**
 * Get Paddle subscription/transaction status
 * Can be used to verify payment status
 */
export async function getPaddleTransactionStatus(transactionId: string) {
  const paddle = await initializePaddleClient()

  if (!paddle.apiKey) {
    throw new Error('Paddle API key is not configured')
  }

  try {
    // Paddle API v2 endpoint for transactions
    const response = await fetch(`https://api.paddle.com/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paddle.apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Paddle API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data // Paddle returns data in .data property

  } catch (error) {
    console.error('[Paddle] Error fetching transaction status:', error)
    throw error
  }
}
