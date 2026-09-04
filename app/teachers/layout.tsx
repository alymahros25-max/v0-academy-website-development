import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'المعلمون | أكاديمية الحافظ المتميز',
  description: 'تعرف على فريق المعلمين المؤهلين لتعليم القرآن الكريم والتجويد واللغة العربية.',
  alternates: getSeoAlternates('https://quran-elhafez.com/teachers'),
}

export default function TeachersLayout({ children }: { children: React.ReactNode }) {
  return children
}
