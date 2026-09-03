import Link from "next/link"
import { ChevronDown } from "lucide-react"

const countryPages = [
  { href: "/saudi-arabia", label: "تحفيظ القرآن والعربية في السعودية", flag: "🇸🇦" },
  { href: "/united-arab-emirates", label: "تحفيظ القرآن والعربية في الإمارات", flag: "🇦🇪" },
  { href: "/united-states", label: "تحفيظ القرآن والعربية في الولايات المتحدة", flag: "🇺🇸" },
  { href: "/canada", label: "تحفيظ القرآن والعربية في كندا", flag: "🇨🇦" },
  { href: "/united-kingdom", label: "تحفيظ القرآن والعربية في المملكة المتحدة", flag: "🇬🇧" },
  { href: "/australia", label: "تحفيظ القرآن والعربية في أستراليا", flag: "🇦🇺" },
  { href: "/germany", label: "تحفيظ القرآن والعربية في ألمانيا", flag: "🇩🇪" },
] as const

export function CountryPagesSection() {
  return (
    <section className="mt-8 border-t border-primary-foreground/10 pt-6" aria-labelledby="country-pages-title">
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-right font-bold text-secondary transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary [&::-webkit-details-marker]:hidden">
          <span id="country-pages-title">صفحاتنا حسب الدولة</span>
          <ChevronDown aria-hidden="true" className="size-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none [[open]>&]:rotate-180" />
        </summary>
        <nav id="country-pages-list" aria-label="صفحات الهبوط حسب الدولة" className="mt-4 grid gap-3 sm:grid-cols-3">
          {countryPages.map((country) => (
            <Link key={country.href} href={country.href} className="rounded-lg bg-primary-foreground/10 px-3 py-3 text-sm leading-6 text-primary-foreground/90 transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
              <span className="me-2" aria-hidden="true">{country.flag}</span>
              <span>{country.label}</span>
            </Link>
          ))}
        </nav>
      </details>
    </section>
  )
}

export { countryPages }
