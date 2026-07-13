'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n'
import { BookOpen, Users, Clock, Award, Star, ArrowLeft, ArrowRight } from 'lucide-react'

export default function PricingPageClient() {
  const { t, locale } = useI18n()
  const isArabic = locale === 'ar'

  const courses = [
    {
      id: 'quran',
      href: '/quran',
      icon: BookOpen,
      image: '/images/teacher-quran.jpg',
      features: [
        { key: 'certified-teachers', icon: Award },
        { key: 'live-sessions', icon: Users },
        { key: 'flexible-hours', icon: Clock },
        { key: 'personalized-plans', icon: Star },
      ],
    },
    {
      id: 'arabic',
      href: '/arabic-foundation',
      icon: BookOpen,
      image: '/images/teacher-arabic.jpg',
      features: [
        { key: 'certified-teachers', icon: Award },
        { key: 'live-sessions', icon: Users },
        { key: 'flexible-hours', icon: Clock },
        { key: 'personalized-plans', icon: Star },
      ],
    },
  ]

  const featureDescriptions: Record<string, { ar: string; en: string; fr: string }> = {
    'certified-teachers': {
      ar: 'معلمون مجازون ومتخصصون',
      en: 'Certified Expert Teachers',
      fr: 'Enseignants Certifiés',
    },
    'live-sessions': {
      ar: 'جلسات مباشرة تفاعلية',
      en: 'Interactive Live Sessions',
      fr: 'Séances en Direct',
    },
    'flexible-hours': {
      ar: 'مرونة في أوقات الدراسة',
      en: 'Flexible Learning Hours',
      fr: 'Horaires Flexibles',
    },
    'personalized-plans': {
      ar: 'خطط تعليمية مخصصة',
      en: 'Personalized Learning Plans',
      fr: 'Plans Personnalisés',
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-b from-primary to-primary/95 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary-foreground mb-6 text-balance">
              {t('pricing.title')}
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed text-pretty">
              {t('pricing.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Instant Access Alert - Paddle Compliance */}
      <section className="bg-green-50 dark:bg-green-900/20 border-t border-b border-green-200 dark:border-green-800 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
              {isArabic 
                ? "✅ وصول رقمي فوري - 100% برامج تعليمية عبر الإنترنت"
                : locale === 'en'
                ? "✅ Instant Digital Access - 100% Online Educational Programs"
                : "✅ Accès Numérique Instantané - 100% Programmes d'Apprentissage en Ligne"}
            </h2>
            <p className="text-green-800 dark:text-green-200">
              {isArabic
                ? "جميع البرامج التعليمية رقمية بالكامل | الوصول يبدأ فوراً بعد الدفع | بدون أي تأخيرات | منصة تعليم رقمية آمنة وموثوقة"
                : locale === 'en'
                ? "All educational programs are 100% digital | Access starts immediately after payment | No delays | Safe and reliable digital learning platform"
                : "Tous les programmes sont 100% numériques | Accès immédiat après le paiement | Aucun délai ni expédition physique | Plateforme d'apprentissage sûre et fiable"}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {courses.map((course, index) => {
              const titleKey = `pricing.${course.id}.title`
              const descKey = `pricing.${course.id}.description`
              const buttonKey = `pricing.${course.id}.button`

              return (
                <div
                  key={course.id}
                  className={`relative group rounded-3xl overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 ${
                    index === 1 ? 'lg:translate-y-0' : ''
                  }`}
                >
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Border Accent */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-clip-padding pointer-events-none group-hover:border-secondary/30 transition-colors duration-500" />

                  <div className="relative z-10">
                    {/* Image Section */}
                    <div className="relative h-64 lg:h-72 overflow-hidden bg-primary">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-60" />
                      <Image
                        src={course.image}
                        alt={t(titleKey)}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Icon Badge */}
                      <div className="absolute top-6 right-6 lg:right-8 p-4 bg-secondary rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 lg:p-10">
                      {/* Title */}
                      <h2 className="text-3xl lg:text-4xl font-extrabold text-primary mb-4 text-balance">
                        {t(titleKey)}
                      </h2>

                      {/* Description */}
                      <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                        {t(descKey)}
                      </p>

                      {/* Features List */}
                      <div className="mb-10 space-y-4">
                        {course.features.map((feature) => {
                          const Icon = feature.icon
                          const desc = featureDescriptions[feature.key]
                          const text = desc ? desc[locale as 'ar' | 'en' | 'fr'] : ''

                          return (
                            <div key={feature.key} className="flex items-center gap-4">
                              <div className="flex-shrink-0 p-3 bg-secondary/10 rounded-lg">
                                <Icon className="w-6 h-6 text-secondary" />
                              </div>
                              <span className="text-foreground font-medium text-lg">{text}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={course.href}
                        className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group/btn"
                      >
                        <span>{t(buttonKey)}</span>
                        {isArabic ? (
                          <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        )}
                      </Link>

                      {/* Footer Note */}
                      <p className="text-sm text-foreground/50 text-center mt-6 pt-6 border-t border-foreground/10">
                        {t('pricing.includes')}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 lg:py-28 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-primary mb-6">
              {t('pricing.why-choose')}
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              {t('pricing.trust-message')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                key: 'quality',
                icon: Award,
                stat: '1000+',
                label: 'Students',
              },
              {
                key: 'certified',
                icon: Star,
                stat: '50+',
                label: 'Teachers',
              },
              {
                key: 'success',
                icon: Users,
                stat: '95%',
                label: 'Success Rate',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <Icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <div className="text-4xl font-extrabold text-primary mb-2">{item.stat}</div>
                  <p className="text-foreground/70 font-medium">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-primary via-primary/95 to-primary/90">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-8">
            {t('pricing.ready-start')}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 leading-relaxed">
            {t('pricing.cta-message')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quran"
              className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {t('pricing.quran.button')}
            </Link>
            <Link
              href="/arabic-foundation"
              className="px-8 py-4 bg-white hover:bg-white/90 text-primary font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {t('pricing.arabic.button')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
