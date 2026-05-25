import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quran-elhafez.com'
  
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
    '/blog',
    '/account',
    '/contact',
    '/privacy',
    '/terms',
  ]

  const blogPages = [
    { slug: 'quran-memorization-tips', title: 'نصائح لحفظ القرآن' },
    { slug: 'arabic-learning-methods', title: 'طرق تعلم اللغة العربية' },
    { slug: 'online-education-benefits', title: 'فوائد التعليم الإلكتروني' },
  ]

  const sitemapEntries = [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    })),
    ...blogPages.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return sitemapEntries
}
