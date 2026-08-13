"use client"

import Link from "next/link"
import useSWR from "swr"
import { useI18n } from "@/lib/i18n"
import { Check, ArrowLeft, ArrowRight } from "lucide-react"

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((res) => res.json())
type PublicPackage = { type: string; sessions: number; price: number; popular?: boolean; features?: { ar?: string[] } }

export function PricingPreview() {
  const { t, locale, dir } = useI18n()
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight

  const { data: storedPackages } = useSWR<PublicPackage[]>("/api/public/packages", fetcher, { revalidateOnFocus: true })
  const packages = Array.isArray(storedPackages) ? storedPackages : []
  const quranPackages = packages
    .filter((pkg) => pkg.type === "quran")
    .sort((a, b) => a.sessions - b.sessions)

  const features = [
    t("pricing.features.flexibility"),
    t("pricing.features.certified"),
    t("pricing.features.supervision"),
    t("pricing.features.memorization"),
  ]

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            {t("pricing.quran.title")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance mb-4">
            {locale === "ar"
              ? "اختر الباقة المناسبة لك"
              : locale === "en"
                ? "Choose Your Plan"
                : "Choisissez votre forfait"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {locale === "ar"
              ? "باقات مرنة تناسب جميع المستويات والميزانيات مع جودة تعليمية عالية"
              : locale === "en"
                ? "Flexible packages suitable for all levels and budgets with high educational quality"
                : "Forfaits flexibles adaptes a tous les niveaux et budgets"}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          {quranPackages.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                pkg.popular
                  ? "bg-primary text-primary-foreground shadow-xl scale-105 border-2 border-secondary"
                  : "bg-card text-foreground shadow-lg border border-border"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-sm font-bold rounded-full">
                  {t("pricing.popular")}
                </div>
              )}

              <div className="text-center mb-6">
                <p className={`text-sm font-medium mb-2 ${pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {pkg.sessions} {pkg.sessions > 10 ? t("pricing.session") : t("pricing.sessions")}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold">${pkg.price}</span>
                  <span className={`text-sm ${pkg.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {t("pricing.month")}
                  </span>
                </div>
                <p className={`text-xs mt-2 ${pkg.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {t("pricing.duration")}
                </p>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      pkg.popular ? "bg-secondary/20" : "bg-primary/10"
                    }`}>
                      <Check className={`w-3 h-3 ${pkg.popular ? "text-secondary" : "text-primary"}`} />
                    </div>
                    <span className={`text-sm ${pkg.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

<div className="flex flex-col items-center gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-center sm:gap-4">
                <Link
                  href="/quran"
                  className="inline-flex items-center justify-center gap-2 py-2 text-center text-sm font-bold text-navy-primary transition-colors hover:text-navy-light hover:underline underline-offset-4"
                >
                  {locale === "ar" ? "أسعار تحفيظ القرآن" : locale === "en" ? "Quran Pricing" : "Tarifs du Coran"}
                  <Arrow className="w-4 h-4" />
                </Link>
                <Link
                  href="/arabic"
                  className="inline-flex items-center justify-center gap-2 py-2 text-center text-sm font-bold text-navy-primary transition-colors hover:text-navy-light hover:underline underline-offset-4"
                >
                  {locale === "ar" ? "أسعار تأسيس اللغة العربية" : locale === "en" ? "Arabic Foundation Pricing" : "Tarifs de fondation arabe"}
                  <Arrow className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View more */}
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/quran"
            className="inline-flex items-center gap-2 text-navy-primary font-bold transition-colors hover:text-navy-light hover:underline underline-offset-4"
          >
            {locale === "ar" ? "عرض جميع باقات القرآن" : locale === "en" ? "View all Quran packages" : "Voir tous les forfaits Coran"}
            <Arrow className="w-4 h-4" />
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link
            href="/arabic"
            className="inline-flex items-center gap-2 text-navy-primary font-bold transition-colors hover:text-navy-light hover:underline underline-offset-4"
          >
            {locale === "ar" ? "عرض باقات تأسيس العربي" : locale === "en" ? "View Arabic packages" : "Voir les forfaits arabe"}
            <Arrow className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
