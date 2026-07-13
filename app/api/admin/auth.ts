import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple auth check - can be extended with Supabase
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')?.value

    // Check if admin token exists (temporary auth solution)
    // In production, verify against database
    if (!adminToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    return NextResponse.json({ 
      authenticated: true,
      role: 'admin'
    }, { status: 200 })
  } catch (error) {
    console.error('[v0] Admin auth error:', error)
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}

// Logout
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_token')

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Admin logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
