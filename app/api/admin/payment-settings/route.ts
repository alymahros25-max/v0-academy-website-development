import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getAllPaymentProviders, switchActivePaymentProvider, updatePaymentSettings } from '@/lib/payment-config'

/**
 * GET /api/admin/payment-settings
 * Fetch all payment provider settings
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const providers = await getAllPaymentProviders()
    
    if (!providers || providers.length === 0) {
      return NextResponse.json(
        { error: 'No payment providers configured' },
        { status: 404 }
      )
    }

    // Don't expose full keys to client - only return masked versions
    const maskedProviders = providers.map(p => ({
      ...p,
      api_key: maskApiKey(p.api_key),
      secret_key: p.secret_key ? maskApiKey(p.secret_key) : null,
      webhook_secret: p.webhook_secret ? maskApiKey(p.webhook_secret) : null,
    }))

    return NextResponse.json(maskedProviders)
  } catch (error) {
    console.error('[Payment Settings API] Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/payment-settings
 * Update payment provider settings or switch active provider
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const { action, provider_name, updates } = body

    if (!action || !provider_name) {
      return NextResponse.json(
        { error: 'Missing action or provider_name' },
        { status: 400 }
      )
    }

    if (action === 'switch_provider') {
      const success = await switchActivePaymentProvider(provider_name)
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to switch provider' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: `Switched to ${provider_name}` })
    }

    if (action === 'update_provider') {
      if (!updates) {
        return NextResponse.json(
          { error: 'Missing updates object' },
          { status: 400 }
        )
      }

      const success = await updatePaymentSettings(provider_name, updates)

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update provider settings' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'Settings updated' })
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Payment Settings API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Mask API key for display - show only first and last 4 characters
 */
function maskApiKey(key: string | null): string {
  if (!key) return ''
  if (key.length <= 8) return '*'.repeat(key.length)
  return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4)
}
