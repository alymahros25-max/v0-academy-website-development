/**
 * Centralized routing configuration for all application URLs.
 * Ensures consistency across SSR, prefetch, and SEO generation.
 */

export const ROUTES = {
  // Core pages
  HOME: '/',
  QURAN: '/quran',
  ARABIC: '/arabic',
  ABOUT: '/about',
  TEACHERS: '/teachers',
  REVIEWS: '/reviews',

  // Content
  LIBRARY: '/library',
  LIBRARY_BOOK: (slug: string) => `/library/book/${slug}`,
  GAMES: '/games',
  FAQ: '/faq',
  CLASSROOM_MOMENTS: '/classroom-moments',
  CONTACT: '/contact',

  // Blog
  BLOG: '/blog',
  BLOG_ARTICLE: (slug: string) => `/blog/${slug}`,

  // User account
  ACCOUNT: '/account',

  // Admin
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_CMS: '/admin/cms',
  ADMIN_PAGES: '/admin/pages',
  ADMIN_THEME: '/admin/theme',
  ADMIN_USERS: '/admin/users',

  // Legal
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOT_FOUND: '/404',
} as const

/**
 * Legacy URL mappings for automatic 301 redirects.
 * Maps old paths to new canonical URLs.
 */
export const LEGACY_ROUTES: Record<string, string> = {
  // Example legacy routes - add as needed
  '/old-blog': '/blog',
  '/articles': '/blog',
  '/about-us': '/about',
  '/our-teachers': '/teachers',
  '/testimonials': '/reviews',
  '/library-old': '/library',
  '/book': '/library',
  '/moments': '/classroom-moments',
  '/videos': '/classroom-moments',
  '/contact-us': '/contact',
  '/faqs': '/faq',
  '/privacy-policy': '/privacy',
  '/terms-of-service': '/terms',
}

/**
 * Generate language-prefixed URL for multilingual routing.
 * Returns canonical URL for Arabic (no prefix), prefixed URLs for EN/FR.
 */
export function getLocalizedPath(
  path: string,
  lang: 'ar' | 'en' | 'fr' = 'ar'
): string {
  if (lang === 'ar') return path
  return `/${lang}${path}`
}

/**
 * Get all language variants of a URL for hreflang tags.
 */
export function getLanguageAlternates(path: string): Record<string, string> {
  return {
    ar: `https://quran-elhafez.com${path}`,
    en: `https://quran-elhafez.com/en${path}`,
    fr: `https://quran-elhafez.com/fr${path}`,
    'x-default': `https://quran-elhafez.com${path}`,
  }
}

/**
 * Check if a route should be indexed by search engines.
 */
export function isIndexableRoute(pathname: string): boolean {
  const noIndexPatterns = [
    /^\/admin/,
    /^\/api/,
    /^\/account$/,
    /\?.*debug/,
    /\.json$/,
  ]

  return !noIndexPatterns.some((pattern) => pattern.test(pathname))
}

/**
 * Get redirect target for legacy URLs, if applicable.
 */
export function getLegacyRedirect(pathname: string): string | null {
  return LEGACY_ROUTES[pathname] || null
}
