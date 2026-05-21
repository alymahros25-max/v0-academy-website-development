import { SchemaProps, renderSchemaMarkup, generateOrganizationSchema, generateBreadcrumbSchema, generateArticleSchema, generateCourseSchema, generateFAQSchema, generateLocalBusinessSchema, generateProductSchema, generateWebPageSchema } from '@/lib/schema-markup'

const schemaGenerators: Record<SchemaProps['type'], (data: any) => any> = {
  'organization': generateOrganizationSchema,
  'article': generateArticleSchema,
  'course': generateCourseSchema,
  'faq': generateFAQSchema,
  'localBusiness': generateLocalBusinessSchema,
  'product': generateProductSchema,
  'webpage': generateWebPageSchema,
  'breadcrumb': generateBreadcrumbSchema,
}

interface SchemaMarkupProps extends SchemaProps {
  skipRender?: boolean
}

export function SchemaMarkup({ type, data, skipRender }: SchemaMarkupProps) {
  const generator = schemaGenerators[type]
  if (!generator) return null

  const schema = generator(data)
  const json = renderSchemaMarkup(schema)

  if (skipRender) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: json,
      }}
      suppressHydrationWarning
    />
  )
}
