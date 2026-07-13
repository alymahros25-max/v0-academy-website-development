'use client'

import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
  context?: string
}

interface State {
  hasError: boolean
  error: Error | null
  isRecovering: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, isRecovering: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRecovering: false }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info)
    console.error(
      `[ErrorBoundary] ${this.props.context || 'Unknown'} Error:`,
      error,
      info
    )
  }

  private attemptRecovery = async () => {
    this.setState({ isRecovering: true })

    // Wait a bit before attempting recovery
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Try to recover by resetting state
    this.setState({
      hasError: false,
      error: null,
      isRecovering: false,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="max-w-md text-center">
              <h1 className="text-3xl font-bold text-red-600 mb-4">خطأ في التطبيق</h1>
              <p className="text-foreground/60 mb-6">
                حدث خطأ غير متوقع. يرجى محاولة إعادة تحميل الصفحة.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
                  disabled={this.state.isRecovering}
                >
                  {this.state.isRecovering ? 'جاري الاسترجاع...' : 'إعادة تحميل'}
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition"
                >
                  الصفحة الرئيسية
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-start">
                  <summary className="cursor-pointer text-red-600 mb-2">
                    تفاصيل الخطأ (التطوير فقط)
                  </summary>
                  <pre className="bg-red-50 p-3 rounded text-xs overflow-auto text-red-900">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
