"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowLeft, ArrowRight } from "lucide-react"

export function CTASection() {
  const { locale, dir } = useI18n()
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight

  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
          {locale === "ar"
            ? "ابدأ خطوتك الأولى اليوم"
            : locale === "en"
              ? "Start Your Learning Journey Today"
              : "Commencez votre parcours d'apprentissage aujourd'hui"}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto text-pretty">
          {locale === "ar"
            ? "اختر البرنامج المناسب، أو تواصل معنا لمعرفة المسار الأفضل لك أو لأحد أفراد أسرتك."
            : locale === "en"
              ? "Choose the right program or contact us to find the best path for you or your family."
              : "Choisissez le programme adapté ou contactez-nous pour trouver le meilleur parcours pour vous ou votre famille."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
<Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-8 py-4 text-lg font-bold text-primary shadow-md transition-all hover:bg-primary-foreground/90 hover:shadow-xl hover:-translate-y-0.5"
          >
            {locale === "ar" ? "جرب حصة مجانا" : locale === "en" ? "Try a Free Session" : "Essayez une séance gratuite"}
            <Arrow className="w-5 h-5" />
          </Link>
          <Link
            href="/arabic"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-8 py-4 text-lg font-bold text-primary shadow-md transition-all hover:bg-primary/20 hover:-translate-y-0.5"
          >
            {locale === "ar" ? "أسعار تأسيس العربي" : locale === "en" ? "Arabic Foundation Pricing" : "Tarifs de fondation arabe"}
            <Arrow className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  )
}
