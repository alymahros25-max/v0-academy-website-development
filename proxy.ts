import { NextRequest, NextResponse } from 'next/server'
import { LEGACY_ROUTES, getLocalizedPath } from '@/lib/routing-config'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ============================================================
  // 1. LEGACY REDIRECT HANDLING (301 Permanent Redirects)
  // ============================================================
  const legacyTarget = LEGACY_ROUTES[pathname]
  if (legacyTarget) {
    // Preserve language prefix if it exists
    let redirectPath = legacyTarget

    // Check if current path has language prefix
    const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
    if (langMatch && langMatch[1] !== 'ar') {
      const lang = langMatch[1]
      redirectPath = getLocalizedPath(legacyTarget, lang as 'en' | 'fr')
    }

    return NextResponse.redirect(
      new URL(redirectPath, request.url),
      { status: 301 } // Permanent redirect
    )
  }

  // ============================================================
  // 2. MULTILINGUAL ROUTING CONSISTENCY
  // Ensure language prefixes are handled consistently
  // ============================================================
  if (pathname === '/en' || pathname === '/fr') {
    // Redirect language root to home
    return NextResponse.redirect(new URL(pathname === '/en' ? '/en/' : '/fr/', request.url))
  }

  // ============================================================
  // 3. SECURITY HEADERS
  // ============================================================
  const response = NextResponse.next()

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Enable XSS filtering in older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy (formerly Feature-Policy)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=()'
  )

  // Content Security Policy (CSP)
  const cspHeader =
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-analytics.com; " +
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' fonts.gstatic.com; " +
    "connect-src 'self' *.supabase.co *.vercel-analytics.com; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self'"

  response.headers.set('Content-Security-Policy', cspHeader)

  // Strict Transport Security (HSTS)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // Cross-Origin Policies
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  return response
}

// Only run middleware on specific paths for better performance
export const config = {
  matcher: [
    // Apply to all paths except Next.js internals and static assets
    '/((?!_next|_vercel|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico|ttf|woff|woff2)$).*)',
  ],
}
