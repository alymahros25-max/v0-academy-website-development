import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

const SCOPE = ['https://www.googleapis.com/auth/webmasters']

async function getAuthClient() {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: '0a9f7f516a4a03fa1410e5b874b50110eedaea82',
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: '114179116031642310748',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/quran-elhafez%40quran-elhafez.iam.gserviceaccount.com',
  }

  const auth = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: SCOPE,
  })

  return auth
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      return NextResponse.json(
        { error: 'Google credentials not configured' },
        { status: 500 }
      )
    }

    const auth = await getAuthClient()
    const searchconsole = google.webmasters({ version: 'v3', auth })
    const siteUrl = `sc-domain:${process.env.GOOGLE_SEARCH_CONSOLE_DOMAIN}`

    // Get indexing status
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['page'],
        rowLimit: 100,
      },
    })

    const pages = response.data.rows || []
    const stats = {
      totalPages: pages.length,
      indexed: pages.filter((p: any) => p.position).length,
      notIndexed: pages.length - (pages.filter((p: any) => p.position).length || 0),
      clicks: pages.reduce((sum: number, p: any) => sum + (p.clicks || 0), 0),
      impressions: pages.reduce((sum: number, p: any) => sum + (p.impressions || 0), 0),
      avgPosition: pages.length > 0
        ? (pages.reduce((sum: number, p: any) => sum + (p.position || 0), 0) / pages.length).toFixed(2)
        : 0,
    }

    return NextResponse.json({
      success: true,
      domain: process.env.GOOGLE_SEARCH_CONSOLE_DOMAIN,
      data: stats,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[GSC API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GSC data', details: String(error) },
      { status: 500 }
    )
  }
}
