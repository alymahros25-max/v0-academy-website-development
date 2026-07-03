'use client'

export function LoadingSkeleton({ count = 3, variant = 'card' }: { count?: number; variant?: 'card' | 'list' | 'grid' }) {
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-muted rounded-xl h-20 animate-pulse" />
          ))}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-muted rounded-xl h-32 animate-pulse" />
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-5 space-y-3 animate-pulse">
            <div className="h-6 bg-muted rounded-lg w-3/4" />
            <div className="h-4 bg-muted rounded-lg w-1/2" />
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded-lg w-24" />
              <div className="h-8 bg-muted rounded-lg w-24" />
            </div>
          </div>
        ))}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  )
}
