import { NextRequest, NextResponse } from 'next/server'
import { getGoogleServiceAccountAuth } from '@/lib/google-auth'
import { requireAdmin } from '@/lib/api-auth'

const INDEXING_API = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
const SCOPE = ['https://www.googleapis.com/auth/indexing']
const ALLOWED_HOSTS = new Set(['quran-elhafez.com', 'www.quran-elhafez.com'])
const MAX_BATCH_SIZE = 20

type IndexingNotificationType = 'URL_UPDATED' | 'URL_DELETED'

function validateIndexingUrl(value: string): string | null {
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) return null
    return parsed.toString()
  } catch {
    return null
  }
}

function parseNotificationType(value: unknown): IndexingNotificationType {
  return value === 'URL_DELETED' ? 'URL_DELETED' : 'URL_UPDATED'
}

async function getAccessToken(): Promise<string> {
  const auth = getGoogleServiceAccountAuth(SCOPE)
  const token = await auth.getAccessToken()
  if (!token.token) throw new Error('Google access token was not returned')
  return token.token
}

async function submitIndexingRequest(url: string, type: IndexingNotificationType, accessToken: string) {
  const response = await fetch(INDEXING_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type }),
    signal: AbortSignal.timeout(10_000),
  })

  const data = await response.json().catch(() => null)
  return { response, data }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = (await request.json()) as { url?: unknown; type?: unknown }
    const url = typeof body.url === 'string' ? validateIndexingUrl(body.url) : null
    if (!url) {
      return NextResponse.json({ error: 'A valid HTTPS quran-elhafez.com URL is required' }, { status: 400 })
    }

    const type = parseNotificationType(body.type)
    const accessToken = await getAccessToken()
    const { response, data } = await submitIndexingRequest(url, type, accessToken)

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to request indexing' }, { status: response.status })
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
      { error: 'Failed to process indexing request' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const rawUrls = new URL(request.url).searchParams.getAll('url')
  if (rawUrls.length === 0 || rawUrls.length > MAX_BATCH_SIZE) {
    return NextResponse.json(
      { error: `Provide between 1 and ${MAX_BATCH_SIZE} URLs` },
      { status: 400 },
    )
  }

  const urls = rawUrls.map(validateIndexingUrl)
  if (urls.some((url): url is null => url === null)) {
    return NextResponse.json(
      { error: 'All URLs must be valid HTTPS quran-elhafez.com URLs' },
      { status: 400 },
    )
  }

  try {
    const accessToken = await getAccessToken()
    const results = []
    for (const url of urls as string[]) {
      const { response, data } = await submitIndexingRequest(url, 'URL_UPDATED', accessToken)
      results.push({ url, success: response.ok, status: response.ok ? data : 'Indexing request failed' })
    }

    return NextResponse.json({
      success: results.every((result) => result.success),
      submitted: results.length,
      results,
    })
  } catch (error) {
    console.error('[Indexing API] Batch error:', error)
    return NextResponse.json(
      { error: 'Failed to process batch request' },
      { status: 500 },
    )
  }
}
