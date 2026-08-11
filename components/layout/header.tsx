"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useI18n, type Locale } from "@/lib/i18n"
import { Menu, X, ChevronDown, Globe, BookOpen } from "lucide-react"

const localeLabels: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  fr: "Fran\u00e7ais",
}

export function Header() {
  const { t, locale, setLocale, dir } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/quran", label: locale === "ar" ? "تحفيظ القرآن وأسعار القرآن" : locale === "en" ? "Quran & Pricing" : "Coran et tarifs" },
    { href: "/arabic", label: locale === "ar" ? "تأسيس العربي وأسعار العربي" : locale === "en" ? "Arabic Foundation & Pricing" : "Fondation arabe et tarifs" },
    { href: "/teachers", label: t("nav.teachers") },
    { href: "/reviews", label: t("nav.reviews") },
    { href: "/library", label: t("nav.library") },
    { href: "/classroom-moments", label: locale === "ar" ? "لقطات من الحصص" : locale === "fr" ? "Moments de classe" : "Class Moments" },
    { href: "/games", label: t("nav.games") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/account", label: t("nav.account") },
  ]

  return (
    <header
      dir={dir}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-sm lg:text-base leading-tight ${scrolled ? "text-primary" : "text-primary-foreground lg:text-primary"}`}>
              {locale === "ar" ? "الحافظ المتميز" : "Al-Hafiz Academy"}
            </span>
            <span className={`text-[10px] lg:text-xs ${scrolled ? "text-secondary" : "text-secondary lg:text-secondary"}`}>
              {locale === "ar" ? "أكاديمية اون لاين" : "Online Academy"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-primary/10 ${
                scrolled
                  ? "text-foreground hover:text-primary"
                  : "text-primary-foreground/90 hover:text-primary-foreground lg:text-foreground lg:hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label={locale === "ar" ? "تغيير اللغة" : locale === "en" ? "Change language" : "Changer la langue"}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                scrolled
                  ? "text-foreground hover:bg-primary/10"
                  : "text-primary-foreground lg:text-foreground hover:bg-primary/10"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{localeLabels[locale]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                <div className="absolute top-full mt-1 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-20 min-w-[140px] end-0">
                  {(Object.keys(localeLabels) as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocale(loc)
                        setLangOpen(false)
                      }}
                      className={`block w-full px-4 py-2.5 text-sm text-start transition-colors hover:bg-primary/10 ${
                        locale === loc ? "bg-primary/5 text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {localeLabels[loc]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-bold transition-all hover:brightness-110 hover:shadow-lg"
          >
            {t("nav.subscribe")}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`xl:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-foreground" : "text-primary-foreground lg:text-foreground"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - slides from the right */}
      <div
        className={`xl:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-foreground/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 ${dir === "rtl" ? "right-0" : "right-0"} h-full w-72 bg-card shadow-2xl transition-transform duration-300 overflow-y-auto ${
            mobileOpen
              ? "translate-x-0"
              : dir === "rtl" ? "translate-x-full" : "translate-x-full"
          }`}
          dir={dir}
        >
          <nav className="p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-foreground font-medium rounded-lg transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg text-center font-bold transition-all hover:brightness-110"
            >
              {t("nav.subscribe")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
