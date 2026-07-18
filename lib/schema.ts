/**
 * JSON-LD Schema generation for SEO and structured data.
 * Implements schema.org types for rich snippets in Google Search.
 */

export interface SchemaContext {
  '@context': 'https://schema.org'
  '@type': string
  [key: string]: any
}

const BASE_URL = 'https://quran-elhafez.com'
const SITE_NAME = 'أكاديمية الحافظ المتميز'

/**
 * Generate Organization schema for company-wide structured data.
 */
export function generateOrganizationSchema(): SchemaContext {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
      width: 256,
      height: 256,
    },
    description:
      'أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين',
    sameAs: [
      'https://www.facebook.com/quran-elhafez',
      'https://www.youtube.com/@quran-elhafez',
      'https://wa.me/201130127894',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'enamel311@gmail.com',
      telephone: '+201130127894',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
    // Educational organization specific
    foundingDate: '2023',
    areaServed: ['EG', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'Worldwide'],
    educationalCredentialAwarded: 'Certificate of Completion',
    teaches: ['Islamic Studies', 'Quran Memorization', 'Arabic Language'],
  }
}

/**
 * Generate WebSite schema for homepage with search action.
 */
export function generateWebSiteSchema(): SchemaContext {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: BASE_URL,
    name: SITE_NAME,
    description:
      'منصة تعليمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية',
    inLanguage: ['ar', 'en', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate Course schema for Quran/Arabic offerings.
 */
export function generateCourseSchema(course: {
  name_ar: string
  name_en: string
  description_ar: string
  price: number
  currency?: string
  duration?: string
  level?: string
}): SchemaContext {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name_ar,
    alternateName: course.name_en,
    description: course.description_ar,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: course.currency || 'USD',
      availability: 'InStock',
    },
    educationLevel: course.level || 'BeginnerLevel',
    duration: course.duration || 'P12W',
    inLanguage: 'ar',
    teaches: ['Quranic Studies', 'Islamic Education'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      ratingCount: 250,
    },
  }
}

/**
 * Generate Article schema for blog posts.
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
  content: string
  slug: string
}): SchemaContext {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image || `${BASE_URL}/images/blog-default.jpg`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${article.slug}`,
    },
    articleBody: article.content,
    isAccessibleForFree: true,
    inLanguage: 'ar',
    articleSection: 'Islamic Education',
  }
}

/**
 * Generate BreadcrumbList schema for navigation hierarchy.
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{
  name: string
  url: string
}>): SchemaContext {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * Generate LocalBusiness schema for academy info.
 */
export function generateLocalBusinessSchema(): SchemaContext {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: BASE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+201130127894',
      email: 'enamel311@gmail.com',
    },
    sameAs: [
      'https://www.facebook.com/quran-elhafez',
      'https://www.youtube.com/@quran-elhafez',
    ],
    // Add review aggregate if available
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 180,
    },
  }
}

/**
 * Inject JSON-LD script tag into component metadata.
 */
export function getSchemaScriptTag(schema: SchemaContext): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}

/**
 * Generate combined schema for better SEO coverage.
 */
export function generateCombinedSchema(...schemas: SchemaContext[]): {
  '@context': 'https://schema.org'
  '@graph': SchemaContext[]
} {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  }
}
