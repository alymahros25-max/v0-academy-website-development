import { getPublishedClassroomVideos } from '@/lib/classroom-videos'
import { LandingVideoCarousel } from './LandingVideoCarousel'

export async function LandingPageVideoStrip() {
  const videos = await getPublishedClassroomVideos()
  if (!videos.length) return null

  return (
    <section className="border-y border-border bg-card px-5 py-14 sm:px-8" aria-labelledby="landing-videos-title">
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
