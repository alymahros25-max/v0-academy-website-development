'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { LandingVideo } from '@/lib/classroom-videos'

export function LandingVideoCarousel({ videos }: { videos: LandingVideo[] }) {
  const scroller = useRef<HTMLDivElement>(null)
  const move = (direction: 'next' | 'previous') => {
    scroller.current?.scrollBy({ left: direction === 'next' ? -340 : 340, behavior: 'smooth' })
  }

  return (
    <div className="relative mt-8">
      <div ref={scroller} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="فيديوهات الحصص">
        {videos.map((video) => (
          <article key={video.id} className="min-w-[calc(100%-2rem)] snap-start overflow-hidden rounded-2xl border border-border bg-background shadow-sm sm:min-w-[calc(50%-0.5rem)] lg:min-w-[calc(33.333%-0.75rem)]">
            <a href={`https://www.youtube.com/watch?v=${video.youtube_embed_id}`} target="_blank" rel="noreferrer" className="group block" aria-label={`تشغيل: ${video.title_ar}`}>
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img src={video.poster} alt="" loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-foreground/10"><span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><Play size={20} fill="currentColor" /></span></span>
              </div>
              <div className="p-4"><h3 className="font-bold text-foreground">{video.title_ar}</h3>{video.description_ar && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{video.description_ar}</p>}</div>
            </a>
          </article>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button type="button" onClick={() => move('previous')} className="rounded-full border border-border bg-background p-2 text-foreground" aria-label="الفيديو السابق"><ChevronRight size={20} /></button>
        <button type="button" onClick={() => move('next')} className="rounded-full border border-border bg-background p-2 text-foreground" aria-label="الفيديو التالي"><ChevronLeft size={20} /></button>
      </div>
    </div>
  )
}
