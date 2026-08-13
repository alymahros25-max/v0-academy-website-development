"use client"

import { useI18n } from "@/lib/i18n"
import { Star, Quote } from "lucide-react"
import Link from "next/link"

const testimonials = [
  {
    name: { ar: "أم محمد", en: "Um Muhammad", fr: "Oum Mohammed" },
    country: { ar: "السعودية", en: "Saudi Arabia", fr: "Arabie Saoudite" },
    text: {
      ar: "أكاديمية رائعة! ابني حفظ 5 أجزاء في أقل من سنة بفضل المعلم المتميز والمتابعة المستمرة. أنصح الجميع بها.",
      en: "Amazing academy! My son memorized 5 Juz in less than a year thanks to the excellent teacher and continuous follow-up.",
      fr: "Academie incroyable! Mon fils a memorise 5 Juz en moins d'un an grace a l'excellent enseignant.",
    },
    rating: 5,
  },
  {
    name: { ar: "أبو أحمد", en: "Abu Ahmed", fr: "Abou Ahmed" },
    country: { ar: "ألمانيا", en: "Germany", fr: "Allemagne" },
    text: {
      ar: "نحن في أوروبا كنا نبحث عن أكاديمية موثوقة لتعليم أطفالنا القرآن. وجدنا في أكاديمية الحافظ المتميز كل ما نحتاجه.",
      en: "Living in Europe, we were looking for a reliable academy to teach our children the Quran. We found everything we need here.",
      fr: "Vivant en Europe, nous cherchions une academie fiable pour enseigner le Coran a nos enfants.",
    },
    rating: 5,
  },
  {
    name: { ar: "أم سارة", en: "Um Sarah", fr: "Oum Sarah" },
    country: { ar: "أمريكا", en: "USA", fr: "Etats-Unis" },
    text: {
      ar: "ابنتي تحسنت كثيراً في القراءة والكتابة العربية بعد الاشتراك في باقة تأسيس العربي. المعلمة صبورة وطريقتها ممتازة.",
      en: "My daughter improved so much in Arabic reading and writing after subscribing to the Arabic foundation package.",
      fr: "Ma fille s'est beaucoup amelioree en lecture et ecriture arabe apres son inscription au forfait fondation arabe.",
    },
    rating: 5,
  },
]

export function TestimonialsPreview() {
  const { t, locale } = useI18n()

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            {t("reviews.title")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance">
            {t("reviews.desc")}
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {testimonials.map((review, idx) => (
            <div
              key={idx}
              className="scroll-card bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all"
            >
              <Quote className="w-8 h-8 text-secondary/40 mb-4" />
              <p className="text-foreground leading-relaxed mb-6">
                {review.text[locale]}
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-secondary text-secondary"
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary text-sm">
                    {review.name[locale].charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    {review.name[locale]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.country[locale]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 py-3 text-navy-primary font-bold transition-colors hover:text-navy-light hover:underline underline-offset-4"
          >
            {locale === "ar" ? "عرض جميع الآراء" : locale === "en" ? "View all reviews" : "Voir tous les avis"}
          </Link>
        </div>
      </div>
    </section>
  )
}
