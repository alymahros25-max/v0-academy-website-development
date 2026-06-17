import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://quran-elhafez.com'
const LANGUAGES = ['ar', 'en', 'fr'] as const
type Language = (typeof LANGUAGES)[number]

// Helper: Get language prefix for URL
const getLanguagePrefix = (lang: Language): string => {
  return lang === 'ar' ? '' : `/${lang}`
}

// Helper: Generate localized URLs with xhtml:link alternates
const generateLocalizedUrl = (
  route: string,
  priority: number,
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
): MetadataRoute.Sitemap => {
  const urls: MetadataRoute.Sitemap = []

  LANGUAGES.forEach((lang) => {
    const langPrefix = getLanguagePrefix(lang)
    const urlPath = route === '/' ? langPrefix : `${langPrefix}${route}`
    const fullUrl = `${BASE_URL}${urlPath === '' ? '/' : urlPath}`

    urls.push({
      url: fullUrl,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: changefreq,
      priority: priority,
      alternates: {
        languages: {
          ar: `${BASE_URL}${route === '/' ? '' : route}`,
          en: `${BASE_URL}/en${route === '/' ? '' : route}`,
          fr: `${BASE_URL}/fr${route === '/' ? '' : route}`,
          'x-default': `${BASE_URL}${route === '/' ? '' : route}`,
        },
      },
    })
  })

  return urls
}

// Helper: Get blog articles from Zapier storage or use defaults
function getBlogArticles(): string[] {
  try {
    const zapierFile = path.join(process.cwd(), 'data', 'zapier-articles.json')
    if (fs.existsSync(zapierFile)) {
      const data = JSON.parse(fs.readFileSync(zapierFile, 'utf-8'))
      return Object.keys(data)
    }
  } catch (error) {
    console.log('[v0] Using default blog articles for sitemap')
  }

  return [
    'quran-memorization-techniques',
    'arabic-foundation-importance',
    'online-learning-benefits',
  ]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = []

  // ============================================================
  // TIER 1: HOMEPAGE (Priority 1.0, daily)
  // ============================================================
  sitemap.push(...generateLocalizedUrl('/', 1.0, 'daily'))

  // ============================================================
  // TIER 2: CORE PAGES (Priority 0.9, weekly)
  // Main offerings: Quran, Arabic, About
  // ============================================================
  const corePages = ['/quran', '/arabic', '/about'] as const
  corePages.forEach((route) => {
    sitemap.push(...generateLocalizedUrl(route, 0.9, 'weekly'))
  })

  // ============================================================
  // TIER 3: SECONDARY PAGES (Priority 0.7, weekly)
  // Content and engagement pages
  // ============================================================
  const secondaryPages = [
    '/teachers',
    '/reviews',
    '/library',
    '/games',
    '/faq',
    '/blog',
    '/contact',
  ] as const
  secondaryPages.forEach((route) => {
    sitemap.push(...generateLocalizedUrl(route, 0.7, 'weekly'))
  })

  // ============================================================
  // TIER 4: BLOG ARTICLES (Priority 0.6, monthly)
  // Individual articles with language variants
  // ============================================================
  const blogArticles = getBlogArticles()
  blogArticles.forEach((slug) => {
    LANGUAGES.forEach((lang) => {
      const langPrefix = getLanguagePrefix(lang)
      const fullUrl = `${BASE_URL}${langPrefix}/blog/${slug}`

      sitemap.push({
        url: fullUrl,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            ar: `${BASE_URL}/blog/${slug}`,
            en: `${BASE_URL}/en/blog/${slug}`,
            fr: `${BASE_URL}/fr/blog/${slug}`,
            'x-default': `${BASE_URL}/blog/${slug}`,
          },
        },
      })
    })
  })

  // ============================================================
  // TIER 5: LEGAL/UTILITY PAGES (Priority 0.3, monthly)
  // Privacy and terms of service
  // ============================================================
  const legalPages = ['/privacy', '/terms'] as const
  legalPages.forEach((route) => {
    sitemap.push(...generateLocalizedUrl(route, 0.3, 'monthly'))
  })

  return sitemap
}
