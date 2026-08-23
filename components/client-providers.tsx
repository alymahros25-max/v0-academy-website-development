"use client"

import { type ReactNode, useEffect } from "react"
import dynamic from "next/dynamic"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { usePathname } from "next/navigation"

const DeferredGA4Tracker = dynamic(() => import("@/components/ga4-tracker").then((module) => ({ default: module.GA4Tracker })), { ssr: false })

function LayoutWrapper({ children }: { children: ReactNode }) {
  const { dir, locale } = useI18n()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const isSaudiLanding = pathname === "/saudi-arabia"
  const isUaeLanding = pathname === "/united-arab-emirates"
  const isUnitedStatesLanding = pathname === "/united-states"
  const isCanadaLanding = pathname === "/canada"
  const isUnitedKingdomLanding = pathname === "/united-kingdom"
  const isAustraliaLanding = pathname === "/australia"

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [dir, locale])

  if (isAdmin || isSaudiLanding || isUaeLanding || isUnitedStatesLanding || isCanadaLanding || isUnitedKingdomLanding || isAustraliaLanding) {
    return <div dir={dir}>{children}</div>
  }

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
      <DeferredGA4Tracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  )
}

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </I18nProvider>
  )
}
