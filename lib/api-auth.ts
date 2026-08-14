import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function requireAdmin() {
  const authenticated = await verifyAdminSession()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
