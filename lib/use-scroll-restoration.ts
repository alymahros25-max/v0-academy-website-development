import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useScrollRestoration() {
  const router = useRouter()

  useEffect(() => {
    // Restore scroll position on page load
    window.scrollTo(0, 0)
  }, [])

  // Intercept navigation and reset scroll
  const pushWithScroll = (href: string) => {
    window.scrollTo(0, 0)
    router.push(href)
  }

  return { pushWithScroll }
}

// Also handle automatic scroll reset on route changes
if (typeof window !== "undefined") {
  // Reset scroll on navigation
  const originalPush = window.history.pushState
  window.history.pushState = function (...args) {
    window.scrollTo(0, 0)
    return originalPush.apply(window.history, args)
  }
}
