import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'تواصل معنا | أكاديمية الحافظ المتميز',
  description: 'تواصل مع أكاديمية الحافظ المتميز للاستفسار عن تحفيظ القرآن الكريم وتعليم اللغة العربية عبر الإنترنت.',
  alternates: getSeoAlternates('https://quran-elhafez.com/contact'),
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
