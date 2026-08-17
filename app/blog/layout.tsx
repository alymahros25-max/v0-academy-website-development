import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://quran-elhafez.com/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
