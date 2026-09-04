import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  alternates: getSeoAlternates('https://quran-elhafez.com/arabic'),
}

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return children
}
