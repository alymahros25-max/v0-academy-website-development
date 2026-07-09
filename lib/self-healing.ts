/**
 * Self-healing utilities for automatic retry and degraded mode fallbacks.
 * Provides intelligent error recovery for data fetching and route handling.
 */

export interface RetryConfig {
  maxRetries?: number
  initialDelayMs?: number
  backoffMultiplier?: number
  timeoutMs?: number
  shouldRetry?: (error: any) => boolean
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelayMs: 300,
  backoffMultiplier: 2,
  timeoutMs: 10000,
  shouldRetry: (error) => {
    // Retry on network errors and 5xx server errors
    return (
      error instanceof TypeError || // Network error
      (error?.status >= 500 && error?.status < 600)
    )
  },
}

/**
 * Attempt an async operation with automatic retry and exponential backoff.
 * Returns null if all retries fail instead of throwing.
 */
export async function attemptWithRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T | null> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  let lastError: any

  for (let attempt = 0; attempt <= mergedConfig.maxRetries; attempt++) {
    try {
      return await Promise.race([
        operation(),
        new Promise<T>((_, reject) =>
          setTimeout(
            () => reject(new Error('Operation timeout')),
            mergedConfig.timeoutMs
          )
        ),
      ])
    } catch (error) {
      lastError = error

      if (
        attempt < mergedConfig.maxRetries &&
        mergedConfig.shouldRetry(error)
      ) {
        const delayMs =
          mergedConfig.initialDelayMs *
          Math.pow(mergedConfig.backoffMultiplier, attempt)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        continue
      }

      // No more retries or shouldn't retry this error
      break
    }
  }

  console.error('[self-healing] All retries exhausted:', lastError)
  return null
}

/**
 * Fetch with automatic retry and error handling.
 * Returns parsed JSON or null on failure.
 */
export async function fetchWithRetry<T>(
  url: string,
  init?: RequestInit,
  config?: RetryConfig
): Promise<T | null> {
  return attemptWithRetry(
    async () => {
      const response = await fetch(url, init)

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`)
        ;(error as any).status = response.status
        throw error
      }

      return response.json() as Promise<T>
    },
    config
  )
}

/**
 * Cache with TTL (time-to-live) for in-memory data caching.
 * Useful for avoiding excessive API calls during SSR.
 */
export class CacheWithTTL<T> {
  private cache = new Map<string, { data: T; expiresAt: number }>()

  set(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }
}

/**
 * Queue for managing background operations with retry logic.
 */
export class OperationQueue {
  private queue: Array<{
    id: string
    operation: () => Promise<void>
    retries: number
    maxRetries: number
  }> = []

  private processing = false

  async enqueue(
    operation: () => Promise<void>,
    maxRetries: number = 3,
    id?: string
  ): Promise<string> {
    const operationId = id || `${Date.now()}-${Math.random()}`

    this.queue.push({
      id: operationId,
      operation,
      retries: 0,
      maxRetries,
    })

    this.processQueue()
    return operationId
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (!task) break

      try {
        await task.operation()
      } catch (error) {
        if (task.retries < task.maxRetries) {
          task.retries++
          this.queue.push(task)
          console.warn(
            `[OperationQueue] Retrying ${task.id} (attempt ${task.retries})`
          )
        } else {
          console.error(`[OperationQueue] Failed ${task.id} after retries`)
        }
      }

      // Small delay between operations
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    this.processing = false
  }
}

/**
 * Graceful degradation helper for optional features.
 * If primary operation fails, fallback is returned instead.
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await primary()
  } catch (error) {
    console.warn(
      `[self-healing] Using fallback for ${context || 'operation'}:`,
      error
    )
    return fallback
  }
}

/**
 * Preload critical resources to avoid layout shift and improve CLS.
 */
export function preloadResource(
  url: string,
  type: 'image' | 'font' | 'script' | 'style'
): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url

  switch (type) {
    case 'image':
      link.as = 'image'
      break
    case 'font':
      link.as = 'font'
      link.crossOrigin = 'anonymous'
      break
    case 'script':
      link.as = 'script'
      break
    case 'style':
      link.as = 'style'
      break
  }

  document.head.appendChild(link)
}
