import type { Metadata } from 'next'

/**
 * Builds canonical and hreflang metadata for pages that currently have one
 * Arabic URL. We intentionally publish only real URL variants: Arabic and
 * x-default. English and French are client-side locales, not separate routes.
 */
export function getSeoAlternates(canonical: string): NonNullable<Metadata['alternates']> {
  return {
    canonical,
    languages: {
      ar: canonical,
      'x-default': canonical,
    },
  }
}

export function withSeoAlternates(metadata: Metadata, canonical: string): Metadata {
  return {
    ...metadata,
    alternates: getSeoAlternates(canonical),
  }
}
