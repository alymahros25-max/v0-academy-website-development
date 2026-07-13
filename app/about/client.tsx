'use client'

import Image from 'next/image'
import { useI18n } from '@/lib/i18n'
import { Target, Eye, Heart, Award, Users, Globe } from 'lucide-react'

export default function AboutPageClient() {
  const { t, locale } = useI18n()

  const values = [
    {
      icon: Heart,
      title: { ar: 'الإخلاص', en: 'Sincerity', fr: 'Sincerite' },
      desc: { ar: 'نعمل بإخلاص لوجه الله تعالى في تعليم كتابه الكريم', en: 'We work sincerely for the sake of Allah in teaching His Noble Book', fr: 'Nous travaillons sincerement pour Allah dans l\'enseignement de Son Noble Livre' },
    },
    {
      icon: Award,
      title: { ar: 'الإتقان', en: 'Excellence', fr: 'Excellence' },
      desc: { ar: 'نسعى للتميز والإتقان في كل ما نقدمه من خدمات تعليمية', en: 'We strive for excellence in every educational service we provide', fr: 'Nous visons l\'excellence dans chaque service educatif' },
    },
    {
      icon: Users,
      title: { ar: 'التواصل', en: 'Communication', fr: 'Communication' },
      desc: { ar: 'نؤمن بأهمية التواصل المستمر مع الطلاب وأولياء الأمور', en: 'We believe in continuous communication with students and parents', fr: 'Nous croyons en la communication continue avec les etudiants et les parents' },
    },
    {
      icon: Globe,
      title: { ar: 'العالمية', en: 'Global Reach', fr: 'Portee mondiale' },
      desc: { ar: 'نخدم طلاباً من جميع أنحاء العالم بلا حدود جغرافية', en: 'We serve students from all over the world without geographic boundaries', fr: 'Nous servons des etudiants du monde entier' },
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
            {t('about.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
            {t('about.title')}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-pretty">
            {t('about.desc')}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/images/about-academy.jpg" alt="Academy" width={600} height={450} className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -z-10 -top-6 -start-6 w-full h-full rounded-3xl border-2 border-secondary/30" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-extrabold text-foreground">
                  {locale === 'ar' ? 'رسالتنا' : locale === 'en' ? 'Our Mission' : 'Notre mission'}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {locale === 'ar'
                  ? 'نسعى لنشر تعليم القرآن الكريم واللغة العربية في جميع أنحاء العالم من خلال توفير بيئة تعليمية احترافية عبر الإنترنت، مع الحفاظ على أعلى معايير الجودة والاحترافية في التعليم.'
                  : locale === 'en'
                    ? 'We strive to spread Quran and Arabic language education worldwide by providing a professional online learning environment, while maintaining the highest standards of quality and professionalism.'
                    : 'Nous nous efforcons de repandre l\'enseignement du Coran et de la langue arabe dans le monde entier en fournissant un environnement d\'apprentissage professionnel en ligne.'}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-extrabold text-foreground">
                  {locale === 'ar' ? 'رؤيتنا' : locale === 'en' ? 'Our Vision' : 'Notre vision'}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {locale === 'ar'
                  ? 'أن نكون الأكاديمية الرائدة عالمياً في تحفيظ القرآن الكريم وتأسيس اللغة العربية عن بعد، وأن نساهم في تخريج جيل حافظ لكتاب الله متقن لتلاوته.'
                  : locale === 'en'
                    ? 'To be the world\'s leading online academy in Quran memorization and Arabic language foundation, contributing to graduating a generation that has memorized and mastered the Book of Allah.'
                    : 'Etre l\'academie en ligne leader mondial dans la memorisation du Coran et les fondations de la langue arabe.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-muted/30 islamic-pattern">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-balance">
              {locale === 'ar' ? 'قيمنا ومبادئنا' : locale === 'en' ? 'Our Values' : 'Nos valeurs'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary transition-colors">
                  <value.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">{value.title[locale]}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '+500', label: locale === 'ar' ? 'طالب وطالبة' : locale === 'en' ? 'Students' : 'Etudiants' },
              { value: '+30', label: locale === 'ar' ? 'معلم ومعلمة' : locale === 'en' ? 'Teachers' : 'Enseignants' },
              { value: '+15', label: locale === 'ar' ? 'دولة' : locale === 'en' ? 'Countries' : 'Pays' },
              { value: '+5', label: locale === 'ar' ? 'سنوات خبرة' : locale === 'en' ? 'Years Experience' : 'Annees d\'experience' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-secondary mb-2">{stat.value}</div>
                <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
