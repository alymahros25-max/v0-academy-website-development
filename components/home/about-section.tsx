"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { BookOpen, Users, Award, GraduationCap } from "lucide-react"

export function AboutSection() {
  const { t, locale } = useI18n()

  const highlights = [
    {
      icon: BookOpen,
      label: locale === "ar" ? "حفظ وتجويد" : locale === "en" ? "Memorization & Tajweed" : "Memorisation & Tajweed",
    },
    {
      icon: Users,
      label: locale === "ar" ? "حصص فردية" : locale === "en" ? "One-on-One" : "Individuel",
    },
    {
      icon: Award,
      label: locale === "ar" ? "معلمون مجازون" : locale === "en" ? "Certified Teachers" : "Enseignants certifies",
    },
    {
      icon: GraduationCap,
      label: locale === "ar" ? "منهج شامل" : locale === "en" ? "Full Curriculum" : "Programme complet",
    },
  ]

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-academy.jpg"
                alt="About the academy"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-6 -start-6 w-full h-full rounded-3xl border-2 border-secondary/30" />
            <div className="absolute -z-10 -bottom-6 -end-6 w-32 h-32 rounded-2xl bg-secondary/10" />
          </div>

          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              {t("about.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 text-balance">
              {t("about.title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              {t("about.desc")}
            </p>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
