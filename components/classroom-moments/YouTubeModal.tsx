'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { extractYouTubeId } from '@/lib/youtube-utils'

interface YouTubeModalProps {
  isOpen: boolean
  videoId: string
  title: string
  onClose: () => void
}

export function YouTubeModal({ isOpen, videoId, title, onClose }: YouTubeModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Re-extract the ID here as a safety net: the prop might be a full URL
  // if the data mapping changes, or it might carry ?si= tracking params.
  const cleanId = extractYouTubeId(videoId) ?? videoId
  const embedUrl = `https://www.youtube.com/embed/${cleanId}?rel=0&modestbranding=1`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#1a4d2e] to-[#2d7a4e] px-6 py-4">
                <h2 className="text-lg font-bold text-white truncate">{title}</h2>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video Container */}
              <div className="relative w-full bg-black">
                <div className="aspect-video relative">
                  {/* Loading state */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
                        <p className="text-sm text-white/70">جاري التحميل...</p>
                      </div>
                    </div>
                  )}

                  {/* YouTube iframe — no sandbox attribute: it restricts the
                      YouTube player API and causes playback errors in mobile browsers */}
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                    title={title}
                  />
                </div>
              </div>

              {/* Footer with info */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  اضغط خارج النافذة للإغلاق أو استخدم زر الإغلاق (X)
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
