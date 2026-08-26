import { siteStats, siteStatLabels } from "@/lib/site-stats"
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll"
export function StatsSection() {
  const stats = [
    { value: siteStats.students, suffix: "+", label: siteStatLabels.students.ar },
    { value: siteStats.teachers, suffix: "", label: siteStatLabels.teachers.ar },
    { value: siteStats.countries, suffix: "", label: siteStatLabels.countries.ar },
    { value: siteStats.experienceYears, suffix: "+", label: siteStatLabels.experience.ar },
  ]

  return (
    <section className="content-auto py-16 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <RevealOnScroll key={idx} delay={idx * 80}>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-[#d4af37] mb-2">
                {stat.value.toLocaleString()}
                {stat.suffix}
              </div>
              <p className="text-primary-foreground/80 font-medium">
                {stat.label}
              </p>
            </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
