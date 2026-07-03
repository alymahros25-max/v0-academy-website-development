'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: any) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
            <h3 className="font-bold text-foreground mb-2">خطأ في تحميل هذا القسم</h3>
            <p className="text-sm text-muted-foreground mb-4">
              حدث خطأ غير متوقع. يمكنك محاولة إعادة التحميل.
            </p>
            {this.state.error && (
              <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted p-3 rounded-lg overflow-auto max-h-24">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة محاولة
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
