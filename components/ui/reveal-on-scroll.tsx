import type { CSSProperties, ReactNode } from "react"

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * A zero-hydration wrapper for optional section motion. Content is visible by
 * default so the first viewport never waits for client JavaScript or an
 * IntersectionObserver. The delay is retained for API compatibility and can
 * be consumed by existing CSS without creating one observer per card.
 */
export function RevealOnScroll({ children, delay = 0, className = "" }: RevealOnScrollProps) {
  return (
    <div className={`reveal-on-scroll ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  )
}
