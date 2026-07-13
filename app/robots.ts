import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://quran-elhafez.com'

  return {
    rules: [
      // Allow all good bots
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'Sogou'],
        allow: '/',
        crawlDelay: 1,
      },
      // Standard rules for common bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/.well-known/ai.txt',
          '/*?*sort=',
          '/*?*filter=',
        ],
        crawlDelay: 2,
      },
      // Deny bad actors
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'YandexBot',
          'YandexMobileBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
