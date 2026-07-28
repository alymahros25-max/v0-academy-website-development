'use client'

import React, { ReactNode } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class GameErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('[GameErrorBoundary]', error)
  }

  retry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback?.(this.state.error!, this.retry) || (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-900 rounded-2xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">خطأ في اللعبة</h2>
              <p className="text-red-700 dark:text-red-200 mb-6">حدث خطأ غير متوقع. يرجى محاولة مرة أخرى.</p>
              <button onClick={this.retry} className="flex items-center gap-2 mx-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                <RotateCcw className="w-5 h-5" />
                حاول مرة أخرى
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
