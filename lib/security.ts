// Security utilities for the application

// Sanitize user input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/
  return phoneRegex.test(phone)
}

// Check for SQL injection patterns
export function containsSQLInjectionPattern(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(-{2}|\/\*|\*\/|;|;[\s]*$)/,
    /(UNION|CROSS JOIN|INNER JOIN|LEFT JOIN)/i,
  ]
  return sqlPatterns.some(pattern => pattern.test(input))
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const key = identifier

    if (!this.requests.has(key)) {
      this.requests.set(key, [now])
      return true
    }

    const timestamps = this.requests.get(key)!
    const recentTimestamps = timestamps.filter(t => now - t < this.windowMs)

    if (recentTimestamps.length < this.maxRequests) {
      recentTimestamps.push(now)
      this.requests.set(key, recentTimestamps)
      return true
    }

    return false
  }
}

// CSRF token validation
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Password strength validator
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('Password must be at least 8 characters long')

  if (/[a-z]/.test(password)) score++
  else feedback.push('Password must contain lowercase letters')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Password must contain uppercase letters')

  if (/[0-9]/.test(password)) score++
  else feedback.push('Password must contain numbers')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else feedback.push('Password must contain special characters')

  return { score, feedback }
}

// Security headers are emitted centrally by next.config.ts.
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
}

const securityUtilities = {
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  containsSQLInjectionPattern,
  RateLimiter,
  generateCSRFToken,
  checkPasswordStrength,
  securityHeaders,
}

export default securityUtilities
