"use client"

import { X, ExternalLink, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) {
  // Use Google Docs viewer as a reliable cross-origin PDF renderer
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 py-3 border-b border-border flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold truncate max-w-xs">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg transition text-foreground"
            >
              <Download className="w-3.5 h-3.5" />
              تحميل
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              فتح خارجي
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-lg transition text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        {/* PDF via Google Docs Viewer - works with any public PDF URL */}
        <div className="flex-1 overflow-hidden bg-muted">
          <iframe
            src={googleViewerUrl}
            className="w-full h-full border-0"
            title={title}
            loading="lazy"
          />
        </div>

        <div className="px-5 py-2 border-t border-border bg-card">
          <p className="text-xs text-muted-foreground text-center">
            في حال لم يظهر الكتاب، اضغط على &quot;فتح خارجي&quot; لقراءته مباشرة
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
