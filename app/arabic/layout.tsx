import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://quran-elhafez.com/arabic' },
}

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return children
}
