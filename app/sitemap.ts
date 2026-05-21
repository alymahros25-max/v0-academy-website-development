import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alhafiz-academy.com'
  
  const staticPages = [
    '',
    '/about',
    '/quran',
    '/arabic',
    '/teachers',
    '/reviews',
    '/library',
    '/games',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
  ]

  return staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }))
}
