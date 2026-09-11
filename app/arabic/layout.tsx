import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata-utils'
import { CourseSchema } from '@/components/course-schema'

export const metadata: Metadata = generatePageMetadata('arabic')

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CourseSchema
        nameAr="تأسيس اللغة العربية"
        nameEn="Arabic Language Foundation"
        descriptionAr="برنامج تفاعلي لتأسيس القراءة والكتابة والإملاء والتعبير باللغة العربية مع متابعة دورية للطلاب."
        url="https://quran-elhafez.com/arabic"
        image="https://quran-elhafez.com/images/arabic-learning.webp"
        teaches={["Arabic Reading", "Arabic Writing", "Dictation", "Expression"]}
      />
      {children}
    </>
  )
}
