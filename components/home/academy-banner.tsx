"use client"

import { useI18n } from "@/lib/i18n"

export function AcademyBanner() {
  const { locale, dir } = useI18n()

  return (
    <section
      dir={dir}
      aria-label={locale === "ar" ? "إعلان الأكاديمية" : "Academy announcement"}
      className="academy-banner relative z-10 overflow-hidden border-y border-[#DDBB85]/70 bg-[#5680A8] text-white shadow-sm"
    >
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-center px-4 py-3 text-center">
        <p className="text-sm font-bold leading-6 sm:text-base">
          {locale === "ar" ? (
            <>
              <span className="text-[#E8D3A0]">أكاديمية الحافظ المتميز</span>
              <span className="mx-2 text-[#DDBB85]" aria-hidden="true">|</span>
              <span>تعلم القرآن من أي مكان في العالم</span>
            </>
          ) : locale === "fr" ? (
            "Académie Al-Hafiz Al-Mutamayez | Apprenez le Coran où que vous soyez"
          ) : (
            "Al-Hafiz Al-Mutamayez Academy | Learn the Quran from anywhere in the world"
          )}
        </p>
      </div>
    </section>
  )
}
