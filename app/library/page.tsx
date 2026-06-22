import { Metadata } from 'next'
import { EnhancedLibraryPage } from './enhanced-page'

export const metadata: Metadata = {
  title: 'المكتبة الرقمية | أكاديمية الحافظ المتميز',
  description: 'مكتبة شاملة تتضمن الكتب الإسلامية، تلاوات قرآنية بأصوات الشيوخ المشهورين، أناشيد دينية، ومتون تجويدية',
  openGraph: {
    title: 'المكتبة الرقمية',
    description: 'مكتبة شاملة للمحتوى الإسلامي التعليمي',
    images: [{ url: '/og-library.png' }]
  }
}

export default function LibraryPage() {
  return <EnhancedLibraryPage />
}
