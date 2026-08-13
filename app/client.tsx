'use client'

import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/home/hero-section'
import { AboutSection } from '@/components/home/about-section'
import { FeaturesSection } from '@/components/home/features-section'
import { StatsSection } from '@/components/home/stats-section'
import { Suspense } from 'react'

// Heavy components loaded dynamically
const TestimonialsPreview = dynamic(
  () => import('@/components/home/testimonials-preview').then(m => ({ default: m.TestimonialsPreview })),
  {
    loading: () => <div className="min-h-80 bg-gradient-to-b from-muted/50 to-muted/25 animate-pulse" />,
    ssr: true,
  }
)

const CTASection = dynamic(
  () => import('@/components/home/cta-section').then(m => ({ default: m.CTASection })),
  {
    loading: () => <div className="min-h-72 bg-gradient-to-b from-primary/5 to-primary/10 animate-pulse" />,
    ssr: true,
  }
)

export default function HomePageClient() {
  return (
    <>
      {/* Above the fold - Critical, rendered as static HTML */}
      <HeroSection />
      <FeaturesSection />
      <StatsSection />

      {/* Below the fold - Loaded dynamically */}
      <Suspense fallback={<div className="min-h-80 bg-muted animate-pulse" />}>
        <TestimonialsPreview />
      </Suspense>

      <AboutSection />

      <Suspense fallback={<div className="min-h-72 bg-muted animate-pulse" />}>
        <CTASection />
      </Suspense>
    </>
  )
}
