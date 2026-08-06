import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

const SCOPE = ['https://www.googleapis.com/auth/webmasters']

function getAuthClient() {
  const email = process.env.GSC_CLIENT_EMAIL
  const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !privateKey) {
    return null
  }

  return new JWT({ email, key: privateKey, scopes: SCOPE })
}

export async function GET(_request: NextRequest) {
  try {
    const auth = getAuthClient()

    if (!auth) {
      return NextResponse.json(
        { error: 'Google Search Console is not configured' },
        { status: 503 },
      )
    }

    const searchconsole = google.webmasters({
      version: 'v3',
      auth: auth as never,
    })
    const siteUrl = 'sc-domain:quran-elhafez.com'

    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['page'],
        rowLimit: 100,
      },
    })

    const pages = response.data.rows || []
    const indexedPages = pages.filter((page) => page.position).length
    const stats = {
      totalPages: pages.length,
      indexed: indexedPages,
      notIndexed: pages.length - indexedPages,
      clicks: pages.reduce((sum, page) => sum + (page.clicks || 0), 0),
      impressions: pages.reduce((sum, page) => sum + (page.impressions || 0), 0),
      avgPosition:
        pages.length > 0
          ? (
              pages.reduce((sum, page) => sum + (page.position || 0), 0) /
              pages.length
            ).toFixed(2)
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
      { error: 'Failed to fetch GSC data', details: String(error) },
      { status: 500 },
    )
  }
}
