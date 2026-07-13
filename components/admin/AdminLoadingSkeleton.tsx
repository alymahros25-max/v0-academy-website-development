"use client"

export function AdminLoadingSkeleton({ lines = 3, fullWidth = false }: { lines?: number; fullWidth?: boolean }) {
  return (
    <div className={`space-y-4 ${fullWidth ? "" : "max-w-2xl"}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function TableLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 h-12 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

export function CardGridLoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

export function AdminSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  )
}
