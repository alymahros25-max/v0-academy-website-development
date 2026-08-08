import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateThemeSettings } from '@/lib/api-revalidate'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}

/**
 * GET: Fetch site settings
 * Query params:
 *  - key?: string - get specific setting
 *  - category?: string - filter by category (colors, typography, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database not configured',
        data: [] 
      }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const category = searchParams.get('category')

    let query = requireSupabase()
      .from('site_settings')
      .select('*')

    if (key) {
      query = query.eq('setting_key', key)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Transform to key-value format for easier consumption
    const settingsMap: Record<string, string> = {}
    data?.forEach((item) => {
      settingsMap[item.setting_key] = item.setting_value
    })

    return NextResponse.json({
      success: true,
      data: key || category ? data : settingsMap,
      count: data?.length || 0,
    })
  } catch (error) {
    console.error('[v0] Settings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST/PUT: Create or update site settings
 * Body: {
 *   setting_key: string,
 *   setting_value: string,
 *   value_type?: 'color' | 'text' | 'url' | 'number' | 'json',
 *   label?: string,
 *   description?: string,
 *   category?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      setting_key?: string
      setting_value?: string
      value_type?: string
      label?: string
      description?: string
      category?: string
    }

    const {
      setting_key,
      setting_value,
      value_type = 'text',
      label,
      description,
      category,
    } = body

    // Validation
    if (!setting_key) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      )
    }

    if (setting_value === undefined || setting_value === null) {
      return NextResponse.json(
        { error: 'Setting value is required' },
        { status: 400 }
      )
    }

    // Validate color format if type is 'color'
    if (value_type === 'color' && setting_value) {
      const isValidColor = /^#[0-9A-F]{6}$/i.test(setting_value)
      if (!isValidColor) {
        return NextResponse.json(
          { error: 'Invalid color format. Use hex format like #FF0000' },
          { status: 400 }
        )
      }
    }

    // Upsert setting
    const { data, error } = await requireSupabase()
      .from('site_settings')
      .upsert(
        {
          setting_key,
          setting_value,
          value_type,
          label,
          description,
          category,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      )
      .select()

    if (error) {
      console.error('[v0] Upsert error:', error)
      return NextResponse.json(
        { error: 'Failed to save setting' },
        { status: 500 }
      )
    }

    // Revalidate theme/settings on successful save
    try {
      await revalidateThemeSettings()
    } catch (revalidateError) {
      console.warn('[v0] Revalidation warning:', revalidateError)
      // Don't fail the request if revalidation fails
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
      message: 'Setting saved successfully',
      revalidated: true,
    })
  } catch (error) {
    console.error('[v0] Settings creation error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH: Batch update multiple settings
 * Body: [
 *   { setting_key: string, setting_value: string },
 *   ...
 * ]
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as Array<{
      setting_key?: string
      setting_value?: string
    }>

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Body must be a non-empty array' },
        { status: 400 }
      )
    }

    // Prepare data for batch update
    const updates = body.map((item) => ({
      ...item,
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await requireSupabase()
      .from('site_settings')
      .upsert(updates, { onConflict: 'setting_key' })
      .select()

    if (error) {
      console.error('[v0] Batch update error:', error)
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    // Revalidate theme/settings on successful batch save
    try {
      await revalidateThemeSettings()
    } catch (revalidateError) {
      console.warn('[v0] Revalidation warning:', revalidateError)
      // Don't fail the request if revalidation fails
    }

    return NextResponse.json({
      success: true,
      data,
      updated_count: data?.length || 0,
      message: 'Settings updated successfully',
      revalidated: true,
    })
  } catch (error) {
    console.error('[v0] Settings batch update error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Delete a setting
 * Query params: key=string
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      )
    }

    const { error } = await requireSupabase()
      .from('site_settings')
      .delete()
      .eq('setting_key', key)

    if (error) {
      console.error('[v0] Delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete setting' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully',
    })
  } catch (error) {
    console.error('[v0] Settings deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
