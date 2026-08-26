"use client"

import { useI18n } from "@/lib/i18n"
import { Compass, Target } from "lucide-react"
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll"

function MissionIcon() {
  return (
    <svg viewBox="-10 -10 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-12" aria-hidden="true">
      <g transform="rotate(-35 60 60)">
        <path d="M60 10 L95 100 L60 82 L25 100 Z" fill="#2C5680" stroke="#1B3A5C" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="60" y1="10" x2="60" y2="82" stroke="#1B3A5C" strokeWidth="1" opacity="0.4" />
        <path d="M60 10 L25 100 L60 82 Z" fill="#5680A8" />
        <path d="M60 10 L68 35 L52 35 Z" fill="#DDBB85" />
        <line x1="60" y1="102" x2="60" y2="124" stroke="#5680A8" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <line x1="75" y1="102" x2="75" y2="118" stroke="#5680A8" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <line x1="90" y1="102" x2="90" y2="112" stroke="#5680A8" strokeWidth="2.5" strokeLinecap="round" opacity="0.28" />
        <line x1="45" y1="102" x2="45" y2="118" stroke="#5680A8" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
        <line x1="30" y1="102" x2="30" y2="112" stroke="#5680A8" strokeWidth="2.5" strokeLinecap="round" opacity="0.28" />
      </g>
    </svg>
  )
}

export function AboutSection() {
  const { t, locale } = useI18n()
  const cards = [
    {
      title: locale === "ar" ? "رسالتنا" : locale === "en" ? "Our Mission" : "Notre mission",
      description: locale === "ar" ? "تيسير تعلّم القرآن الكريم واللغة العربية أونلاين، بأسلوب حديث يجمع بين الأصالة والمرونة." : locale === "en" ? "Making Quran and Arabic learning accessible online through a modern approach rooted in authenticity and flexibility." : "Faciliter l'apprentissage du Coran et de l'arabe en ligne, avec une approche moderne, authentique et flexible.",
      icon: <MissionIcon />,
    },
    {
      title: locale === "ar" ? "رؤيتنا" : locale === "en" ? "Our Vision" : "Notre vision",
      description: locale === "ar" ? "أن نكون الوجهة الأولى لتعليم القرآن والعربية للعرب في كل مكان حول العالم." : locale === "en" ? "To be the first destination for Quran and Arabic education for Arabs everywhere in the world." : "Devenir la première destination pour l'enseignement du Coran et de l'arabe aux Arabes partout dans le monde.",
      icon: <Compass className="size-12 text-navy-primary" strokeWidth={1.5} aria-hidden="true" />,
    },
    {
      title: locale === "ar" ? "أهدافنا" : locale === "en" ? "Our Goals" : "Nos objectifs",
      description: locale === "ar" ? "حفظ متقن، تجويد صحيح، ومتابعة مستمرة تراعي مستوى كل طالب وعمره." : locale === "en" ? "Strong memorization, correct Tajweed, and continuous support tailored to every student's level and age." : "Une mémorisation solide, un Tajweed correct et un suivi continu adapté au niveau et à l'âge de chaque étudiant.",
      icon: <Target className="size-12 text-navy-primary" strokeWidth={1.5} aria-hidden="true" />,
    },
  ]

  return (
    <section className="content-auto bg-navy-pale/25 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-gold-pale px-4 py-1.5 text-sm font-bold text-navy-primary">{t("about.badge")}</span>
          <h2 className="text-balance text-3xl font-extrabold text-navy-primary md:text-4xl">{t("about.title")}</h2>
          <p className="mt-5 text-pretty text-lg leading-8 text-foreground/75">{t("about.desc")}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, idx) => (
            <RevealOnScroll key={card.title} delay={idx * 80}>
            <article className="scroll-card rounded-3xl border border-navy-light/40 bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
              <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gold-pale/60">{card.icon}</div>
              <h3 className="mt-6 text-xl font-extrabold text-navy-primary">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
            </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
