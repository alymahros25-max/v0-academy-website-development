import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

/**
 * Check if a user role has permission to perform an action on a module
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ hasPermission: false }, { status: 200 })
    }

    const body = await request.json()
    const { roleType, moduleName, actionName } = body

    if (!roleType || !moduleName || !actionName) {
      return NextResponse.json({ error: 'roleType, moduleName, and actionName are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('cms_permissions')
      .select('is_allowed')
      .eq('role_type', roleType)
      .eq('module_name', moduleName)
      .eq('action', actionName)
      .single()

    if (error) {
      console.error('[v0] Permission check error:', error)
      return NextResponse.json({ hasPermission: false }, { status: 200 })
    }

    return NextResponse.json({ hasPermission: data?.is_allowed || false }, { status: 200 })
  } catch (error) {
    console.error('[v0] Permission check error:', error)
    return NextResponse.json({ hasPermission: false }, { status: 200 })
  }
}
