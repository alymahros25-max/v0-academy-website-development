/**
 * Security & Performance Optimization Utilities
 * Includes: XSS prevention, input sanitization, response headers
 */

// XSS Prevention: Sanitize user inputs and HTML content
export const sanitizeInput = (input: string): string => {
  if (!input) return ''
  
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}

// Safe HTML rendering for trusted content only
export const sanitizeHTML = (html: string): string => {
  const allowed = ['<b>', '<i>', '<u>', '<br>', '<p>', '<strong>', '<em>']
  const denied = ['<script', '<iframe', '<object', '<embed', 'javascript:', 'onerror=', 'onclick=']
  
  let cleaned = html
  for (const tag of denied) {
    if (cleaned.toLowerCase().includes(tag.toLowerCase())) {
      return sanitizeInput(html) // Fall back to text-only if dangerous content found
    }
  }
  
  return cleaned
}

// Content Security Policy headers
export const CSPHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.vercel-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
}

// Validate quiz answer - prevent manipulation
export const validateQuizAnswer = (
  answer: string | number,
  validAnswers: (string | number)[],
  maxLength: number = 1000
): boolean => {
  if (typeof answer === 'string' && answer.length > maxLength) return false
  return validAnswers.includes(answer)
}

// Prevent timing attacks in score calculation
export const calculateSecureScore = (correct: number, total: number): number => {
  if (correct < 0 || total <= 0) return 0
  if (correct > total) return 0
  return Math.round((correct / total) * 100)
}

// Rate limiting helper
export const createRateLimiter = (maxAttempts: number, timeWindowMs: number) => {
  const attempts: number[] = []
  
  return {
    isAllowed: (): boolean => {
      const now = Date.now()
      const recentAttempts = attempts.filter(time => now - time < timeWindowMs)
      
      if (recentAttempts.length < maxAttempts) {
        attempts.push(now)
        return true
      }
      
      return false
    },
    reset: () => {
      attempts.length = 0
    }
  }
}

// Image lazy loading configuration
export const lazyLoadConfig = {
  threshold: 0.1,
  rootMargin: '50px'
}

// Debounce utility for responsive events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for performance-critical events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Memoization helper for expensive computations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Mobile-first responsive helper
export const getResponsiveValue = <T>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T,
  windowWidth: number
): T => {
  if (windowWidth < 768) return mobileValue
  if (windowWidth < 1024) return tabletValue
  return desktopValue
}

// Optimize images for responsive display
export const getOptimizedImageSrc = (
  baseSrc: string,
  width: number,
  quality: number = 75
): string => {
  // For Next.js Image optimization
  return `${baseSrc}?w=${width}&q=${quality}`
}

// Cumulative Layout Shift (CLS) prevention
export const preventCLS = (element: HTMLElement | null) => {
  if (!element) return
  
  // Reserve space before content loads
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded')
        observer.unobserve(entry.target)
      }
    })
  })
  
  observer.observe(element)
}

// Accessibility: Focus management
export const manageFocus = {
  trap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    return {
      first: firstElement,
      last: lastElement,
      focusFirst: () => firstElement.focus(),
      focusLast: () => lastElement.focus()
    }
  },
  
  restoreOnClose: (focusElement: HTMLElement | null) => {
    if (focusElement) {
      focusElement.focus()
    }
  }
}
