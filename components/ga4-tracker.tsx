'use client'

import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

declare global {
  interface Window {
    dataLayer: IArguments[]
    gtag: (...args: any[]) => void
  }
}

/**
 * GA4 Tracker Component
 * Tracks page views and user interactions across all localized routes
 * Supports Arabic, English, and French locales
 */
export function GA4Tracker() {
  const { locale } = useI18n()

  useEffect(() => {
    // Track page view with locale information
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
        language: locale,
        custom_locale: locale === 'ar' ? 'Arabic' : locale === 'en' ? 'English' : 'French',
      })
    }
  }, [locale])

  useEffect(() => {
    // Track when user changes language
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        language: locale,
        timestamp: new Date().toISOString(),
      })
    }
  }, [locale])

  return null
}
