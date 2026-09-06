import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { getGoogleServiceAccountAuth } from '@/lib/google-auth'

const SCOPE = ['https://www.googleapis.com/auth/webmasters']
const SITE_URL = 'sc-domain:quran-elhafez.com'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const auth = getGoogleServiceAccountAuth(SCOPE)
    const searchconsole = google.webmasters({ version: 'v3', auth: auth as any })
    const response = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['page'],
        rowLimit: 100,
      },
    })

    const pages = response.data.rows ?? []
    const indexedPages = pages.filter((page) => page.position).length
    const stats = {
      totalPages: pages.length,
      indexed: indexedPages,
      notIndexed: pages.length - indexedPages,
      clicks: pages.reduce((sum, page) => sum + (page.clicks ?? 0), 0),
      impressions: pages.reduce((sum, page) => sum + (page.impressions ?? 0), 0),
      avgPosition: pages.length > 0
        ? (pages.reduce((sum, page) => sum + (page.position ?? 0), 0) / pages.length).toFixed(2)
        : 0,
    }

    return NextResponse.json({
      success: true,
      domain: 'quran-elhafez.com',
      data: stats,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[GSC API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GSC data' },
      { status: 500 },
    )
  }
}
