"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"
import { siteStats } from "@/lib/site-stats"

export function HeroSection() {
  const { t, locale, dir } = useI18n()
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 bg-warm-bg">
        <div className="absolute inset-x-0 top-0 h-[24%] bg-warm-bg" />
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-warm-bg" />
        <Image
          src="/images/hero-children.jpg"
          alt="Children learning Quran"
          fill
          className="object-cover object-center [clip-path:inset(24%_0_18%_0)]"
          sizes="100vw"
          quality={85}
          priority
          fetchPriority="high"
        />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 lg:py-40 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="-translate-y-5 text-center transition-transform md:-translate-y-8 lg:-translate-y-10 lg:text-start">
            <div className="mx-auto inline-flex w-fit max-w-full flex-col items-center rounded-3xl bg-background/75 px-5 py-6 shadow-lg backdrop-blur-[2px] lg:mx-0 lg:items-start lg:px-8 lg:py-7">
              <h1 className="text-4xl font-extrabold leading-tight text-foreground text-balance md:text-5xl lg:text-6xl">
                أكاديمية الحافظ المتميز
              </h1>
              <p className="mt-3 text-2xl font-bold leading-relaxed text-foreground md:text-3xl">
                <span className="block">تحفيظ القرآن وتأسيس العربية</span>
                <span className="block">رجال ونساء وأطفال</span>
                <span className="mt-1 block text-lg font-semibold text-muted-foreground md:text-xl">(الخليج، أوروبا، أمريكا)</span>
              </p>
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
                  {locale === "ar" ? `+${siteStats.students} طالب` : locale === "en" ? `+${siteStats.students} Students` : `+${siteStats.students} Etudiants`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-gold-primary text-gold-primary"
                  />
                ))}
                <span className="ms-1">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Decorative Card */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-secondary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
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
                    <p className="font-bold text-foreground text-lg">{siteStats.countries}+</p>
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

      <div className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center justify-center gap-2 px-4 sm:flex-row sm:gap-8">
        <Link
          href="/classroom-moments"
          className="group inline-flex items-center gap-2 py-2 text-base font-bold text-navy-primary transition-colors hover:text-navy-light hover:underline underline-offset-4"
        >
          {locale === "ar" ? "فيديوهات من حصصنا" : locale === "en" ? "Videos from our classes" : "Vidéos de nos cours"}
          <Arrow className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
        <Link
          href="/quran"
          className="group inline-flex items-center gap-2 py-2 text-base font-bold text-navy-primary transition-colors hover:text-navy-light hover:underline underline-offset-4"
        >
          {t("hero.cta2")}
          <Arrow className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
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
