import type { Metadata } from 'next'

/**
 * Builds canonical and hreflang metadata for pages that have one Arabic URL.
 * Generic pages publish Arabic and x-default; country landing pages use the
 * explicit regional Arabic variants that exist as real, bidirectionally linked URLs.
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

const countryAlternateUrls = {
  australia: { locale: "ar-AU", url: "https://quran-elhafez.com/australia" },
  canada: { locale: "ar-CA", url: "https://quran-elhafez.com/canada" },
  germany: { locale: "ar-DE", url: "https://quran-elhafez.com/germany" },
  saudiArabia: { locale: "ar-SA", url: "https://quran-elhafez.com/saudi-arabia" },
  unitedArabEmirates: { locale: "ar-AE", url: "https://quran-elhafez.com/united-arab-emirates" },
  unitedKingdom: { locale: "ar-GB", url: "https://quran-elhafez.com/united-kingdom" },
  unitedStates: { locale: "ar-US", url: "https://quran-elhafez.com/united-states" },
} as const

export type CountrySeoSlug = keyof typeof countryAlternateUrls

export function getCountrySeoAlternates(slug: CountrySeoSlug): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {
    ar: "https://quran-elhafez.com/",
    "x-default": "https://quran-elhafez.com/",
  }
  for (const country of Object.values(countryAlternateUrls)) languages[country.locale] = country.url
  return { canonical: countryAlternateUrls[slug].url, languages }
}

export function withSeoAlternates(metadata: Metadata, canonical: string): Metadata {
  return {
    ...metadata,
    alternates: getSeoAlternates(canonical),
  }
}
