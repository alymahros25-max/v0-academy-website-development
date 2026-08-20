"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n"

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = "G-94X5S3J229"

function loadGoogleAnalytics() {
  if (typeof window === "undefined") return
  if (window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
  window.gtag("js", new Date())
  window.gtag("config", MEASUREMENT_ID, { page_path: window.location.pathname, page_title: document.title })

  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function GA4Tracker() {
  const { locale } = useI18n()
  const pathname = usePathname()
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let started = false

    const start = () => {
      if (started) return
      started = true
      loaded.current = true
      loadGoogleAnalytics()
      window.removeEventListener("pointerdown", start)
      window.removeEventListener("keydown", start)
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timeoutId) clearTimeout(timeoutId)
    }

    window.addEventListener("pointerdown", start, { once: true, passive: true })
    window.addEventListener("keydown", start, { once: true, passive: true })
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 5000 })
    } else {
      timeoutId = setTimeout(start, 5000)
    }

    return () => {
      window.removeEventListener("pointerdown", start)
      window.removeEventListener("keydown", start)
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (window.gtag && loaded.current) {
      window.gtag("event", "page_view", { page_path: pathname, page_title: document.title, language: locale })
    }
  }, [locale, pathname])

  return null
}
