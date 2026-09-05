import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata-utils'
import QuranPageClient from './client'
import { CourseSchema } from '@/components/course-schema'

export const metadata: Metadata = generatePageMetadata('quran')

export default function QuranPage() {
  return (
    <>
      <CourseSchema
        nameAr="تحفيظ القرآن الكريم والتجويد"
        nameEn="Quran Memorization and Tajweed"
        descriptionAr="برنامج تفاعلي لتحفيظ القرآن الكريم وتعليم أحكام التجويد مع معلمين مؤهلين عبر الإنترنت."
        url="https://quran-elhafez.com/quran"
        image="https://quran-elhafez.com/images/teacher-quran.jpg"
        teaches={["Quranic Memorization", "Tajweed", "Islamic Education"]}
      />
      <QuranPageClient />
    </>
  )
}
