'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Centralized revalidation utility for cache busting
 * This ensures data changes reflect immediately on the website
 * Uses ISR (Incremental Static Regeneration) and on-demand revalidation
 */

export interface RevalidationOptions {
  paths?: string[]
  tags?: string[]
}

/**
 * Revalidate site content after changes
 * Triggers fresh data fetches for affected pages
 */
export async function revalidateSiteContent(options: RevalidationOptions = {}) {
  try {
    const defaultPaths = [
      '/',
      '/quran',
      '/arabic',
      '/about',
      '/teachers',
      '/reviews',
      '/library',
      '/games',
      '/faq',
      '/blog',
      '/contact',
    ]

    const defaultTags = [
      'site-content',
      'homepage',
      'courses',
      'blog-posts',
      'pages',
    ]

    const pathsToRevalidate = options.paths || defaultPaths
    const tagsToRevalidate = options.tags || defaultTags

    // Revalidate all paths
    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path)
        console.log('[v0] Revalidated path:', path)
      } catch (error) {
        console.error('[v0] Failed to revalidate path:', path, error)
      }
    }

    // Revalidate all tags
    for (const tag of tagsToRevalidate) {
      try {
        revalidateTag(tag)
        console.log('[v0] Revalidated tag:', tag)
      } catch (error) {
        console.error('[v0] Failed to revalidate tag:', tag, error)
      }
    }

    return {
      success: true,
      revalidatedPaths: pathsToRevalidate,
      revalidatedTags: tagsToRevalidate,
    }
  } catch (error) {
    console.error('[v0] Revalidation error:', error)
    return {
      success: false,
      error: 'Failed to revalidate cache',
    }
  }
}

/**
 * Revalidate theme/settings changes
 */
export async function revalidateThemeSettings() {
  return revalidateSiteContent({
    paths: ['/', '/admin'],
    tags: ['theme-settings', 'site-settings', 'site-content'],
  })
}

/**
 * Revalidate pages after page builder changes
 */
export async function revalidateDynamicPages() {
  return revalidateSiteContent({
    paths: ['/'],
    tags: ['site-pages', 'dynamic-pages', 'page-builder'],
  })
}

/**
 * Revalidate users management changes
 */
export async function revalidateUsers() {
  return revalidateSiteContent({
    paths: ['/account', '/admin'],
    tags: ['users', 'cms-users'],
  })
}

/**
 * Revalidate after content changes
 */
export async function revalidateContentChanges() {
  return revalidateSiteContent({
    paths: ['/', '/blog', '/library'],
    tags: ['site-content', 'blog-posts', 'content'],
  })
}

/**
 * Full site revalidation (use sparingly)
 */
export async function revalidateFullSite() {
  console.log('[v0] Starting full site revalidation...')
  return revalidateSiteContent({
    paths: [
      '/',
      '/quran',
      '/arabic',
      '/about',
      '/teachers',
      '/reviews',
      '/library',
      '/games',
      '/faq',
      '/blog',
      '/contact',
      '/account',
      '/admin',
    ],
    tags: [
      'site-content',
      'theme-settings',
      'site-settings',
      'site-pages',
      'dynamic-pages',
      'blog-posts',
      'users',
      'cms-users',
      'page-builder',
    ],
  })
}
