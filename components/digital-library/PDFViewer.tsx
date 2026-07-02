"use client"

import { useState, Suspense } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic"

const PDFPage = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  loading: () => <div className="bg-muted h-96 flex items-center justify-center">جاري تحميل الكتاب...</div>,
  ssr: false,
})

const PDFDocument = dynamic(() => import("react-pdf").then((mod) => mod.Document), {
  loading: () => <div className="bg-muted h-96 flex items-center justify-center">جاري تحميل الكتاب...</div>,
  ssr: false,
})

interface PDFViewerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export function PDFViewer({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)

  function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }) {
    setNumPages(nextNumPages)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-right">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-muted rounded-lg flex items-center justify-center">
          <Suspense fallback={<div>جاري التحميل...</div>}>
            <PDFDocument file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <PDFPage pageNumber={pageNumber} scale={scale} />
            </PDFDocument>
          </Suspense>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 p-4 bg-card border-t border-border rounded-b-lg">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {pageNumber} / {numPages || "..."}
            </span>
            <button
              onClick={() => setPageNumber(Math.min(numPages || 1, pageNumber + 1))}
              disabled={!numPages || pageNumber >= numPages}
              className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(2, scale + 0.1))}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition ms-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
