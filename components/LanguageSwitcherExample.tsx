'use client'

import { useI18n } from '@/lib/i18n'
import { Globe, Check } from 'lucide-react'

/**
 * Example Language Switcher Component
 * 
 * This shows how to create a functional language switcher
 * that integrates with the i18n system.
 * 
 * Features:
 * - Auto-highlights active language
 * - Updates document direction (RTL/LTR)
 * - Persists choice in localStorage
 * - Smooth transitions between languages
 */

export function LanguageSwitcherExample() {
  const { locale, switchLocale } = useI18n()

  const languages = [
    { 
      code: 'ar', 
      name: 'العربية', 
      nativeName: 'Arabic',
      flag: '🇸🇦' 
    },
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🇺🇸' 
    },
    { 
      code: 'fr', 
      name: 'Français', 
      nativeName: 'French',
      flag: '🇫🇷' 
    }
  ]

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border border-border">
      {/* Icon */}
      <Globe className="w-5 h-5 text-primary flex-shrink-0" />

      {/* Language Buttons */}
      <div className="flex gap-2 flex-wrap">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLocale(lang.code as 'ar' | 'en' | 'fr')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              flex items-center gap-2 text-sm
              ${
                locale === lang.code
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }
            `}
            aria-label={`Switch to ${lang.nativeName}`}
            title={lang.nativeName}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {locale === lang.code && (
              <Check className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Compact Version - Perfect for Header
 */
export function LanguageSwitcherCompact() {
  const { locale, switchLocale } = useI18n()

  const languages = [
    { code: 'ar', name: 'AR' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' }
  ]

  return (
    <div className="inline-flex gap-1 bg-muted rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLocale(lang.code as 'ar' | 'en' | 'fr')}
          className={`
            px-2 py-1 rounded transition-all text-xs font-bold
            ${
              locale === lang.code
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:text-foreground'
            }
          `}
          title={lang.name}
        >
          {lang.name}
        </button>
      ))}
    </div>
  )
}

/**
 * Dropdown Version - Perfect for Mobile
 */
export function LanguageSwitcherDropdown() {
  const { locale, switchLocale } = useI18n()

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ]

  const currentLang = languages.find(l => l.code === locale)

  return (
    <div className="relative inline-block">
      <button className="px-4 py-2 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition">
        {currentLang?.flag} {currentLang?.name}
      </button>
      
      {/* Dropdown menu can be added with a library like Headless UI */}
      {/* This is a simplified example */}
      <div className="absolute top-full mt-2 bg-card border border-border rounded-lg shadow-lg hidden group-hover:block">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLocale(lang.code as 'ar' | 'en' | 'fr')}
            className={`
              block w-full px-4 py-2 text-left hover:bg-muted transition
              ${locale === lang.code ? 'bg-primary text-white font-bold' : 'text-foreground'}
            `}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Usage Instructions:
 * 
 * 1. Import any version into your Header/Navigation:
 *    import { LanguageSwitcherExample } from '@/components/LanguageSwitcherExample'
 * 
 * 2. Add to your header JSX:
 *    <LanguageSwitcherExample />
 * 
 * 3. The component will:
 *    - Show active language highlighted
 *    - Switch locale on click
 *    - Auto-update document.documentElement.dir (RTL for Arabic)
 *    - Auto-update document.documentElement.lang
 *    - Persist choice in localStorage
 * 
 * That's it! No additional wiring needed - the i18n system handles the rest.
 */
