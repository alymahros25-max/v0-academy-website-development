import type { Metadata } from "next"
import { AdminLayoutProvider } from "@/components/admin/admin-layout-content"

export const metadata: Metadata = {
  alternates: { canonical: 'https://quran-elhafez.com/admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutProvider>{children}</AdminLayoutProvider>
}
