import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://quran-elhafez.com/account' },
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
