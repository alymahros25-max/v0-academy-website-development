import { Suspense } from 'react'

/**
 * Root loading component for Suspense boundaries.
 * Shows while page content is being loaded from the server.
 * Optimizes TTFB and provides better perceived performance.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated skeleton loader */}
        <div className="space-y-4 w-full max-w-md">
          {/* Header skeleton */}
          <div className="h-12 bg-primary/20 rounded-lg animate-pulse" />
          
          {/* Content skeleton with multiple lines */}
          <div className="space-y-2">
            <div className="h-4 bg-primary/20 rounded animate-pulse w-full" />
            <div className="h-4 bg-primary/20 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-primary/20 rounded animate-pulse w-4/6" />
          </div>

          {/* Card grid skeleton */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="h-20 bg-primary/20 rounded-lg animate-pulse" />
            <div className="h-20 bg-primary/20 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <p className="text-muted-foreground text-sm mt-8 animate-pulse">
          جاري تحميل الصفحة...
        </p>
      </div>
    </div>
  )
}
