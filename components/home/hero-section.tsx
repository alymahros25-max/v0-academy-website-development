"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"

export function HeroSection() {
  const { t, locale, dir } = useI18n()
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 bg-primary/90">
        <Image
          src="/images/hero-children.jpg"
          alt="Children learning Quran"
          fill
          className="object-contain md:object-cover object-center"
          sizes="100vw"
          quality={85}
          priority
          fetchpriority="high"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/90" />
        <div className="absolute inset-0 islamic-pattern opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 lg:py-40 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary border border-secondary/30 mb-6 text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>
                {locale === "ar"
                  ? "تعلم القرآن من أي مكان في العالم"
                  : locale === "en"
                    ? "Learn Quran from anywhere in the world"
                    : "Apprenez le Coran de partout dans le monde"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight text-balance mb-6">
              {t("hero.title")}
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/classroom-moments"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg transition-all hover:brightness-110 hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5"
              >
                {locale === "ar" ? "فيديوهات من حصصنا" : locale === "en" ? "Videos from our classes" : "Vidéos de nos cours"}
                <Arrow className="w-5 h-5" />
              </Link>
              <Link
                href="/quran"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground/10 text-primary-foreground rounded-xl font-bold text-lg border border-primary-foreground/20 transition-all hover:bg-primary-foreground/20 hover:-translate-y-0.5"
              >
                {t("hero.cta2")}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-primary-foreground/70 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-secondary/30 border-2 border-primary flex items-center justify-center text-xs font-bold text-secondary"
                    >
                      {locale === "ar" ? "ط" : "S"}
                    </div>
                  ))}
                </div>
                <span className="ms-2">
                  {locale === "ar" ? "+500 طالب" : locale === "en" ? "+500 Students" : "+500 Etudiants"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-secondary text-secondary"
                  />
                ))}
                <span className="ms-1">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Decorative Card */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-80 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-secondary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/teacher-quran.jpg"
                  alt="Quran teacher"
                  fill
                  sizes="(min-width: 1024px) 320px, 0px"
                  quality={80}
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -start-12 bg-card rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {locale === "ar" ? "+" : "+"}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">15+</p>
                    <p className="text-sm text-muted-foreground">
                      {locale === "ar"
                        ? "دولة حول العالم"
                        : locale === "en"
                          ? "Countries worldwide"
                          : "Pays dans le monde"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  )
}
