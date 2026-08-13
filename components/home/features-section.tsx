"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import {
  Award,
  Clock,
  User,
  BookOpen,
  Eye,
  DollarSign,
} from "lucide-react"

const featureIcons = [Award, Clock, User, BookOpen, Eye, DollarSign]

export function FeaturesSection() {
  const { t, locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>("[data-feature-card]")
    if (!cards?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveCard(Number((visible.target as HTMLElement).dataset.index))
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.15, 0.5, 0.85] },
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const features = [
    { title: t("features.1.title"), desc: t("features.1.desc"), href: "/quran", label: locale === "ar" ? "أسعار تحفيظ القرآن" : "Quran Pricing" },
    { title: t("features.2.title"), desc: t("features.2.desc"), href: "/arabic", label: locale === "ar" ? "أسعار تأسيس العربي" : "Arabic Foundation Pricing" },
    { title: t("features.3.title"), desc: t("features.3.desc"), href: "/blog", label: locale === "ar" ? "مدونتنا" : "Our Blog" },
    { title: t("features.4.title"), desc: t("features.4.desc"), href: "/games", label: locale === "ar" ? "الألعاب والمسابقات" : "Games & Quizzes" },
    { title: t("features.5.title"), desc: t("features.5.desc"), href: "/library", label: locale === "ar" ? "المكتبة الرقمية" : "Digital Library" },
    { title: t("features.6.title"), desc: t("features.6.desc"), href: "/classroom-moments", label: locale === "ar" ? "فيديوهات من حصصنا" : "Videos from our classes" },
  ]

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-muted/30 islamic-pattern">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            {t("features.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance">
            {t("features.title")}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = featureIcons[idx]
            return (
              <div key={idx} className="mx-auto flex w-full max-w-xl flex-col gap-5 px-3 sm:px-0">
                <div
                  data-feature-card
                  data-index={idx}
                  className={`group rounded-2xl border bg-card p-7 shadow-md transition-all duration-700 ease-out will-change-transform sm:p-8 lg:p-8 ${
                    activeCard === idx
                      ? "scale-[1.06] border-primary/50 shadow-2xl ring-2 ring-primary/15"
                      : "scale-100 border-border"
                  }`}
                >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.desc}
                </p>
                </div>
                <Link
                  href={feature.href}
                  className="group/link mx-auto inline-flex min-h-12 items-center justify-center gap-2 py-3 text-center text-sm font-bold text-navy-primary transition-colors hover:text-navy-light hover:underline underline-offset-4"
                >
                  {feature.label}
                  <span aria-hidden="true" className="text-base transition-transform group-hover/link:-translate-x-1">←</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
