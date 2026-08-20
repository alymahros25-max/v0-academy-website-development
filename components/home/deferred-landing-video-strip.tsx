"use client"

import { useEffect, useRef, useState } from "react"
import type { LandingVideo } from "@/lib/classroom-videos"
import { LandingVideoCarousel } from "@/components/LandingVideoCarousel"

export function DeferredLandingVideoStrip() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [videos, setVideos] = useState<LandingVideo[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const target = sectionRef.current
    if (!target) return

    const loadVideos = async () => {
      if (loaded) return
      setLoaded(true)
      try {
        const response = await fetch("/api/classroom-videos")
        if (!response.ok) return
        const data = (await response.json()) as LandingVideo[]
        if (Array.isArray(data)) setVideos(data)
      } catch {
        // Optional content must never block or break the homepage.
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void loadVideos()
        observer.disconnect()
      }
    }, { rootMargin: "800px 0px" })

    observer.observe(target)
    return () => observer.disconnect()
  }, [loaded])

  if (!videos.length) return <div ref={sectionRef} aria-hidden="true" />

  return (
    <section ref={sectionRef} className="border-y border-border bg-card px-5 py-14 sm:px-8" aria-labelledby="landing-videos-title">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="saudi-eyebrow justify-center">من داخل حصصنا</p>
          <h2 id="landing-videos-title" className="mt-3 text-3xl font-bold text-foreground">شاهد جانباً من حصصنا</h2>
          <p className="mt-4 leading-7 text-muted-foreground">تعرّف على أسلوب التعليم والمتابعة في أكاديمية الحافظ المتميز من خلال مقاطع قصيرة من حصصنا وأنشطتنا التعليمية.</p>
        </div>
        <LandingVideoCarousel videos={videos} />
      </div>
    </section>
  )
}
