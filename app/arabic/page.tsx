"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import useSWR from "swr"
import { Check, PenTool, BookOpen, Lightbulb, GraduationCap } from "lucide-react"

const methodSteps = [
  {
    icon: BookOpen,
    title: { ar: "تعلم الحروف والحركات", en: "Letters & Vowels", fr: "Lettres et voyelles" },
    desc: { ar: "تعلم الحروف العربية وأشكالها والحركات بطرق تفاعلية ممتعة", en: "Learn Arabic letters, their forms and vowels through fun interactive methods", fr: "Apprenez les lettres arabes et les voyelles de maniere interactive" },
  },
  {
    icon: PenTool,
    title: { ar: "القراءة والكتابة", en: "Reading & Writing", fr: "Lecture et ecriture" },
    desc: { ar: "تعلم قراءة الكلمات والجمل والكتابة الصحيحة خطوة بخطوة", en: "Learn to read words and sentences and write correctly step by step", fr: "Apprenez a lire et ecrire correctement etape par etape" },
  },
  {
    icon: Lightbulb,
    title: { ar: "الإملاء والتعبير", en: "Dictation & Expression", fr: "Dictee et expression" },
    desc: { ar: "تطوير مهارات الإملاء والتعبير الكتابي والشفهي", en: "Developing dictation skills and written and oral expression", fr: "Developpement des competences en dictee et expression" },
  },
  {
    icon: GraduationCap,
    title: { ar: "التقييم والمتابعة", en: "Assessment & Follow-up", fr: "Evaluation et suivi" },
    desc: { ar: "تقييمات دورية وتقارير شهرية للأهل لمتابعة تطور الطالب", en: "Periodic assessments and monthly reports for parents to track progress", fr: "Evaluations periodiques et rapports mensuels pour les parents" },
  },
]

type PublicPackage = {
  id?: string
  type: string
  sessions: number
  price: number
  popular?: boolean
}

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((res) => res.json())

export default function ArabicPage() {
  const { t, locale } = useI18n()
  const { data: storedPackages } = useSWR<PublicPackage[]>("/api/public/packages", fetcher, { revalidateOnFocus: true })
  const packages = (Array.isArray(storedPackages) && storedPackages.length > 0
    ? storedPackages
    : [
        { type: "arabic", sessions: 4, price: 20, popular: false },
        { type: "arabic", sessions: 8, price: 36, popular: true },
        { type: "arabic", sessions: 12, price: 54, popular: false },
      ]
  ).filter((pkg) => pkg.type === "arabic").sort((a, b) => a.sessions - b.sessions)

  const features = [
    t("pricing.features.flexibility"),
    t("pricing.features.reading"),
    t("pricing.features.certifiedTeachers"),
    t("pricing.features.supervision"),
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
                {t("nav.arabic")}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
                {t("arabic.hero.title")}
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed text-pretty">
                {t("arabic.hero.desc")}
              </p>
              <p className="mt-4 text-base font-semibold text-secondary">تأسيس اللغة العربية للطلاب الناطقين بالعربية في أي مكان في العالم.</p>
            </div>
            <div className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/arabic-learning.jpg"
                  alt="Arabic learning class"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  quality={85}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority={false}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Method */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">
              {t("arabic.method.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-pretty">
              {t("arabic.method.desc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodSteps.map((step, idx) => (
              <div key={idx} className="relative bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all group">
                <div className="absolute -top-4 start-6 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <step.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title[locale]}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              {t("pricing.arabic.title")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance">
              {locale === "ar" ? "اختر باقتك وابدأ التأسيس" : locale === "en" ? "Choose Your Package" : "Choisissez votre forfait"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id ?? `${pkg.type}-${pkg.sessions}`}
                className={`relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  pkg.popular
                    ? "bg-primary text-primary-foreground shadow-xl scale-105 border-2 border-secondary"
                    : "bg-card text-foreground shadow-lg border border-border"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-secondary text-secondary-foreground text-sm font-bold rounded-full shadow-lg">
                    {t("pricing.popular")}
                  </div>
                )}

                <div className="text-center mb-8 pt-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    pkg.popular ? "bg-secondary/20" : "bg-primary/10"
                  }`}>
                    <PenTool className={`w-8 h-8 ${pkg.popular ? "text-secondary" : "text-primary"}`} />
                  </div>
                  <p className={`font-bold text-lg mb-1 ${pkg.popular ? "text-primary-foreground" : "text-foreground"}`}>
                    {pkg.sessions} {pkg.sessions > 10 ? t("pricing.session") : t("pricing.sessions")}
                  </p>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-5xl font-extrabold">${pkg.price}</span>
                    <span className={`text-sm ${pkg.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {t("pricing.month")}
                    </span>
                  </div>
                  <p className={`text-sm ${pkg.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {t("pricing.duration")}
                  </p>
                </div>

                <div className={`h-px mb-6 ${pkg.popular ? "bg-primary-foreground/20" : "bg-border"}`} />

                <ul className="flex flex-col gap-3 mb-8">
                  {features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        pkg.popular ? "bg-secondary/20" : "bg-primary/10"
                      }`}>
                        <Check className={`w-3 h-3 ${pkg.popular ? "text-secondary" : "text-primary"}`} />
                      </div>
                      <span className={`text-sm leading-relaxed ${pkg.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block w-full py-3.5 rounded-xl font-bold text-center transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    pkg.popular
                      ? "bg-secondary text-secondary-foreground hover:brightness-110"
                      : "bg-primary text-primary-foreground hover:brightness-110"
                  }`}
                >
                  {t("pricing.subscribe")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
