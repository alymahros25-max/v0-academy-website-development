import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'شروط الاستخدام | أكاديمية الحافظ المتميز',
  description: 'اطلع على شروط استخدام موقع وخدمات أكاديمية الحافظ المتميز التعليمية.',
  alternates: { canonical: 'https://quran-elhafez.com/terms' },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
