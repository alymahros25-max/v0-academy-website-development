/**
 * Link prefetching and preconnection utilities for optimal mobile performance.
 * Reduces time to interactive and minimizes rendering delays.
 */

/**
 * Preconnect to external domains to reduce connection overhead.
 * Should be called for critical external resources (Supabase, CDNs, etc).
 */
export function generatePreconnectLinks(): string[] {
  return [
    '<link rel="preconnect" href="https://xtfyrskkoewanmkcfixw.supabase.co" />',
    '<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />',
    '<link rel="dns-prefetch" href="https://img.youtube.com" />',
  ]
}

/**
 * Get prefetch strategy for a given route.
 * Different routes get different prefetch priorities based on user journey.
 */
export function getPrefetchStrategy(pathname: string): 'render' | 'viewport' | null {
  // Routes that should be eagerly prefetched
  const eagerPrefetch = [
    '/',
    '/quran',
    '/arabic',
    '/about',
    '/blog',
  ]

  // Routes that should only be prefetched when in viewport
  const viewportPrefetch = [
    '/games',
    '/faq',
    '/teachers',
    '/reviews',
  ]

  if (eagerPrefetch.includes(pathname)) {
    return 'render'
  }

  if (viewportPrefetch.includes(pathname)) {
    return 'viewport'
  }

  return null
}

/**
 * Critical paths that should be prefetched immediately on app load.
 * This helps with navigation speed for high-value pages.
 */
export const CRITICAL_PREFETCH_PATHS = [
  '/',
  '/quran',
  '/arabic',
  '/account',
]

/**
 * Prefetch images that are commonly used across pages.
 * Reduces CLS and improves perceived performance.
 */
export function prefetchCriticalImages(): string[] {
  return [
    '/images/hero-children.jpg',
    '/images/hero-quran.jpg',
    '/images/hero-arabic.jpg',
    '/images/logo.png',
  ]
}

/**
 * Get prefetch hint tags for HTML head.
 */
export function generatePrefetchHints(currentPath: string): string[] {
  const hints: string[] = []

  // Prefetch next likely pages based on current location
  const prefetchMap: Record<string, string[]> = {
    '/': ['/quran', '/arabic', '/about'],
  '/quran': ['/arabic', '/teachers'],
  '/arabic': ['/quran', '/teachers'],
    '/blog': ['/blog/', '/contact'],
    '/account': ['/'],
  }

  const routesToPrefetch = prefetchMap[currentPath] || []

  routesToPrefetch.forEach((route) => {
    hints.push(`<link rel="prefetch" href="${route}" as="document" />`)
  })

  return hints
}

/**
 * Mobile-specific optimization: Defer non-critical resources.
 */
export function isDeferredResource(url: string): boolean {
  const deferredPatterns = [
    /analytics/,
    /tracking/,
    /ads/,
    /comments/,
    /social-share/,
    /third-party/,
  ]

  return deferredPatterns.some((pattern) => pattern.test(url))
}

/**
 * Calculate optimal prefetch batch size based on network conditions.
 * Can be used with requestIdleCallback for progressive enhancement.
 */
export function getOptimalPrefetchBatchSize(
  networkConnection?: any
): number {
  // Default to conservative prefetch size
  let batchSize = 3

  if (typeof navigator !== 'undefined' && (navigator as any).connection) {
    const connection = (navigator as any).connection
    const effectiveType = connection.effectiveType

    // Adjust based on network speed
    switch (effectiveType) {
      case '4g':
        batchSize = 8
        break
      case '3g':
        batchSize = 3
        break
      case '2g':
        batchSize = 1
        break
      default:
        batchSize = 4
    }
  }

  return batchSize
}
