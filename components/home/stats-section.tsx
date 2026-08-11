"use client"

import { useI18n } from "@/lib/i18n"
import { useEffect, useState, useRef } from "react"

function AnimatedNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = Date.now()
          const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function StatsSection() {
  const { t } = useI18n()

  const stats = [
    { value: 500, suffix: "+", label: t("stats.students") },
    { value: 30, suffix: "+", label: t("stats.teachers") },
    { value: 15, suffix: "+", label: t("stats.countries") },
    { value: 2000, suffix: "+", label: t("stats.sessions") },
  ]

  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#d4af37] mb-2">
                <AnimatedNumber target={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-primary-foreground/80 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
