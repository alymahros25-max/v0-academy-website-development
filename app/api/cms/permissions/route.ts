import { requireAdmin } from '@/lib/api-auth'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

interface Permission {
  id?: number
  role_type: string
  module_name: string
  action: string
  is_allowed: boolean
  description?: string
}

// GET: Fetch permissions for a role or get all permissions
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured', data: [] }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const roleType = searchParams.get('role')
    const moduleName = searchParams.get('module')

    let query = supabase
      .from('cms_permissions')
      .select('*')

    if (roleType) query = query.eq('role_type', roleType)
    if (moduleName) query = query.eq('module_name', moduleName)

    const { data, error } = await query.order('role_type', { ascending: true })

    if (error) {
      console.error('[v0] Permissions fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Group by role for easier UI rendering
    const grouped = (data || []).reduce((acc: any, perm: any) => {
      if (!acc[perm.role_type]) {
        acc[perm.role_type] = {}
      }
      if (!acc[perm.role_type][perm.module_name]) {
        acc[perm.role_type][perm.module_name] = []
      }
      acc[perm.role_type][perm.module_name].push(perm)
      return acc
    }, {})

    return NextResponse.json({ data, grouped }, { status: 200 })
  } catch (error) {
    console.error('[v0] GET /api/cms/permissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create new permission
export async function POST(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body: Permission = await request.json()

    if (!body.role_type || !body.module_name || !body.action) {
      return NextResponse.json({ error: 'role_type, module_name, and action are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('cms_permissions')
      .insert({
        role_type: body.role_type,
        module_name: body.module_name,
        action: body.action,
        is_allowed: body.is_allowed,
        description: body.description,
      })
      .select()

    if (error) {
      console.error('[v0] Permission creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/cms/permissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update permission
export async function PATCH(request: NextRequest) {
    const authError = await requireAdmin()
    if (authError) return authError

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const permissionId = searchParams.get('id')

    if (!permissionId) {
      return NextResponse.json({ error: 'Permission ID is required' }, { status: 400 })
    }

    const body: Partial<Permission> = await request.json()

    const { data, error } = await supabase
      .from('cms_permissions')
      .update({
        is_allowed: body.is_allowed,
        description: body.description,
      })
      .eq('id', parseInt(permissionId))
      .select()

    if (error) {
      console.error('[v0] Permission update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 200 })
  } catch (error) {
    console.error('[v0] PATCH /api/cms/permissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a separate route for checking permissions
// POST with action=check query parameter
