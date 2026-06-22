'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PDFViewerModalProps {
  isOpen: boolean
  pdfUrl?: string
  title: string
  author?: string
  onClose: () => void
}

export function PDFViewerModal({ isOpen, pdfUrl, title, author, onClose }: PDFViewerModalProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(100)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  if (!pdfUrl) return null

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 25, 75))
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    if (totalPages > 0) {
      setCurrentPage(prev => Math.min(prev + 1, totalPages))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg border border-border w-full h-[90vh] max-w-4xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">{title}</h3>
                {author && <p className="text-xs text-muted-foreground">{author}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition ml-4"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 overflow-auto">
              {isLoading && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">جاري التحميل...</span>
                </div>
              )}

              {/* Embedded PDF - using iframe as fallback for now */}
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&zoom=${scale}`}
                className="w-full h-full border-0"
                title={title}
                onLoad={() => setIsLoading(false)}
              />
            </div>

            {/* Footer Controls */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-background gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 75}
                  className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground min-w-[50px] text-center">
                  {scale}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 200}
                  className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground min-w-[80px] text-center">
                  صفحة {currentPage}
                  {totalPages > 0 && ` من ${totalPages}`}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={totalPages > 0 && currentPage >= totalPages}
                  className="p-2 hover:bg-muted disabled:opacity-50 rounded-lg transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
