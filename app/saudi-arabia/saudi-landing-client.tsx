"use client"

import { useEffect, useState } from "react"

export default function SaudiLandingClient() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.15 })
    const section = document.getElementById("plans")
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`saudi-plan-nav-wrap ${visible ? "saudi-reveal-visible" : ""}`} aria-label="التنقل بين البرامج">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-5 py-6 sm:px-8">
        <a className="saudi-chip" href="#plans">تحفيظ القرآن</a>
        <a className="saudi-chip" href="#plans">تأسيس العربية</a>
        <span className="w-full text-center text-sm text-muted-foreground sm:w-auto">حصة تجريبية مجانية عبر واتساب</span>
      </div>
    </div>
  )
}
