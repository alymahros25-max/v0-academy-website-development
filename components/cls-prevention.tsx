'use client'

import { ReactNode } from 'react'

interface CLSPreventionProps {
  children: ReactNode
  minHeight?: string
  minHeightMobile?: string
}

/**
 * CLSPrevention Component
 * Prevents Cumulative Layout Shift by reserving space with min-height
 * This ensures the layout doesn't jump when content loads
 */
export function CLSPrevention({
  children,
  minHeight = 'min-h-[600px]',
  minHeightMobile = 'min-h-[500px]',
}: CLSPreventionProps) {
  return (
    <div className={`w-full ${minHeightMobile} sm:${minHeight} transition-all duration-300`}>
      {children}
    </div>
  )
}

/**
 * SkeletonLoader Component
 * Shows a placeholder while content is loading to prevent layout shift
 */
export function SkeletonLoader({ lines = 3 }: { lines?: number }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded-lg w-full"
          style={{
            width: i === lines - 1 ? '80%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

/**
 * PreventLayoutShift Hook
 * Reserves space for elements that might load with different heights
 */
export function usePreventLayoutShift(hasContent: boolean, estimatedHeight: number = 200) {
  return {
    containerClass: `min-h-[${estimatedHeight}px]`,
    contentClass: hasContent ? '' : 'opacity-0 pointer-events-none',
  }
}
