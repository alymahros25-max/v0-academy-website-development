import { ReactNode } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة التحكم - أكاديمية الحافظ المتميز",
  description: "نظام إدارة المحتوى والموقع",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div dir="rtl" lang="ar">
      {children}
    </div>
  )
}
