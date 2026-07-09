import 'server-only'

import { createClient } from '@supabase/supabase-js'

export type PaymentProvider = 'stripe' | 'paddle' | 'paytabs'

export interface PaymentSettings {
  id: string
  provider_name: PaymentProvider
  api_key: string
  secret_key: string | null
  merchant_id: string | null
  vendor_id: string | null
  webhook_secret: string | null
  webhook_url: string | null
  is_active: boolean
  currency: string
  min_amount: number
  max_amount: number
  support_email: string | null
  support_url: string | null
  created_at: string
  updated_at: string
  last_verified_at: string | null
}

/**
 * Get the currently active payment provider configuration
 * Fetches from Supabase database with Paddle as fallback
 */
export async function getActivePaymentProvider(): Promise<PaymentSettings | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Payment Config] Missing Supabase credentials, using Paddle as default')
    return getDefaultPaddleProvider()
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) {
      console.warn('[Payment Config] No active provider configured, using Paddle as default:', error.message)
      return getDefaultPaddleProvider()
    }

    return data as PaymentSettings
  } catch (error) {
    console.warn('[Payment Config] Exception fetching provider, using Paddle as default:', error)
    return getDefaultPaddleProvider()
  }
}

/**
 * Default Paddle provider configuration (fallback)
 */
function getDefaultPaddleProvider(): PaymentSettings {
  return {
    id: 'default-paddle',
    provider_name: 'paddle',
    api_key: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || 'not-configured',
    secret_key: null,
    merchant_id: null,
    vendor_id: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || 'not-configured',
    webhook_secret: null,
    webhook_url: null,
    is_active: true,
    currency: 'USD',
    min_amount: 0.5,
    max_amount: 99999.99,
    support_email: null,
    support_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_verified_at: null,
  }
}

/**
 * Get a specific payment provider configuration by name
 */
export async function getPaymentProvider(providerName: PaymentProvider): Promise<PaymentSettings | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Payment Config] Missing Supabase credentials')
    return null
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('provider_name', providerName)
      .single()

    if (error) {
      console.error(`[Payment Config] Error fetching ${providerName}:`, error)
      return null
    }

    return data as PaymentSettings
  } catch (error) {
    console.error('[Payment Config] Exception fetching provider:', error)
    return null
  }
}

/**
 * Get all payment providers configuration
 */
export async function getAllPaymentProviders(): Promise<PaymentSettings[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Payment Config] Missing Supabase credentials')
    return []
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .order('provider_name', { ascending: true })

    if (error) {
      console.error('[Payment Config] Error fetching all providers:', error)
      return []
    }

    return data as PaymentSettings[]
  } catch (error) {
    console.error('[Payment Config] Exception fetching all providers:', error)
    return []
  }
}

/**
 * Switch active payment provider
 * Deactivates current provider and activates the new one
 */
export async function switchActivePaymentProvider(providerName: PaymentProvider): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Payment Config] Missing Supabase credentials')
    return false
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Deactivate all providers
    const { error: deactivateError } = await supabase
      .from('payment_settings')
      .update({ is_active: false })
      .neq('provider_name', providerName)

    if (deactivateError) {
      console.error('[Payment Config] Error deactivating providers:', deactivateError)
      return false
    }

    // Activate the selected provider
    const { error: activateError } = await supabase
      .from('payment_settings')
      .update({ is_active: true })
      .eq('provider_name', providerName)

    if (activateError) {
      console.error('[Payment Config] Error activating provider:', activateError)
      return false
    }

    console.log(`[Payment Config] Switched to ${providerName}`)
    return true
  } catch (error) {
    console.error('[Payment Config] Exception switching provider:', error)
    return false
  }
}

/**
 * Update payment provider settings
 */
export async function updatePaymentSettings(
  providerName: PaymentProvider,
  updates: Partial<PaymentSettings>
): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Payment Config] Missing Supabase credentials')
    return false
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('payment_settings')
      .update(updates)
      .eq('provider_name', providerName)

    if (error) {
      console.error(`[Payment Config] Error updating ${providerName}:`, error)
      return false
    }

    console.log(`[Payment Config] Updated ${providerName} settings`)
    return true
  } catch (error) {
    console.error('[Payment Config] Exception updating settings:', error)
    return false
  }
}
