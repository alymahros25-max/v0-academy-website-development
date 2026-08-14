import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/api-auth'

/**
 * GET /api/admin/orders
 * Fetch all orders from Supabase
 * Requires admin authentication
 */
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Orders API] Missing Supabase credentials')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all orders sorted by date (newest first)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('[Orders API] Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: error.message },
        { status: 500 }
      )
    }

    // Calculate summary statistics
    const summary = {
      total_orders: orders?.length || 0,
      total_revenue: (orders || []).reduce((sum, order) => {
        return order.status === 'completed' ? sum + (order.amount_paid || 0) : sum
      }, 0),
      completed_orders: (orders || []).filter(o => o.status === 'completed').length,
      refunded_orders: (orders || []).filter(o => o.status === 'refunded').length,
      pending_orders: (orders || []).filter(o => o.status === 'pending').length,
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      summary,
    })
  } catch (error) {
    console.error('[Orders API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/orders
 * Create a new order (usually handled by Stripe webhook, but available for admin)
 */
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()

    const { data, error } = await supabase
      .from('orders')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create order', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order: data?.[0] })
  } catch (error) {
    console.error('[Orders API] POST Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
