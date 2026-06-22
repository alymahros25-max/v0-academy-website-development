import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateThemeSettings } from '@/lib/api-revalidate'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

interface WidgetConfig {
  id?: number
  widget_type: string
  config_json: any
  is_enabled?: boolean
  display_order?: number
}

// GET: Fetch widget configurations
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured', data: [] }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const widgetType = searchParams.get('type')

    let query = supabase
      .from('widget_configs')
      .select('*')

    if (widgetType) {
      query = query.eq('widget_type', widgetType)
    }

    const { data, error } = await query.order('display_order', { ascending: true })

    if (error) {
      console.error('[v0] Widgets fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[v0] GET /api/cms/widgets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create or update widget configuration
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body: WidgetConfig = await request.json()

    if (!body.widget_type || !body.config_json) {
      return NextResponse.json({ error: 'widget_type and config_json are required' }, { status: 400 })
    }

    // Check if widget already exists
    const { data: existing } = await supabase
      .from('widget_configs')
      .select('id')
      .eq('widget_type', body.widget_type)
      .single()

    if (existing) {
      // Update existing widget
      const { data, error } = await supabase
        .from('widget_configs')
        .update({
          config_json: body.config_json,
          is_enabled: body.is_enabled !== undefined ? body.is_enabled : true,
          display_order: body.display_order !== undefined ? body.display_order : 0,
          updated_at: new Date().toISOString(),
        })
        .eq('widget_type', body.widget_type)
        .select()

      if (error) {
        console.error('[v0] Widget update error:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      // Revalidate theme settings when widgets updated
      try {
        await revalidateThemeSettings()
      } catch (revalidateError) {
        console.warn('[v0] Revalidation warning:', revalidateError)
      }

      return NextResponse.json({
        success: true,
        data: data?.[0],
        updated: true,
        message: 'Widget updated successfully',
        revalidated: true,
      }, { status: 200 })
    }

    // Create new widget
    const { data, error } = await supabase
      .from('widget_configs')
      .insert({
        widget_type: body.widget_type,
        config_json: body.config_json,
        is_enabled: body.is_enabled !== false,
        display_order: body.display_order || 0,
      })
      .select()

    if (error) {
      console.error('[v0] Widget creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Revalidate theme settings when widgets created
    try {
      await revalidateThemeSettings()
    } catch (revalidateError) {
      console.warn('[v0] Revalidation warning:', revalidateError)
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
      created: true,
      message: 'Widget created successfully',
      revalidated: true,
    }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/cms/widgets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update widget configuration
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const widgetType = searchParams.get('type')

    if (!widgetType) {
      return NextResponse.json({ error: 'Widget type is required' }, { status: 400 })
    }

    const body: Partial<WidgetConfig> = await request.json()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.config_json) updateData.config_json = body.config_json
    if (body.is_enabled !== undefined) updateData.is_enabled = body.is_enabled
    if (body.display_order !== undefined) updateData.display_order = body.display_order

    const { data, error } = await supabase
      .from('widget_configs')
      .update(updateData)
      .eq('widget_type', widgetType)
      .select()

    if (error) {
      console.error('[v0] Widget update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 200 })
  } catch (error) {
    console.error('[v0] PATCH /api/cms/widgets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete widget configuration
export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const widgetType = searchParams.get('type')

    if (!widgetType) {
      return NextResponse.json({ error: 'Widget type is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('widget_configs')
      .delete()
      .eq('widget_type', widgetType)

    if (error) {
      console.error('[v0] Widget deletion error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Widget deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('[v0] DELETE /api/cms/widgets error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
