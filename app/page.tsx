import { Metadata } from 'next'
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/home/hero-section"
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

// Enable dynamic rendering for interactive sections while keeping static shell
const HomePageClient = dynamic(() => import('./client').then(m => m.default), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-muted" />
})

export default function HomePage() {
  return <HomePageClient />
}
