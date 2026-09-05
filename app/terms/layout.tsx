import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'شروط الاستخدام | أكاديمية الحافظ المتميز',
  description: 'اطلع على شروط استخدام موقع وخدمات أكاديمية الحافظ المتميز التعليمية.',
  alternates: getSeoAlternates('https://quran-elhafez.com/terms'),
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
