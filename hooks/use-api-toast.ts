'use client'

import { useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

/**
 * Custom hook for API call feedback with toast notifications
 * Provides loading, success, and error states with automatic toasts
 */

interface UseApiToastOptions {
  successMessage?: string
  errorMessage?: string
  loadingMessage?: string
}

export function useApiToast(options: UseApiToastOptions = {}) {
  const { toast } = useToast()
  const {
    successMessage = 'تم بنجاح!',
    errorMessage = 'حدث خطأ ما',
    loadingMessage = 'جاري المعالجة...',
  } = options

  const showSuccess = useCallback(
    (message?: string) => {
      toast({
        title: 'نجاح',
        description: message || successMessage,
        variant: 'default',
        duration: 3000,
      })
    },
    [toast, successMessage]
  )

  const showError = useCallback(
    (message?: string | Error) => {
      const errorMsg =
        typeof message === 'string'
          ? message
          : message instanceof Error
            ? message.message
            : errorMessage

      toast({
        title: 'خطأ',
        description: errorMsg,
        variant: 'destructive',
        duration: 4000,
      })
    },
    [toast, errorMessage]
  )

  const showInfo = useCallback(
    (message?: string) => {
      toast({
        title: 'معلومة',
        description: message,
        duration: 3000,
      })
    },
    [toast]
  )

  const executeWithToast = useCallback(
    async <T,>(
      promise: Promise<T>,
      customOptions?: {
        success?: string
        error?: string
      }
    ): Promise<T | null> => {
      try {
        const result = await promise
        showSuccess(customOptions?.success)
        return result
      } catch (error) {
        showError(customOptions?.error || error)
        return null
      }
    },
    [showSuccess, showError]
  )

  return {
    showSuccess,
    showError,
    showInfo,
    executeWithToast,
    toast,
  }
}
