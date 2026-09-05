import type { Metadata } from 'next'
import { getSeoAlternates } from '@/lib/seo-metadata'
import { CourseSchema } from '@/components/course-schema'

export const metadata: Metadata = {
  alternates: getSeoAlternates('https://quran-elhafez.com/arabic'),
}

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CourseSchema
        nameAr="تأسيس اللغة العربية"
        nameEn="Arabic Language Foundation"
        descriptionAr="برنامج تفاعلي لتأسيس القراءة والكتابة والإملاء والتعبير باللغة العربية مع متابعة دورية للطلاب."
        url="https://quran-elhafez.com/arabic"
        image="https://quran-elhafez.com/images/arabic-learning.jpg"
        teaches={["Arabic Reading", "Arabic Writing", "Dictation", "Expression"]}
      />
      {children}
    </>
  )
}
