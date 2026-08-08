/**
 * Performance Monitoring Utilities
 * Tracks and reports Web Vitals (LCP, FID/INP, CLS)
 */

interface WebVital {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

/**
 * Report Web Vital metric
 */
export function reportWebVital(vital: WebVital) {
  if (typeof window === 'undefined') return

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${vital.name}: ${vital.value.toFixed(2)}ms (${vital.rating})`)
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: send to analytics service
    // analytics.trackWebVital(vital)
  }
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(callback: (lcp: number) => void) {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    if (entries.length > 0) {
      const lastEntry = entries[entries.length - 1]
      callback((lastEntry as PerformancePaintTiming).startTime)
    }
  })

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (e) {
    // Browser doesn't support LCP
  }

  return observer
}

/**
 * Measure First Input Delay (FID) / Interaction to Next Paint (INP)
 */
export function measureInteractivity(callback: (delay: number) => void) {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      callback(entry.processingDuration || 0)
    })
  })

  try {
    observer.observe({
      entryTypes: ['first-input', 'event'],
      buffered: true,
    })
  } catch (e) {
    // Browser doesn't support FID/INP
  }

  return observer
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(callback: (cls: number) => void) {
  if (typeof window === 'undefined') return

  let clsValue = 0
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
        callback(clsValue)
      }
    })
  })

  try {
    observer.observe({ entryTypes: ['layout-shift'] })
  } catch (e) {
    // Browser doesn't support CLS
  }

  return observer
}

/**
 * Measure component render time
 */
export function measureComponentRender(componentName: string) {
  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const duration = endTime - startTime

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Render] ${componentName}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }
}

/**
 * Measure API response time
 */
export function measureAPICall(endpoint: string) {
  const startTime = performance.now()

  return (success: boolean) => {
    const endTime = performance.now()
    const duration = endTime - startTime
    const status = success ? '✓' : '✗'

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${status} ${endpoint}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }
}

/**
 * Initialize all Web Vitals monitoring
 */
export function initializeWebVitalsMonitoring() {
  if (typeof window === 'undefined') return

  // LCP
  measureLCP((lcp) => {
    reportWebVital({
      name: 'LCP',
      value: lcp,
      rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor',
      delta: 0,
    })
  })

  // INP (or FID)
  measureInteractivity((inp) => {
    reportWebVital({
      name: 'INP',
      value: inp,
      rating: inp < 200 ? 'good' : inp < 500 ? 'needs-improvement' : 'poor',
      delta: 0,
    })
  })

  // CLS
  measureCLS((cls) => {
    reportWebVital({
      name: 'CLS',
      value: cls,
      rating: cls < 0.1 ? 'good' : cls < 0.25 ? 'needs-improvement' : 'poor',
      delta: 0,
    })
  })
}

/**
 * Get current memory usage (Chrome only)
 */
export function getMemoryUsage() {
  if (typeof window === 'undefined') return null

  const perf = (performance as any).memory
  if (!perf) return null

  return {
    usedJSHeapSize: (perf.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (perf.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    jsHeapSizeLimit: (perf.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
  }
}
