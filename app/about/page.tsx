import { Metadata } from 'next'
import AboutPageClient from './client'
import { getPublicContent } from '@/lib/public-content'
import { getSeoAlternates } from '@/lib/seo-metadata'

export const revalidate = 3600

export const metadata: Metadata = {
  title: "من نحن - أكاديمية الحافظ المتميز",
  description: "تعرف على أكاديمية الحافظ المتميز، رؤيتنا وقيمنا ومعلمونا المتخصصون في تعليم القرآن الكريم والعربية",
  keywords: "من نحن، أكاديمية، معلمون، القرآن",
  alternates: getSeoAlternates('https://quran-elhafez.com/about'),
  openGraph: {
    title: "من نحن - أكاديمية الحافظ المتميز",
    description: "رحلتنا وقيمنا في تعليم القرآن والعربية",
  },
}

export default async function AboutPage() {
  const content = await getPublicContent([
    'about_badge',
    'about_title',
    'about_description',
    'mission_title',
    'mission_description',
    'vision_title',
    'vision_description',
  ])

  return <AboutPageClient content={content} />
}
