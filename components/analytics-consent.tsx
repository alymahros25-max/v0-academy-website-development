"use client"

import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const CONSENT_COOKIE = "analytics_consent"

function readConsent(): boolean | null {
  if (typeof document === "undefined") return null
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1]
  return value === "granted" ? true : value === "denied" ? false : null
}

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)

  useEffect(() => {
    setConsent(readConsent())
  }, [])

  const chooseConsent = (value: boolean) => {
    document.cookie = `${CONSENT_COOKIE}=${value ? "granted" : "denied"}; Max-Age=31536000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`
    setConsent(value)
  }

  return (
    <>
      {consent === true && <><Analytics /><SpeedInsights /></>}
      {consent === null && (
        <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-background p-4 text-sm text-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-6">نستخدم تحليلات مجهولة لتحسين أداء الموقع. يمكنك القبول أو الرفض.</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => chooseConsent(false)} className="rounded-md border border-border px-3 py-2">رفض</button>
            <button type="button" onClick={() => chooseConsent(true)} className="rounded-md bg-primary px-3 py-2 text-primary-foreground">قبول</button>
          </div>
        </aside>
      )}
    </>
  )
}
