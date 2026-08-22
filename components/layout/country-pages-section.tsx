"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const countryPages = [
  { href: "/saudi-arabia", label: "السعودية", name: "Saudi Arabia", flag: "🇸🇦" },
  { href: "/united-arab-emirates", label: "الإمارات", name: "United Arab Emirates", flag: "🇦🇪" },
  { href: "/united-states", label: "الولايات المتحدة", name: "United States", flag: "🇺🇸" },
  { href: "/canada", label: "كندا", name: "Canada", flag: "🇨🇦" },
  { href: "/united-kingdom", label: "المملكة المتحدة", name: "United Kingdom", flag: "🇬🇧" },
  { href: "/australia", label: "أستراليا", name: "Australia", flag: "🇦🇺" },
] as const

export function CountryPagesSection() {
  const [open, setOpen] = useState(false)

  return (
    <section className="mt-8 border-t border-primary-foreground/10 pt-6" aria-labelledby="country-pages-title">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="country-pages-list"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 text-right font-bold text-secondary transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        <span id="country-pages-title">صفحاتنا حسب الدولة</span>
        <ChevronDown aria-hidden="true" className={`size-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      <div id="country-pages-list" hidden={!open} className="mt-4 motion-reduce:transition-none">
        <nav aria-label="صفحات الهبوط حسب الدولة" className="grid gap-3 sm:grid-cols-3">
          {countryPages.map((country) => (
            <Link key={country.href} href={country.href} className="rounded-lg bg-primary-foreground/10 px-3 py-3 text-sm text-primary-foreground/90 transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
              <span className="me-2" aria-hidden="true">{country.flag}</span>
              <span>{country.label}</span>
              <span className="ms-1 text-xs text-primary-foreground/60">({country.name})</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}

export { countryPages }
