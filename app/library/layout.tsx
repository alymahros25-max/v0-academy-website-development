import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'المكتبة التعليمية | أكاديمية الحافظ المتميز',
  description: 'مكتبة تعليمية رقمية لمصادر تحفيظ القرآن الكريم والتجويد واللغة العربية.',
  alternates: getSeoAlternates('https://quran-elhafez.com/library'),
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children
}
