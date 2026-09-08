import { NextRequest, NextResponse } from 'next/server'
import { LEGACY_ROUTES, getLocalizedPath } from '@/lib/routing-config'
import { verifySessionValue } from '@/lib/admin-auth'

const rateBuckets = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 120

function getClientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

function isRateLimited(request: NextRequest): boolean {
  const now = Date.now()
  const key = `${getClientKey(request)}:${request.nextUrl.pathname}`
  const current = rateBuckets.get(key)
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > RATE_LIMIT
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/api/') && isRateLimited(request)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } })
  }

  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
    if (!verifySessionValue(request.cookies.get('admin_session')?.value ?? '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/ac')) {
    if (
      pathname.startsWith('/admin') &&
      pathname !== '/admin/login' &&
      !verifySessionValue(request.cookies.get('admin_session')?.value ?? '')
    ) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  const legacyTarget = LEGACY_ROUTES[pathname]
  if (legacyTarget) {
    let redirectPath = legacyTarget
    const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
    if (langMatch && langMatch[1] !== 'ar') {
      redirectPath = getLocalizedPath(legacyTarget, langMatch[1] as 'en' | 'fr')
    }
    return NextResponse.redirect(new URL(redirectPath, request.url), { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico|ttf|woff|woff2)$).*)'],
}
