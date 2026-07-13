import { Metadata } from 'next'
import AboutPageClient from './client'

export const revalidate = 3600

export const metadata: Metadata = {
  title: "من نحن - أكاديمية الحافظ المتميز",
  description: "تعرف على أكاديمية الحافظ المتميز، رؤيتنا وقيمنا ومعلمونا المتخصصون في تعليم القرآن الكريم والعربية",
  keywords: "من نحن، أكاديمية، معلمون، القرآن",
  openGraph: {
    title: "من نحن - أكاديمية الحافظ المتميز",
    description: "رحلتنا وقيمنا في تعليم القرآن والعربية",
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
