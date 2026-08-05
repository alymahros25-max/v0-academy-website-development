import { NextRequest, NextResponse } from 'next/server'
import { updateLegalPage } from '@/lib/legal-service'

/**
 * PUT /api/admin/legal-pages/[id]
 * 
 * Update a legal page (admin only)
 * 
 * Body:
 * {
 *   title?: string
 *   content?: string
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const updated = await updateLegalPage(id, {
      title,
      content,
    })

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update legal page' },
        { status: 500 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[Legal Pages API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update legal page' },
      { status: 500 }
    )
  }
}
