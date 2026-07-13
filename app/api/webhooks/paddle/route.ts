import { NextRequest, NextResponse } from 'next/server'
import { verifyPaddleWebhookSignature, parsePaddleWebhook } from '@/lib/paddle-client'

/**
 * Paddle Webhook Handler
 * Processes payment events from Paddle and updates orders and enrollments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('paddle-signature') || ''

    // Verify webhook signature
    const isValid = await verifyPaddleWebhookSignature(body, signature)
    if (!isValid) {
      console.warn('[Paddle Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse Paddle webhook data
    const formData = new URLSearchParams(body)
    const webhookData: Record<string, any> = {}
    
    for (const [key, value] of formData) {
      webhookData[key] = value
    }

    const alertName = webhookData.alert_name
    console.log('[Paddle Webhook] Received event:', alertName)

    // Handle different Paddle events
    switch (alertName) {
      case 'payment_succeeded':
      case 'order_completed':
        await handlePaymentSucceeded(webhookData)
        break

      case 'payment_failed':
      case 'order_failed':
        await handlePaymentFailed(webhookData)
        break

      case 'refund_created':
        await handleRefund(webhookData)
        break

      default:
        console.log('[Paddle Webhook] Unhandled event type:', alertName)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[Paddle Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful Paddle payment
 * Creates order and student enrollment
 */
async function handlePaymentSucceeded(data: Record<string, any>) {
  console.log('[Paddle] Processing payment success:', data.order_id)

  // Only process if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Paddle Webhook] Supabase not configured - skipping order creation')
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const transactionId = data.order_id || data.transaction_id
    const customerEmail = data.customer_email
    const amount = parseFloat(data.sale_gross || data.gross || '0')
    const customData = data.custom_data ? JSON.parse(data.custom_data) : {}

    // Extract product info from custom_data
    const productId = customData.product_id || data.product_id
    const quantity = customData.quantity || 1
    const locale = customData.locale || 'ar'

    if (!productId || !customerEmail) {
      console.warn('[Paddle] Missing product or customer info')
      return
    }

    // Create order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: `paddle_${transactionId}`, // Use paddle prefix to avoid conflicts
        stripe_payment_intent_id: transactionId,
        product_id: productId,
        category: productId.startsWith('quran_') ? 'quran' : 'arabic',
        sessions: quantity,
        amount_paid: amount,
        currency: data.currency || 'USD',
        customer_email: customerEmail,
        customer_id: data.customer_id,
        status: 'completed',
        payment_provider: 'paddle',
        completed_at: new Date().toISOString(),
        metadata: {
          paddle_transaction_id: transactionId,
          custom_data: customData,
        },
      })
      .select()
      .single()

    if (orderError) {
      console.error('[Paddle] Error creating order:', orderError)
      return
    }

    console.log('[Paddle] Order created:', orderData.id)

    // Create student enrollment
    const { error: enrollmentError } = await supabase
      .from('student_enrollments')
      .insert({
        order_id: orderData.id,
        student_email: customerEmail,
        student_name: data.customer_name,
        course_category: orderData.category,
        product_id: productId,
        total_sessions: quantity,
        sessions_used: 0,
        payment_provider: 'paddle',
        payment_status: 'completed',
        is_active: true,
      })

    if (enrollmentError) {
      console.error('[Paddle] Error creating enrollment:', enrollmentError)
      return
    }

    console.log('[Paddle] Student enrollment created for:', customerEmail)

    // TODO: Send confirmation email to student

  } catch (error) {
    console.error('[Paddle] Exception processing payment:', error)
  }
}

/**
 * Handle failed Paddle payment
 */
async function handlePaymentFailed(data: Record<string, any>) {
  console.log('[Paddle] Processing payment failure:', data.order_id)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Paddle Webhook] Supabase not configured')
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const transactionId = data.order_id || data.transaction_id

    // Update order status to failed
    const { error } = await supabase
      .from('orders')
      .update({ status: 'failed' })
      .eq('stripe_payment_intent_id', transactionId)

    if (error) {
      console.error('[Paddle] Error updating failed order:', error)
    }

    console.log('[Paddle] Order marked as failed')
  } catch (error) {
    console.error('[Paddle] Exception handling payment failure:', error)
  }
}

/**
 * Handle Paddle refund
 */
async function handleRefund(data: Record<string, any>) {
  console.log('[Paddle] Processing refund:', data.order_id)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Paddle Webhook] Supabase not configured')
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const transactionId = data.order_id || data.transaction_id

    // Update order status to refunded
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        status: 'refunded',
        refunded_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', transactionId)

    if (orderError) {
      console.error('[Paddle] Error updating refunded order:', orderError)
      return
    }

    // Mark enrollment as suspended
    const { error: enrollmentError } = await supabase
      .from('student_enrollments')
      .update({
        is_active: false,
        is_suspended: true,
        suspension_reason: 'Payment refunded',
      })
      .eq('order_id', transactionId)

    if (enrollmentError) {
      console.error('[Paddle] Error updating enrollment:', enrollmentError)
    }

    console.log('[Paddle] Refund processed successfully')
  } catch (error) {
    console.error('[Paddle] Exception handling refund:', error)
  }
}
