"use client"

import { Star } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function AcademyBanner() {
  const { locale, dir } = useI18n()

  return (
    <section
      dir={dir}
      aria-label={locale === "ar" ? "بانر تعلم القرآن حول العالم" : "Global Quran learning banner"}
      className="academy-banner relative z-10 overflow-hidden border-b border-[#DDBB85]/70 bg-[#102B49] text-[#F4D58D] shadow-sm"
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-center px-4 py-5 text-center sm:min-h-24 sm:py-6">
        <p className="banner-enter flex items-center justify-center gap-2 text-base font-bold leading-6 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] sm:text-lg">
          {locale === "ar" ? (
            <>
              <Star className="size-4 shrink-0 fill-current" aria-hidden="true" />
              <span>تعلم القرآن في أي مكان في العالم</span>
            </>
          ) : locale === "fr" ? (
            "Apprenez le Coran partout dans le monde"
          ) : (
            "Learn the Quran anywhere in the world"
          )}
        </p>
      </div>
    </section>
  )
}
