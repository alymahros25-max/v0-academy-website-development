import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'مدونة أكاديمية الحافظ المتميز',
  description: 'مقالات ونصائح عملية في تحفيظ القرآن الكريم والتجويد وتعليم اللغة العربية.',
  alternates: { canonical: 'https://quran-elhafez.com/blog' },
  openGraph: {
    title: 'مدونة أكاديمية الحافظ المتميز',
    description: 'مقالات ونصائح عملية في تحفيظ القرآن الكريم والتجويد وتعليم اللغة العربية.',
    url: 'https://quran-elhafez.com/blog',
    type: 'website',
    locale: 'ar_SA',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
