/**
 * Payment availability is deliberately opt-in.
 *
 * Keep both flags unset/false while payment is not publicly launched:
 * - NEXT_PUBLIC_PAYMENTS_ENABLED controls whether visitors see payment UI.
 * - PAYMENTS_ENABLED is checked on the server before creating checkout sessions.
 */
export const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true'

export function assertPaymentsEnabled(): void {
  if (process.env.PAYMENTS_ENABLED !== 'true') {
    throw new Error('Payments are currently disabled')
  }
}

export function isPaymentsEnabledOnServer(): boolean {
  return process.env.PAYMENTS_ENABLED === 'true'
}
