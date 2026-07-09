import { NextRequest, NextResponse } from 'next/server'
import { JWT } from 'google-auth-library'

const INDEXING_API = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
const SCOPE = ['https://www.googleapis.com/auth/indexing']

async function getAccessToken() {
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

  const token = await auth.getAccessToken()
  return token.token
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      return NextResponse.json(
        { error: 'Google credentials not configured' },
        { status: 500 }
      )
    }

    const { url, type = 'URL_UPDATED' } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch(INDEXING_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        type,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to request indexing', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      url,
      status: 'Indexing request submitted',
      response: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Indexing API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process indexing request', details: String(error) },
      { status: 500 }
    )
  }
}

// GET for batch status check
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const urls = searchParams.getAll('url')

  if (urls.length === 0) {
    return NextResponse.json(
      { error: 'At least one URL is required' },
      { status: 400 }
    )
  }

  try {
    const accessToken = await getAccessToken()
    const results = []

    for (const url of urls) {
      const response = await fetch(INDEXING_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          type: 'URL_UPDATED',
        }),
      })

      const data = await response.json()
      results.push({
        url,
        success: response.ok,
        status: data,
      })
    }

    return NextResponse.json({
      success: true,
      submitted: results.length,
      results,
    })
  } catch (error) {
    console.error('[Indexing API] Batch error:', error)
    return NextResponse.json(
      { error: 'Failed to process batch request' },
      { status: 500 }
    )
  }
}
