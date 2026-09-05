import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | أكاديمية الحافظ المتميز',
  description: 'تعرف على كيفية حماية واستخدام بياناتك الشخصية عند استخدام خدمات أكاديمية الحافظ المتميز.',
  alternates: getSeoAlternates('https://quran-elhafez.com/privacy'),
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
