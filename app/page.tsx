import { Metadata } from 'next'
import dynamic from "next/dynamic"
import { AcademyBanner } from "@/components/home/academy-banner"
import { HeroSection } from "@/components/home/hero-section"
import { DeferredLandingVideoStrip } from "@/components/home/deferred-landing-video-strip"
import { AboutSection } from "@/components/home/about-section"
import { FeaturesSection } from "@/components/home/features-section"
import { StatsSection } from "@/components/home/stats-section"
import { Suspense } from "react"

// SSG with 1-hour revalidation (ISR)
export const revalidate = 3600

export const metadata: Metadata = {
  title: "أكاديمية الحافظ المتميز - تعليم القرآن الكريم والعربية أون لاين",
  description: "أكاديمية متخصصة في تعليم القرآن الكريم وتأسيس اللغة العربية للناطقين بغيرها، بمعلمين محترفين وبرامج مميزة",
  keywords: "تعليم القرآن، حفظ القرآن، تعليم عربي، تاجويد، معلمون",
  openGraph: {
    title: "أكاديمية الحافظ المتميز",
    description: "تعليم القرآن الكريم والعربية أون لاين",
    type: "website",
    locale: "ar_SA",
  },
}

const TestimonialsPreview = dynamic(
  () => import("@/components/home/testimonials-preview").then((module) => ({ default: module.TestimonialsPreview })),
  { ssr: true, loading: () => <div className="min-h-80 bg-muted" /> },
)

const CTASection = dynamic(
  () => import("@/components/home/cta-section").then((module) => ({ default: module.CTASection })),
  { ssr: true, loading: () => <div className="min-h-72 bg-muted" /> },
)

export default function HomePage() {
  return (
    <>
      <AcademyBanner />
      <HeroSection />
      <DeferredLandingVideoStrip />
      <FeaturesSection />
      <StatsSection />
      <Suspense fallback={<div className="min-h-80 bg-muted" />}>
        <TestimonialsPreview />
      </Suspense>
      <AboutSection />
      <Suspense fallback={<div className="min-h-72 bg-muted" />}>
        <CTASection />
      </Suspense>
    </>
  )
}
