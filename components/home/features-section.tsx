"use client"

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
  const { t } = useI18n()

  const features = [
    { title: t("features.1.title"), desc: t("features.1.desc") },
    { title: t("features.2.title"), desc: t("features.2.desc") },
    { title: t("features.3.title"), desc: t("features.3.desc") },
    { title: t("features.4.title"), desc: t("features.4.desc") },
    { title: t("features.5.title"), desc: t("features.5.desc") },
    { title: t("features.6.title"), desc: t("features.6.desc") },
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
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
