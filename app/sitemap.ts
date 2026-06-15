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
    { slug: 'quran-memorization-techniques', title: 'تقنيات حفظ القرآن' },
    { slug: 'arabic-foundation-importance', title: 'أهمية التأسيس العربي' },
    { slug: 'online-learning-benefits', title: 'فوائد التعليم الإلكتروني' },
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
