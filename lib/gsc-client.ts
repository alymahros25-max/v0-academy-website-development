/**
 * Google Search Console API Client
 * Handles indexing status checks and sitemap queries
 */

interface IndexingStatus {
  url: string
  status: 'indexed' | 'discovered' | 'pending' | 'error' | 'unknown'
  lastCrawled?: string
  lastIndexed?: string
  issue?: string
}

interface SitemapStatus {
  url: string
  type: string
  indexed: number
  submitted: number
  warnings: number
  errors: number
  isPending: boolean
}

/**
 * Fetch indexing status for a list of URLs from Google Search Console
 * This requires the Google Search Console API credentials
 */
export async function getIndexingStatus(urls: string[]): Promise<IndexingStatus[]> {
  try {
    const response = await fetch('/api/gsc/indexing-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    })

    if (!response.ok) {
      throw new Error(`GSC API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[GSC] Error fetching indexing status:', error)
    return urls.map(url => ({
      url,
      status: 'unknown' as const,
      issue: 'Failed to fetch status',
    }))
  }
}

/**
 * Fetch sitemap status from Google Search Console
 */
export async function getSitemapStatus(): Promise<SitemapStatus[]> {
  try {
    const response = await fetch('/api/gsc/sitemap-status')

    if (!response.ok) {
      throw new Error(`GSC API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[GSC] Error fetching sitemap status:', error)
    return []
  }
}

/**
 * Request indexing for a specific URL
 */
export async function requestIndexing(url: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/gsc/request-indexing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to request indexing')
    }

    return data
  } catch (error) {
    console.error('[GSC] Error requesting indexing:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get the main sitemap URLs from the site
 */
export const MAIN_SITEMAP_URLS = [
  '/',
  '/about',
  '/teachers',
  '/quran',
  '/arabic',
  '/blog',
  '/games',
  '/classroom-moments',
  '/library',
  '/contact',
  '/faq',
  '/reviews',
]
