import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://quran-elhafez.com'

/**
 * Get dynamic blog articles from Supabase.
 * Falls back to file system if Supabase is unavailable.
 */
async function getDynamicBlogArticles(): Promise<string[]> {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase env vars missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('slug, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return (articles || []).map((a) => a.slug)
  } catch (error) {
    console.warn('[sitemap] Failed to fetch from Supabase:', error)
    return getBlogArticlesFromFilesystem()
  }
}

/**
 * Get blog articles from filesystem as fallback.
 */
function getBlogArticlesFromFilesystem(): string[] {
  try {
    const zapierFile = path.join(process.cwd(), 'data', 'zapier-articles.json')
    if (fs.existsSync(zapierFile)) {
      const data = JSON.parse(fs.readFileSync(zapierFile, 'utf-8'))
      return Object.keys(data)
    }
  } catch (error) {
    console.log('[sitemap] Using default blog articles')
  }

  return [
    'quran-memorization-techniques',
    'arabic-foundation-importance',
    'online-learning-benefits',
  ]
}

const generateLocalizedUrl = (
  route: string,
  priority: number,
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
): MetadataRoute.Sitemap => [{
  url: `${BASE_URL}${route === '/' ? '/' : route}`,
  lastModified: new Date().toISOString().split('T')[0],
  changeFrequency: changefreq,
  priority,
}]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // ============================================================
  // TIER 1: HOMEPAGE (Priority 1.0, daily)
  // ============================================================
  sitemap.push(...generateLocalizedUrl('/', 1.0, 'daily'))

  // ============================================================
  // TIER 2: CORE PAGES (Priority 0.9, weekly)
  // Main offerings: Quran, Arabic, About
  // ============================================================
  const corePages = ['/quran', '/arabic', '/about', '/saudi-arabia', '/united-arab-emirates', '/united-states'] as const
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
    '/games',
    '/faq',
    '/blog',
    '/contact',
    '/library',
    '/refund-policy',
  ] as const
  secondaryPages.forEach((route) => {
    sitemap.push(...generateLocalizedUrl(route, 0.7, 'weekly'))
  })

  // ============================================================
  // TIER 5: CLASSROOM MOMENTS (Priority 0.75, weekly)
  // User-generated and featured content
  // ============================================================
  sitemap.push(...generateLocalizedUrl('/classroom-moments', 0.75, 'weekly'))

  // ============================================================
  // TIER 6: BLOG ARTICLES (Priority 0.6, monthly)
  // Individual articles with language variants
  // ============================================================
  const blogArticles = await getDynamicBlogArticles()
  blogArticles
    .filter((slug) => slug && slug !== '-5-')
    .forEach((slug) => {
    sitemap.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.6,
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
