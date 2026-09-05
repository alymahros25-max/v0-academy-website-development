import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'آراء الطلاب وأولياء الأمور | أكاديمية الحافظ المتميز',
  description: 'تجارب الطلاب وأولياء الأمور مع برامج تحفيظ القرآن الكريم وتعليم العربية عبر الإنترنت.',
  alternates: getSeoAlternates('https://quran-elhafez.com/reviews'),
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
