import { generateCourseSchema } from '@/lib/schema'

type CourseSchemaProps = {
  nameAr: string
  nameEn: string
  descriptionAr: string
  url: string
  image: string
  teaches: string[]
}

export function CourseSchema({ nameAr, nameEn, descriptionAr, url, image, teaches }: CourseSchemaProps) {
  const schema = {
    ...generateCourseSchema({
      name_ar: nameAr,
      name_en: nameEn,
      description_ar: descriptionAr,
      url,
      image,
      level: 'BeginnerLevel',
      duration: 'P12W',
    }),
    teaches,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
