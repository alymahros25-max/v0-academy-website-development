import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import {
  getLegalPageAllLocales,
  getAllLegalPages,
} from '@/lib/legal-service'

/**
 * GET /api/admin/legal-pages
 * 
 * Query parameters:
 * - page: 'terms' | 'privacy' | 'refund-policy' (optional)
 * 
 * Returns:
 * - If page specified: All locales for that page
 * - If no page: All legal pages
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const pageSlug = searchParams.get('page')

    if (pageSlug) {
      // Get specific page in all locales
      const pages = await getLegalPageAllLocales(
        pageSlug as 'terms' | 'privacy' | 'refund-policy'
      )
      return NextResponse.json(pages)
    } else {
      // Get all pages
      const pages = await getAllLegalPages()
      return NextResponse.json(pages)
    }
  } catch (error) {
    console.error('[Legal Pages API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch legal pages' },
      { status: 500 }
    )
  }
}
