import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

/**
 * Stripe Webhook Handler
 * Processes payment events and updates database
 * Handles: checkout.session.completed, payment_intent.succeeded
 */
export async function POST(request: NextRequest) {
  // Skip processing if Stripe is not configured (e.g., during build)
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    console.warn('[Stripe Webhook] Stripe not configured, returning 200')
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature')
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    event = stripeInstance.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('[Stripe Webhook] Invalid signature:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      }
      case 'payment_intent.succeeded': {
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      }
      case 'charge.refunded': {
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe] Checkout session completed: ${session.id}`)

  // Only process if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Stripe Webhook] Supabase not configured - skipping order creation')
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

  const metadata = session.metadata
  const productId = metadata?.productId
  const sessions = metadata?.sessions
  const category = metadata?.category

  if (!productId) {
    console.warn('[Stripe] No productId in session metadata')
    return
  }

    // Create order/subscription record in database
    const { error } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        product_id: productId,
        category: category,
        sessions: parseInt(sessions || '0'),
        amount_paid: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        customer_email: session.customer_email,
        customer_id: session.customer,
        status: 'completed',
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('[Stripe] Error creating order record:', error)
    } else {
      console.log(`[Stripe] Order created for product: ${productId}`)
    }
  } catch (error) {
    console.error('[Stripe] Error saving order to database:', error)
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Stripe] Payment intent succeeded: ${paymentIntent.id}`)
  // Additional payment processing if needed
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`[Stripe] Charge refunded: ${charge.id}`)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Stripe Webhook] Supabase not configured - skipping refund update')
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update order status to refunded
    const { error } = await supabase
      .from('orders')
      .update({ status: 'refunded' })
      .eq('stripe_payment_intent_id', charge.payment_intent as string)

    if (error) {
      console.error('[Stripe] Error updating refunded order:', error)
    } else {
      console.log(`[Stripe] Order marked as refunded`)
    }
  } catch (error) {
    console.error('[Stripe] Error updating refunded order:', error)
  }
}
