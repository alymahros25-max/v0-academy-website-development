import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'مدونة أكاديمية الحافظ المتميز',
  description: 'مقالات ونصائح عملية في تحفيظ القرآن الكريم والتجويد وتعليم اللغة العربية.',
  alternates: getSeoAlternates('https://quran-elhafez.com/blog'),
  openGraph: {
    title: 'مدونة أكاديمية الحافظ المتميز',
    description: 'مقالات ونصائح عملية في تحفيظ القرآن الكريم والتجويد وتعليم اللغة العربية.',
    url: 'https://quran-elhafez.com/blog',
    type: 'website',
    locale: 'ar_SA',
    images: [{ url: 'https://quran-elhafez.com/images/og-default.webp', width: 1200, height: 630, alt: 'أكاديمية الحافظ المتميز' }],
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
