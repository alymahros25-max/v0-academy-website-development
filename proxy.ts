import { NextRequest, NextResponse } from 'next/server'
import { LEGACY_ROUTES, getLocalizedPath } from '@/lib/routing-config'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ============================================================
  // 0. ADMIN ROUTES BYPASS - Prevent redirect loops
  // ============================================================
  // Completely bypass multilingual and redirect logic for all admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/ac')) {
    // Allow admin routes to pass through without any redirects or locale prefixing
    const response = NextResponse.next()
    
    // Still apply security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(self), payment=()'
    )
    const cspHeader =
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-analytics.com https://www.googletagmanager.com; " +
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' fonts.gstatic.com; " +
      "connect-src 'self' *.supabase.co wss://*.supabase.co *.vercel-analytics.com; " +
      // LOCKED: frame-src must include YouTube to allow the video player iframe to load.
      // Do NOT remove youtube.com or youtube-nocookie.com during future updates.
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://drive.google.com https://docs.google.com; " +
      "child-src https://drive.google.com https://docs.google.com; " +
      "frame-ancestors 'self'; " +
      "base-uri 'self'; " +
      "form-action 'self'"
    response.headers.set('Content-Security-Policy', cspHeader)
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    
    return response
  }

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
  // Do not redirect /en or /fr here: Next.js trailing-slash normalization
  // can send the request back through this proxy and create a redirect loop.
  // ============================================================

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
  // LOCKED: frame-src must include YouTube to allow the video player iframe to load.
  // Do NOT remove youtube.com or youtube-nocookie.com during future updates.
  const cspHeader =
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-analytics.com https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' fonts.gstatic.com; " +
    "connect-src 'self' *.supabase.co wss://*.supabase.co *.vercel-analytics.com; " +
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://drive.google.com https://docs.google.com; " +
      "child-src https://drive.google.com https://docs.google.com; " +
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
  // NOTE: Cross-Origin-Embedder-Policy is intentionally omitted here because
  // 'require-corp' blocks YouTube iframes from loading. It is only set on admin routes.
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  return response
}

// Only run middleware on specific paths for better performance
export const config = {
  matcher: [
    // Apply to all paths except Next.js internals and static assets
    // Admin routes are explicitly included here but handled with bypass logic
    '/((?!_next|_vercel|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico|ttf|woff|woff2)$).*)',
  ],
}
