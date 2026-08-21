"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import type { LandingVideo } from "@/lib/classroom-videos"

export function LandingVideoCarousel({ videos }: { videos: LandingVideo[] }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [activeVideo, setActiveVideo] = useState<LandingVideo | null>(null)
  const [visibleVideoIds, setVisibleVideoIds] = useState<Set<string>>(() => new Set())
  const move = (direction: "next" | "previous") => {
    scroller.current?.scrollBy({ left: direction === "next" ? -340 : 340, behavior: "smooth" })
  }

  useEffect(() => {
    const root = scroller.current
    if (!root || !videos.length) return

    const revealThumbnails = () => {
      setVisibleVideoIds(new Set(videos.map((video) => video.id)))
    }

    if (typeof IntersectionObserver === "undefined") {
      revealThumbnails()
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      revealThumbnails()
      observer.disconnect()
    }, { rootMargin: "320px 0px" })

    observer.observe(root)
    return () => observer.disconnect()
  }, [videos])


  useEffect(() => {
    if (!activeVideo) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setActiveVideo(null)
    document.addEventListener("keydown", closeOnEscape)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", closeOnEscape)
      document.body.style.overflow = ""
    }
  }, [activeVideo])

  return (
    <div className="relative mt-8">
      <div ref={scroller} className="home-video-strip flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]" aria-label="فيديوهات الحصص">
        {videos.map((video) => (
          <article key={video.id} data-video-id={video.id} className="saudi-reveal saudi-video-card min-w-[calc(100%-2rem)] snap-start overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:min-w-[calc(50%-0.5rem)] lg:min-w-[calc(33.333%-0.75rem)]">
            <button type="button" onClick={() => setActiveVideo(video)} className="group block w-full text-right" aria-label={`تشغيل داخل الصفحة: ${video.title_ar}`}>
              <div className="relative aspect-video overflow-hidden bg-muted">
                {visibleVideoIds.has(video.id) ? <Image src={video.poster || `https://img.youtube.com/vi/${video.youtube_embed_id}/mqdefault.jpg`} alt="" fill sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 33vw" loading="lazy" fetchPriority="low" className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized /> : <div className="size-full bg-muted" aria-hidden="true" />}
                <span className="absolute inset-0 flex items-center justify-center bg-foreground/10"><span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><Play size={20} fill="currentColor" /></span></span>
              </div>
              <div className="p-4"><h3 className="font-bold text-foreground">{video.title_ar}</h3>{video.description_ar && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{video.description_ar}</p>}</div>
            </button>
          </article>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button type="button" onClick={() => move("previous")} className="rounded-full border border-border bg-background p-2 text-foreground" aria-label="الفيديو السابق"><ChevronRight size={20} /></button>
        <button type="button" onClick={() => move("next")} className="rounded-full border border-border bg-background p-2 text-foreground" aria-label="الفيديو التالي"><ChevronLeft size={20} /></button>
      </div>
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-4" role="dialog" aria-modal="true" aria-labelledby="landing-video-title" onMouseDown={(event) => event.target === event.currentTarget && setActiveVideo(null)}>
          <div className="w-full max-w-3xl rounded-2xl bg-card p-3 shadow-2xl">
            <div className="flex items-center justify-between gap-4 px-2 pb-3"><h2 id="landing-video-title" className="font-bold text-foreground">{activeVideo.title_ar}</h2><button type="button" onClick={() => setActiveVideo(null)} className="rounded-full p-2 text-foreground hover:bg-secondary" aria-label="إغلاق مشغل الفيديو"><X size={20} /></button></div>
            <div className="aspect-video overflow-hidden rounded-xl bg-muted">
              {activeVideo.videoUrl && /\.(mp4|webm|ogg)(\?|$)/i.test(activeVideo.videoUrl) ? <video controls preload="none" playsInline poster={activeVideo.poster} className="size-full" src={activeVideo.videoUrl} /> : activeVideo.youtube_embed_id ? <iframe className="size-full" src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtube_embed_id}?rel=0`} title={activeVideo.title_ar} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <p className="flex size-full items-center justify-center p-6 text-center text-muted-foreground">لا يتوفر مصدر فيديو مباشر لهذا المقطع حالياً.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
