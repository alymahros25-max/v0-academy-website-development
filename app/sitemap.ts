import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://quran-elhafez.com'

type BlogArticle = { slug: string; lastModified?: string }

async function getDynamicBlogArticles(): Promise<BlogArticle[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase env vars missing')

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('slug, created_at, updated_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error

    return (articles || []).map((article) => ({
      slug: article.slug,
      lastModified: article.updated_at || article.created_at,
    }))
  } catch (error) {
    console.warn('[sitemap] Failed to fetch from Supabase:', error)
    return getBlogArticlesFromFilesystem()
  }
}

function getBlogArticlesFromFilesystem(): BlogArticle[] {
  return [
    { slug: 'quran-memorization-techniques' },
    { slug: 'arabic-foundation-importance' },
    { slug: 'online-learning-benefits' },
  ]
}

const staticRoutes = [
  '/',
  '/quran',
  '/arabic',
  '/about',
  '/saudi-arabia',
  '/united-arab-emirates',
  '/united-states',
  '/canada',
  '/united-kingdom',
  '/australia',
  '/germany',
  '/teachers',
  '/reviews',
  '/games',
  '/faq',
  '/blog',
  '/contact',
  '/library',
  '/classroom-moments',
  '/refund-policy',
  '/privacy',
  '/terms',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route === '/' ? '/' : route}`,
  }))

  const blogEntries: MetadataRoute.Sitemap = (await getDynamicBlogArticles())
    .filter(({ slug }) => slug && slug !== '-5-')
    .map(({ slug, lastModified }) => ({
      url: `${BASE_URL}/blog/${slug}`,
      ...(lastModified ? { lastModified } : {}),
    }))

  return [...staticEntries, ...blogEntries]
}
