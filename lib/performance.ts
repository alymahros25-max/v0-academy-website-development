// Performance optimization utilities

// Debounce function for form inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Image optimization suggestions
export const imageOptimizations = {
  quality: 75, // JPEG quality
  formats: ['webp', 'jpg'], // Preferred formats
  sizes: [640, 750, 828, 1024, 1280, 1536], // Responsive sizes
}

// Cache strategy helpers
export class CacheManager {
  static setCache(key: string, value: any, expirationMinutes: number = 60): void {
    const expirationTime = Date.now() + expirationMinutes * 60 * 1000
    sessionStorage.setItem(key, JSON.stringify({
      value,
      expirationTime,
    }))
  }

  static getCache(key: string): any | null {
    const cached = sessionStorage.getItem(key)
    if (!cached) return null

    const { value, expirationTime } = JSON.parse(cached)
    if (Date.now() > expirationTime) {
      sessionStorage.removeItem(key)
      return null
    }

    return value
  }

  static clearCache(key: string): void {
    sessionStorage.removeItem(key)
  }

  static clearAllCache(): void {
    sessionStorage.clear()
  }
}

// Resource hints for Next.js
export const resourceHints = {
  preload: [
    // Add fonts or critical resources
  ],
  prefetch: [
    '/api/data',
    '/blog',
    '/quran',
  ],
  preconnect: [
    'https://cdn.jsdelivr.net',
    'https://fonts.googleapis.com',
  ],
}

// Web Vitals monitoring
export interface WebVital {
  name: string
  value: number
  rating: 'good' | 'needs improvement' | 'poor'
}

export function getWebVitalRating(name: string, value: number): 'good' | 'needs improvement' | 'poor' {
  const thresholds: Record<string, { good: number; needsImprovement: number }> = {
    'LCP': { good: 2500, needsImprovement: 4000 },
    'FID': { good: 100, needsImprovement: 300 },
    'CLS': { good: 0.1, needsImprovement: 0.25 },
  }

  const threshold = thresholds[name]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs improvement'
  return 'poor'
}

// Lazy loading images
export const lazyLoadingConfig = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1,
}

// Font optimization
export const fontOptimization = {
  'display': 'swap', // Fallback font while loading
  'preload': true,
}

// Bundle size optimization tips
export const bundleSizeOptimizations = {
  dynamic: true, // Use dynamic imports
  ssr: true, // Server-side rendering
  loading: 'lazy', // Lazy load components
}

export default {
  debounce,
  throttle,
  CacheManager,
  imageOptimizations,
  resourceHints,
  getWebVitalRating,
  lazyLoadingConfig,
  fontOptimization,
  bundleSizeOptimizations,
}
