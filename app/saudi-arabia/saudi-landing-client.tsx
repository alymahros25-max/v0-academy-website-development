"use client"

import { useEffect, useState } from "react"
import { saudiLandingConfig, type SaudiProgram, type SaudiDuration } from "@/lib/saudi-landing-config"

export default function SaudiLandingClient() {
  const [program, setProgram] = useState<SaudiProgram>("quran")
  const [duration, setDuration] = useState<SaudiDuration | "all">("all")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("saudi-js")
    const revealItems = document.querySelectorAll<HTMLElement>(".saudi-reveal")
    if (typeof IntersectionObserver === "undefined") {
      revealItems.forEach((item) => item.classList.add("saudi-reveal-visible"))
      return () => document.documentElement.classList.remove("saudi-js")
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("saudi-reveal-visible")
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    revealItems.forEach((item, index) => { item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`; observer.observe(item) })
    const section = document.getElementById("plans")
    if (section) setVisible(true)
    document.querySelectorAll<HTMLElement>("[data-saudi-program]").forEach((card) => {
      const matches = card.dataset.saudiProgram === "quran"
      card.hidden = !matches
    })
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove("saudi-js")
    }
  }, [])

  function updateFilters(nextProgram: SaudiProgram, nextDuration: SaudiDuration | "all") {
    setProgram(nextProgram)
    setDuration(nextDuration)
    document.querySelectorAll<HTMLElement>("[data-saudi-program]").forEach((card) => {
      const matches = card.dataset.saudiProgram === nextProgram && (nextDuration === "all" || card.dataset.saudiDuration === String(nextDuration))
      card.hidden = !matches
    })
  }

  return <div className={`saudi-plan-nav-wrap ${visible ? "saudi-reveal-visible" : ""}`} aria-label="التنقل بين برامج وباقات الصفحة">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-6 sm:px-8">
      <div className="flex flex-wrap justify-center gap-3" role="tablist" aria-label="البرامج"><button type="button" role="tab" aria-selected={program === "quran"} className={`saudi-chip ${program === "quran" ? "bg-secondary" : ""}`} onClick={() => updateFilters("quran", duration)}>تحفيظ القرآن</button><button type="button" role="tab" aria-selected={program === "arabic"} className={`saudi-chip ${program === "arabic" ? "bg-secondary" : ""}`} onClick={() => updateFilters("arabic", duration)}>تأسيس العربية</button></div>
      <div className="flex flex-wrap justify-center gap-2" aria-label="مدة الحصة"><button type="button" className={`saudi-chip ${duration === "all" ? "bg-secondary" : ""}`} onClick={() => updateFilters(program, "all")}>كل المدد</button>{([30, 40, 60] as const).map((minutes) => <button key={minutes} type="button" className={`saudi-chip ${duration === minutes ? "bg-secondary" : ""}`} onClick={() => updateFilters(program, minutes)}>{minutes} دقيقة</button>)}</div>
      <p className="text-center text-sm text-muted-foreground">{saudiLandingConfig.plans.filter((plan) => plan.program === program).length} باقات متاحة · حصة تجريبية مجانية عبر واتساب</p>
    </div>
  </div>
}
