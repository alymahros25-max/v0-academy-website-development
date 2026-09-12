import { Metadata } from 'next'
import dynamic from "next/dynamic"
import { AcademyBanner } from "@/components/home/academy-banner"
import { HeroSection } from "@/components/home/hero-section"
import { DeferredLandingVideoStrip } from "@/components/home/deferred-landing-video-strip"
import { HomeContentSections } from "@/components/home/home-content-sections"
import { Suspense } from "react"
import { getPublicContent } from "@/lib/public-content-server"

// SSG with 1-hour revalidation (ISR)
export const revalidate = 3600

export const metadata: Metadata = {
  title: "تعلّم القرآن الكريم واللغة العربية أونلاين | أكاديمية الحافظ المتميز",
  description: "حصص فردية أونلاين لتعليم القرآن الكريم والتجويد وتأسيس اللغة العربية، مع خطة تناسب مستوى الطالب وهدفه.",
  keywords: "تعليم القرآن، حفظ القرآن، تعليم عربي، تاجويد، معلمون",
  openGraph: {
    title: "تعلّم القرآن الكريم واللغة العربية أونلاين | أكاديمية الحافظ المتميز",
    description: "حصص فردية لتعليم القرآن الكريم والتجويد وتأسيس اللغة العربية.",
    type: "website",
    locale: "ar_SA",
    images: [{ url: "https://quran-elhafez.com/images/og-default.webp", width: 1200, height: 630, alt: "أكاديمية الحافظ المتميز" }],
  },
}

const CTASection = dynamic(
  () => import("@/components/home/cta-section").then((module) => ({ default: module.CTASection })),
  { ssr: true, loading: () => <div className="min-h-72 bg-muted" /> },
)

export default async function HomePage() {
  const content = await getPublicContent([
    "hero_title",
    "hero_subtitle",
    "about_badge",
    "about_title",
    "about_description",
    "mission_title",
    "mission_description",
    "vision_title",
    "vision_description",
    "goals_title",
    "goals_description",
  ])

  return (
    <>
      <AcademyBanner />
      <HeroSection content={content} />
      <HomeContentSections />
      <DeferredLandingVideoStrip />
      <Suspense fallback={<div className="min-h-72 bg-muted" />}>
        <CTASection />
      </Suspense>
    </>
  )
}
