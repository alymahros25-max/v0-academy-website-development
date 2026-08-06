import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Allowed paths to revalidate — prevents abuse
const ALLOWED_PATHS = [
  '/classroom-moments',
  '/library',
  '/games',
  '/',
]

/**
 * GET /api/revalidate?path=/classroom-moments
 * GET /api/revalidate?tag=classroom-videos
 *
 * Called by admin forms after successful saves to flush the ISR cache
 * immediately so changes appear on the public site without waiting for
 * the 60-second revalidation window.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const tag = searchParams.get('tag')

  if (!path && !tag) {
    return NextResponse.json({ error: 'path or tag query param required' }, { status: 400 })
  }

  try {
    if (tag) {
      revalidateTag(tag, 'max')
      return NextResponse.json({ revalidated: true, tag })
    }

    if (path) {
      if (!ALLOWED_PATHS.includes(path)) {
        return NextResponse.json({ error: 'Path not allowed' }, { status: 403 })
      }
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    }
  } catch (err) {
    return NextResponse.json({ error: 'Revalidation failed', detail: String(err) }, { status: 500 })
  }

  return NextResponse.json({ revalidated: false })
}
