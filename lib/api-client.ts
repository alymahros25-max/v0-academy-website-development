/**
 * Centralized API client with error handling and type safety
 * Provides consistent error handling, logging, and retry logic
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  message?: string
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Generic API call with error handling
 */
export async function apiCall<T = unknown>(
  endpoint: string,
  options: RequestInit & {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    timeout?: number
    retry?: number
  } = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    timeout = 10000,
    retry = 1,
    ...fetchOptions
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(endpoint, {
        ...fetchOptions,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: response.statusText,
        }))

        throw new ApiError(
          response.status,
          errorData.error || response.statusText,
          errorData
        )
      }

      const data = (await response.json()) as ApiResponse<T>
      return data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < retry - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        )
        console.log(`[v0] Retrying API call to ${endpoint} (attempt ${attempt + 2})`)
      }
    }
  }

  throw lastError
}

/**
 * Translation API call
 */
export async function translateText(
  text: string,
  sourceLang: string = 'ar'
): Promise<{ ar: string; en: string; fr: string }> {
  const response = await apiCall<{ ar: string; en: string; fr: string }>(
    '/api/translate',
    {
      method: 'POST',
      body: { text, sourceLang },
      retry: 2,
    }
  )

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Translation failed')
  }

  return response.data
}

/**
 * Settings API calls
 */
export async function fetchSettings(key?: string, category?: string) {
  const params = new URLSearchParams()
  if (key) params.append('key', key)
  if (category) params.append('category', category)

  const url = `/api/cms/settings${params.toString() ? `?${params}` : ''}`

  return apiCall<unknown>(url, {
    method: 'GET',
  })
}

export async function saveSetting(
  setting_key: string,
  setting_value: string,
  options?: {
    value_type?: string
    label?: string
    description?: string
    category?: string
  }
) {
  return apiCall<unknown>('/api/cms/settings', {
    method: 'POST',
    body: {
      setting_key,
      setting_value,
      ...options,
    },
    retry: 2,
  })
}

export async function batchSaveSettings(
  settings: Array<{
    setting_key: string
    setting_value: string
  }>
) {
  return apiCall<unknown>('/api/cms/settings', {
    method: 'PATCH',
    body: settings,
    retry: 2,
  })
}

/**
 * Pages API calls
 */
export async function fetchPages(published?: boolean) {
  const params = new URLSearchParams()
  if (published !== undefined) params.append('published', String(published))

  const url = `/api/cms/pages${params.toString() ? `?${params}` : ''}`

  return apiCall<unknown>(url, {
    method: 'GET',
  })
}

export async function createPage(pageData: {
  slug: string
  title_ar: string
  title_en: string
  title_fr: string
  content_json?: Record<string, unknown>
  settings_json?: Record<string, unknown>
  template_type?: string
}) {
  return apiCall<unknown>('/api/cms/pages', {
    method: 'POST',
    body: pageData,
    retry: 2,
  })
}

export async function updatePage(
  id: number,
  pageData: Partial<{
    slug: string
    title_ar: string
    title_en: string
    title_fr: string
    content_json: Record<string, unknown>
    settings_json: Record<string, unknown>
    is_published: boolean
  }>
) {
  return apiCall<unknown>(`/api/cms/pages/${id}`, {
    method: 'PUT',
    body: pageData,
    retry: 2,
  })
}

/**
 * Users API calls
 */
export async function fetchUsers() {
  return apiCall<unknown>('/api/cms/users', {
    method: 'GET',
  })
}

export async function createUser(userData: {
  email: string
  full_name: string
  role_type: string
  phone?: string
}) {
  return apiCall<unknown>('/api/cms/users', {
    method: 'POST',
    body: userData,
    retry: 2,
  })
}

/**
 * Widgets API calls
 */
export async function fetchWidgets() {
  return apiCall<unknown>('/api/cms/widgets', {
    method: 'GET',
  })
}

export async function updateWidget(
  widget_type: string,
  config_json: Record<string, unknown>
) {
  return apiCall<unknown>('/api/cms/widgets', {
    method: 'POST',
    body: { widget_type, config_json },
    retry: 2,
  })
}

/**
 * Content API calls
 */
export async function fetchContent(key?: string, section?: string) {
  const params = new URLSearchParams()
  if (key) params.append('key', key)
  if (section) params.append('section', section)

  const url = `/api/cms/content${params.toString() ? `?${params}` : ''}`

  return apiCall<unknown>(url, {
    method: 'GET',
  })
}

export async function saveContent(
  key: string,
  content_ar: string,
  content_en: string,
  content_fr: string,
  section?: string
) {
  return apiCall<unknown>('/api/cms/content', {
    method: 'POST',
    body: {
      key,
      content_ar,
      content_en,
      content_fr,
      section,
    },
    retry: 2,
  })
}

/**
 * Permissions API calls
 */
export async function checkPermission(
  role: string,
  module: string,
  action: string
) {
  return apiCall<unknown>('/api/cms/permissions/check', {
    method: 'POST',
    body: { role, module, action },
  })
}
