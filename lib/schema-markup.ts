// Schema.org structured data markup generator

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'أكاديمية الحافظ المتميز',
  'alternateName': 'Al-Hafiz Al-Mutamayez Academy',
  'url': 'https://quran-elhafez.com',
  'logo': 'https://quran-elhafez.com/images/logo.png',
  'description': 'أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين',
  'sameAs': [
    'https://www.facebook.com/alhafizacademy',
    'https://www.instagram.com/alhafizacademy',
    'https://www.twitter.com/alhafizacademy',
  ],
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'Customer Service',
    'email': 'enamel311@gmail.com',
    'areaServed': 'Worldwide',
    'url': 'https://wa.me/?text=مرحبا+..اريد+معرفة+تفاصيل+عن+التحفيظ+للقران',
  },
})

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': item.url,
  })),
})

export const generateArticleSchema = (article: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image: string
  content: string
  url: string
  readingTime: number
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  'headline': article.title,
  'description': article.description,
  'image': article.image,
  'datePublished': new Date(article.datePublished).toISOString(),
  'dateModified': article.dateModified ? new Date(article.dateModified).toISOString() : new Date(article.datePublished).toISOString(),
  'author': {
    '@type': 'Organization',
    'name': article.author,
  },
  'publisher': {
    '@type': 'Organization',
    'name': 'أكاديمية الحافظ المتميز',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://quran-elhafez.com/images/logo.png',
    },
  },
  'mainEntityOfPage': {
    '@type': 'WebPage',
    '@id': article.url,
  },
  'articleBody': article.content,
})

export const generateCourseSchema = (course: {
  name: string
  description: string
  provider: string
  price: string
  currency: string
  duration: string
  instructor: string
  image: string
  url: string
  ratingValue?: number
  ratingCount?: number
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  'name': course.name,
  'description': course.description,
  'provider': {
    '@type': 'Organization',
    'name': course.provider,
  },
  'price': course.price,
  'priceCurrency': course.currency,
  'duration': `PT${course.duration}H`,
  'instructor': {
    '@type': 'Person',
    'name': course.instructor,
  },
  'image': course.image,
  'url': course.url,
  ...(course.ratingValue && {
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': course.ratingValue,
      'ratingCount': course.ratingCount,
    },
  }),
})

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer,
    },
  })),
})

export const generateLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': 'أكاديمية الحافظ المتميز',
  'image': 'https://quran-elhafez.com/images/hero-children.jpg',
  'description': 'أكاديمية عالمية متخصصة في تحفيظ القرآن الكريم وتأسيس اللغة العربية',
  'email': 'enamel311@gmail.com',
  'areaServed': {
    '@type': 'Country',
    'name': 'العالم',
  },
  'priceRange': '$$',
  'sameAs': [
    'https://www.facebook.com/alhafizacademy',
    'https://www.instagram.com/alhafizacademy',
  ],
  'contactPoint': {
    '@type': 'ContactPoint',
    'url': 'https://wa.me/?text=مرحبا+..اريد+معرفة+تفاصيل+عن+التحفيظ+للقران',
  },
})

export const generateProductSchema = (product: {
  name: string
  description: string
  image: string
  price: string
  currency: string
  availability: 'InStock' | 'OutOfStock'
  ratingValue?: number
  ratingCount?: number
  url: string
}) => ({
  '@context': 'https://schema.org/',
  '@type': 'Product',
  'name': product.name,
  'image': product.image,
  'description': product.description,
  'offers': {
    '@type': 'Offer',
    'url': product.url,
    'priceCurrency': product.currency,
    'price': product.price,
    'availability': `https://schema.org/${product.availability}`,
  },
  ...(product.ratingValue && {
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': product.ratingValue,
      'ratingCount': product.ratingCount,
    },
  }),
})

export const generateWebPageSchema = (page: {
  title: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': page.title,
  'description': page.description,
  'url': page.url,
  ...(page.image && { 'image': page.image }),
  ...(page.datePublished && { 'datePublished': new Date(page.datePublished).toISOString() }),
  ...(page.dateModified && { 'dateModified': new Date(page.dateModified).toISOString() }),
  'publisher': {
    '@type': 'Organization',
    'name': 'أكاديمية الحافظ المتميز',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://quran-elhafez.com/images/logo.png',
    },
  },
})

// Helper to render schema markup as script tag content
export function renderSchemaMarkup(schema: any): string {
  return JSON.stringify(schema)
}

// Structured data component helper
export interface SchemaProps {
  type: 'organization' | 'article' | 'course' | 'faq' | 'localBusiness' | 'product' | 'webpage' | 'breadcrumb'
  data: any
}

export default {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateCourseSchema,
  generateFAQSchema,
  generateLocalBusinessSchema,
  generateProductSchema,
  generateWebPageSchema,
  renderSchemaMarkup,
}
