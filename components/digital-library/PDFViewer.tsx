"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Download, Loader2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getViewerUrl, isGoogleDriveUrl } from "@/lib/google-drive-utils"

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  contentUrl: string
  title: string
  contentType?: "book" | "quran_audio" | "nasheed"
}

export function PDFViewer({
  isOpen,
  onClose,
  contentUrl,
  title,
  contentType = "book",
}: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)
  const [hasError, setHasError] = useState(false)

  // Get viewer configuration
  const viewerConfig = getViewerUrl(contentUrl)
  const isGoogleDrive = viewerConfig.type === "google-drive"
  const displayUrl = viewerConfig.url

  // Determine button text based on source
  const openButtonText = isGoogleDrive ? "فتح في Google Drive" : "فتح خارجي"

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Reset states when URL changes
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setIframeKey((prev) => prev + 1)
  }, [contentUrl])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] md:h-[95vh] flex flex-col p-0 gap-0 bg-background">
        {/* Header */}
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-border flex-row items-center justify-between shrink-0 bg-card">
          <DialogTitle className="text-sm md:text-base font-bold truncate max-w-xs md:max-w-md text-foreground">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {isGoogleDrive && (
              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 md:px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition text-foreground"
                title="تحميل من Google Drive"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تحميل</span>
              </a>
            )}
            <a
              href={contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 md:px-3 py-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition"
              title={openButtonText}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{openButtonText}</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-lg transition text-muted-foreground"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Viewer Container */}
        <div className="flex-1 overflow-hidden bg-muted/50 relative">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-xs md:text-sm text-muted-foreground">جاري تحميل الملف...</p>
            </div>
          )}

          {/* Error State */}
          {hasError && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <AlertCircle className="w-8 h-8 text-destructive mb-2" />
              <p className="text-sm text-foreground mb-2">لم يتمكن النظام من تحميل الملف</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs mb-4">
                تأكد من أن الرابط صحيح وأن الملف متاح للعرض العام
              </p>
              <a
                href={contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline font-medium"
              >
                فتح الملف مباشرة →
              </a>
            </div>
          )}

          {/* Iframe Viewer */}
          {displayUrl && (
            isGoogleDrive ? (
              // Google Drive native embed - optimized for direct viewing
              <iframe
                key={iframeKey}
                src={displayUrl}
                className="w-full h-full border-0"
                title={title}
                allow="autoplay"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                loading="lazy"
              />
            ) : (
              // Fallback viewer for external PDFs
              <iframe
                key={iframeKey}
                src={displayUrl}
                className="w-full h-full border-0"
                title={title}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                loading="lazy"
              />
            )
          )}
        </div>

        {/* Footer with Instructions */}
        <div className="px-4 md:px-6 py-2 md:py-3 border-t border-border bg-card shrink-0">
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            {isGoogleDrive
              ? "هذا الملف مستضاف على Google Drive. إذا واجهت مشاكل، اضغط على 'فتح في Google Drive' لتحميله مباشرة"
              : "إذا لم يظهر الملف بشكل صحيح، اضغط على الزر بالأعلى لفتحه في نافذة جديدة"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
