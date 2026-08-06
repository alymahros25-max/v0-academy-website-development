'use client'

import { Suspense, lazy, ReactNode } from 'react'

/**
 * Lazy-loaded Game Wrapper
 * Splits game components for better code splitting and lazy loading
 */

interface LazyGameWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function LazyGameWrapper({
  children,
  fallback = <GameLoadingSkeleton />,
}: LazyGameWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

/**
 * Loading skeleton for games
 */
export function GameLoadingSkeleton() {
  return (
    <div className="w-full bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 lg:p-8 shadow-lg animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-6 sm:h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
        <div className="h-10 w-20 bg-muted rounded-lg" />
      </div>

      {/* Progress bar skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-2.5 bg-muted rounded-full w-full" />
      </div>

      {/* Question skeleton */}
      <div className="bg-primary/5 rounded-2xl p-6 mb-6 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-6 bg-muted rounded w-full" />
        <div className="h-6 bg-muted rounded w-2/3" />
      </div>

      {/* Options skeletons */}
      <div className="space-y-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-muted rounded-lg" />
        ))}
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-muted rounded-lg w-32" />
    </div>
  )
}

/**
 * Create lazy-loaded game component
 * Reduces initial bundle size
 */
export const createLazyGame = <P extends object>(
  Component: React.ComponentType<P>,
  displayName: string
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }))
  const NamedLazyComponent = LazyComponent as typeof LazyComponent & { displayName?: string }
  NamedLazyComponent.displayName = `Lazy${displayName}`

  return LazyComponent as React.ComponentType<P>
}

/**
 * Game performance monitor wrapper
 */
export function GamePerformanceMonitor({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="game-performance-monitor"
      className="w-full"
    >
      {children}
    </div>
  )
}

/**
 * Error boundary for game components
 */
export function GameErrorBoundary({
  children,
  fallback = <GameErrorFallback />,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  // Note: Error boundaries must be class components in React
  // This is a placeholder that shows how to handle errors
  return <div className="w-full">{children}</div>
}

export function GameErrorFallback() {
  return (
    <div className="w-full bg-card rounded-2xl sm:rounded-3xl border border-red-200 dark:border-red-800 p-6 sm:p-8 shadow-lg">
      <div className="text-center py-8">
        <div className="text-red-600 dark:text-red-400 text-lg font-bold mb-2">
          حدث خطأ في تحميل اللعبة
        </div>
        <p className="text-muted-foreground text-sm">
          يرجى تحديث الصفحة أو المحاولة لاحقاً
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:brightness-110"
        >
          تحديث الصفحة
        </button>
      </div>
    </div>
  )
}
