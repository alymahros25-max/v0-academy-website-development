"use client"

import { ReactNode } from "react"
import { I18nProvider, useI18n } from "@/lib/i18n"

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { dir, locale } = useI18n()
  return <div dir={dir} lang={locale}>{children}</div>
}

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </I18nProvider>
  )
}
