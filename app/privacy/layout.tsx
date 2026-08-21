import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | أكاديمية الحافظ المتميز',
  description: 'تعرف على كيفية حماية واستخدام بياناتك الشخصية عند استخدام خدمات أكاديمية الحافظ المتميز.',
  alternates: { canonical: 'https://quran-elhafez.com/privacy' },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
