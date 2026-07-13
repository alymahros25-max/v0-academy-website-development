import { useEffect, useState, useCallback } from 'react'
import type { ContentItem, SettingItem, TranslationResult } from '@/lib/cms-client'
import {
  fetchContent,
  saveContent,
  fetchSettings,
  saveSetting,
  translateText,
  getContent,
  getSetting,
} from '@/lib/cms-client'

interface UseCMSContentOptions {
  key?: string
  section?: string
  locale?: string
  autoFetch?: boolean
}

interface UseCMSSettingsOptions {
  category?: string
  autoFetch?: boolean
}

/**
 * Hook for fetching and managing CMS content
 */
export function useCMSContent(options: UseCMSContentOptions = {}) {
  const {
    key,
    section,
    locale = 'all',
    autoFetch = true,
  } = options

  const [data, setData] = useState<ContentItem[] | null>(null)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetchContent(key, section, locale)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch content'))
    } finally {
      setLoading(false)
    }
  }, [key, section, locale])

  useEffect(() => {
    if (autoFetch) {
      fetch()
    }
  }, [key, section, locale, autoFetch, fetch])

  const save = useCallback(
    async (contentData: Parameters<typeof saveContent>[0]) => {
      try {
        setLoading(true)
        const result = await saveContent(contentData)
        setData((prev) => {
          if (!prev) return [result]
          return prev.map((item) => (item.key === result.key ? result : item))
        })
        setError(null)
        return result
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to save content'))
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { data, loading, error, refetch: fetch, save }
}

/**
 * Hook for fetching and managing CMS settings
 */
export function useCMSSettings(options: UseCMSSettingsOptions = {}) {
  const { category, autoFetch = true } = options

  const [data, setData] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetchSettings(undefined, category)
      
      if (!Array.isArray(result)) {
        setData(result)
      } else {
        const map: Record<string, string> = {}
        result.forEach((item) => {
          map[item.setting_key] = item.setting_value
        })
        setData(map)
      }
      
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch settings'))
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    if (autoFetch) {
      fetch()
    }
  }, [category, autoFetch, fetch])

  const save = useCallback(
    async (key: string, value: string) => {
      try {
        setLoading(true)
        await saveSetting({
          setting_key: key,
          setting_value: value,
          category,
        })
        setData((prev) => (prev ? { ...prev, [key]: value } : null))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to save setting'))
        throw err
      } finally {
        setLoading(false)
      }
    },
    [category]
  )

  return { data, loading, error, refetch: fetch, save }
}

/**
 * Hook for translating text
 */
export function useTranslate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const translate = useCallback(async (text: string): Promise<TranslationResult | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await translateText(text)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Translation failed')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { translate, loading, error }
}

/**
 * Hook for fetching a single content item
 */
export function useSingleContent(key: string, locale: string = 'all') {
  const [data, setData] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const result = await getContent(key, locale)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch content'))
      } finally {
        setLoading(false)
      }
    }

    if (key) {
      fetch()
    }
  }, [key, locale])

  return { data, loading, error }
}

/**
 * Hook for fetching a single setting
 */
export function useSingleSetting(key: string) {
  const [value, setValue] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const result = await getSetting(key)
        setValue(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch setting'))
      } finally {
        setLoading(false)
      }
    }

    if (key) {
      fetch()
    }
  }, [key])

  return { value, loading, error }
}
