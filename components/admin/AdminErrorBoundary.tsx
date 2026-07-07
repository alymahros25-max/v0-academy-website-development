"use client"

import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  onRetry?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AdminErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] AdminErrorBoundary caught:", error.message, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <p className="font-bold text-foreground">خطأ في تحميل القسم</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {this.state.error?.message || "حدث خطأ غير متوقع"}
              </p>
            </div>
          </div>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 transition text-sm font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
