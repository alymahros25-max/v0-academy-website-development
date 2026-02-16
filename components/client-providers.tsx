"use client"

import { type ReactNode, useEffect } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { usePathname } from "next/navigation"

function LayoutWrapper({ children }: { children: ReactNode }) {
  const { dir, locale } = useI18n()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [dir, locale])

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
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
