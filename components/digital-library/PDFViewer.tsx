"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Download, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getViewerUrl, isGoogleDriveUrl } from "@/lib/google-drive-utils"

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)

  // Get the appropriate viewer URL based on the source
  const viewerConfig = getViewerUrl(pdfUrl)
  const isGoogleDrive = viewerConfig.type === "google-drive"
  const displayUrl = viewerConfig.url
  const openUrl = isGoogleDrive ? pdfUrl : pdfUrl

  // Determine the appropriate open button text for Google Drive
  const openButtonText = isGoogleDrive ? "فتح في Google Drive" : "فتح خارجي"

  // Handle iframe load completion
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoading(true)
    setIframeKey((prev) => prev + 1)
  }, [pdfUrl])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] md:h-[95vh] flex flex-col p-0 gap-0 bg-background">
        {/* Header */}
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b border-border flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-sm md:text-base font-bold truncate max-w-xs md:max-w-md">
            {title}
          </DialogTitle>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {isGoogleDrive && (
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 md:px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition text-foreground"
                title="فتح الملف مباشرة في Google Drive"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تحميل</span>
              </a>
            )}
            <a
              href={openUrl}
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
        <div className="flex-1 overflow-hidden bg-muted/50 flex items-center justify-center relative">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-xs md:text-sm text-muted-foreground">جاري تحميل الملف...</p>
            </div>
          )}

          {/* PDF/Document Viewer */}
          {displayUrl ? (
            isGoogleDrive ? (
              // Google Drive Direct Embed - No scroll, full height
              <iframe
                key={iframeKey}
                src={displayUrl}
                className="w-full h-full border-0"
                title={title}
                allow="autoplay"
                onLoad={handleIframeLoad}
              />
            ) : (
              // Google Docs Viewer Fallback - with scroll
              <iframe
                key={iframeKey}
                src={displayUrl}
                className="w-full h-full border-0"
                title={title}
                onLoad={handleIframeLoad}
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-muted-foreground">لا يمكن تحميل الملف</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                تأكد من صحة الرابط وأن الملف متاح للعرض العام
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                فتح الملف مباشرة →
              </a>
            </div>
          )}
        </div>

        {/* Footer Information */}
        <div className="px-4 md:px-6 py-2 md:py-3 border-t border-border bg-card shrink-0">
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            {isGoogleDrive ? (
              <>
                هذا الملف مستضاف على Google Drive. إذا واجهت مشاكل في التحميل، اضغط على &quot;فتح في Google
                Drive&quot;
              </>
            ) : (
              <>في حال لم يظهر الملف بشكل صحيح، اضغط على &quot;{openButtonText}&quot; لفتحه مباشرة</>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
