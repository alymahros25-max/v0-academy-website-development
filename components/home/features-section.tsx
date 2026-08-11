"use client"

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

  const features = [
    { title: t("features.1.title"), desc: t("features.1.desc"), href: "/quran", label: locale === "ar" ? "أسعار تحفيظ القرآن" : "Quran Pricing" },
    { title: t("features.2.title"), desc: t("features.2.desc"), href: "/arabic", label: locale === "ar" ? "أسعار تأسيس العربي" : "Arabic Foundation Pricing" },
    { title: t("features.3.title"), desc: t("features.3.desc"), href: "/blog", label: locale === "ar" ? "مدونتنا" : "Our Blog" },
    { title: t("features.4.title"), desc: t("features.4.desc"), href: "/games", label: locale === "ar" ? "الألعاب والمسابقات" : "Games & Quizzes" },
    { title: t("features.5.title"), desc: t("features.5.desc"), href: "/library", label: locale === "ar" ? "المكتبة الرقمية" : "Digital Library" },
    { title: t("features.6.title"), desc: t("features.6.desc"), href: "/classroom-moments", label: locale === "ar" ? "فيديوهات من حصصنا" : "Videos from our classes" },
  ]

  return (
    <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = featureIcons[idx]
            return (
              <div
                key={idx}
                className="group bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
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
                <Link
                  href={feature.href}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {feature.label}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
