import { createClient } from '@supabase/supabase-js'

export type LegalPageSlug = 'terms' | 'privacy' | 'refund-policy'
export type Locale = 'ar' | 'en' | 'fr'

export interface LegalPage {
  id: string
  page_slug: LegalPageSlug
  locale: Locale
  title: string
  content: string
  created_at: string
  updated_at: string
}

/**
 * Get a legal page by slug and locale
 * Used by frontend pages to fetch content dynamically
 */
export async function getLegalPage(
  slug: LegalPageSlug,
  locale: Locale
): Promise<LegalPage | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Legal Service] Missing Supabase credentials')
    return null
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('page_slug', slug)
      .eq('locale', locale)
      .single()

    if (error) {
      console.error('[Legal Service] Error fetching legal page:', error)
      return null
    }

    return data as LegalPage
  } catch (error) {
    console.error('[Legal Service] Exception fetching legal page:', error)
    return null
  }
}

/**
 * Get all pages for a specific slug (all languages)
 * Used by admin to see all language versions
 */
export async function getLegalPageAllLocales(
  slug: LegalPageSlug
): Promise<LegalPage[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Legal Service] Missing Supabase credentials')
    return []
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('page_slug', slug)
      .order('locale', { ascending: true })

    if (error) {
      console.error('[Legal Service] Error fetching legal pages:', error)
      return []
    }

    return (data as LegalPage[]) || []
  } catch (error) {
    console.error('[Legal Service] Exception fetching legal pages:', error)
    return []
  }
}

/**
 * Get all legal pages (for admin purposes)
 */
export async function getAllLegalPages(): Promise<LegalPage[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Legal Service] Missing Supabase credentials')
    return []
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .order('page_slug', { ascending: true })
      .order('locale', { ascending: true })

    if (error) {
      console.error('[Legal Service] Error fetching all legal pages:', error)
      return []
    }

    return (data as LegalPage[]) || []
  } catch (error) {
    console.error('[Legal Service] Exception fetching all legal pages:', error)
    return []
  }
}

/**
 * Update a legal page (admin only)
 */
export async function updateLegalPage(
  id: string,
  updates: Partial<Omit<LegalPage, 'id' | 'created_at'>>
): Promise<LegalPage | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Legal Service] Missing Supabase credentials')
    return null
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('legal_pages')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Legal Service] Error updating legal page:', error)
      return null
    }

    return data as LegalPage
  } catch (error) {
    console.error('[Legal Service] Exception updating legal page:', error)
    return null
  }
}

/**
 * Create a new legal page (admin only)
 */
export async function createLegalPage(
  pageData: Omit<LegalPage, 'id' | 'created_at' | 'updated_at'>
): Promise<LegalPage | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Legal Service] Missing Supabase credentials')
    return null
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('legal_pages')
      .insert([pageData])
      .select()
      .single()

    if (error) {
      console.error('[Legal Service] Error creating legal page:', error)
      return null
    }

    return data as LegalPage
  } catch (error) {
    console.error('[Legal Service] Exception creating legal page:', error)
    return null
  }
}

/**
 * Delete a legal page (admin only)
 */
export async function deleteLegalPage(id: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Legal Service] Missing Supabase credentials')
    return false
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase
      .from('legal_pages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[Legal Service] Error deleting legal page:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Legal Service] Exception deleting legal page:', error)
    return false
  }
}
