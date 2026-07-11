'use client'

import { useState, useEffect } from 'react'
import { X, FileVideo, AlertCircle } from 'lucide-react'
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
  const [hasError, setHasError] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [useNoCookie, setUseNoCookie] = useState(true)

  // Re-extract the ID here as a safety net: the prop might be a full URL
  // if the data mapping changes, or it might carry ?si= tracking params.
  const cleanId = extractYouTubeId(videoId) ?? videoId
  
  // Validate video ID format
  const isValidId = /^[a-zA-Z0-9_-]{11}$/.test(cleanId)
  
  // Primary embed URL (youtube-nocookie.com for better network compatibility in restricted environments)
  const primaryEmbedUrl = `https://www.youtube-nocookie.com/embed/${cleanId}?rel=0&modestbranding=1&playsinline=1&controls=1&autohide=0`
  
  // Fallback URL (standard YouTube embed)
  const fallbackEmbedUrl = `https://www.youtube.com/embed/${cleanId}?rel=0&modestbranding=1&playsinline=1&controls=1&autohide=0`
  
  // Choose which URL to use based on attempt
  const embedUrl = useNoCookie ? primaryEmbedUrl : fallbackEmbedUrl
  
  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setHasError(false)
      setLoadAttempt(0)
      setUseNoCookie(true)
    }
  }, [isOpen])
  
  if (!isValidId) {
    console.error(`[YouTubeModal] Invalid video ID: ${cleanId}`)
  }

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

              {/* YouTube iframe with proper sandbox and error handling */}
              {!hasError && isValidId ? (
                <>
                  <iframe
                    key={`video-${cleanId}-${useNoCookie ? 'nocookie' : 'standard'}`}
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-presentation allow-popups-to-escape-sandbox"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => {
                      setIsLoading(false)
                      setHasError(false)
                      console.log(`[v0] YouTube video loaded successfully: ${cleanId}`)
                    }}
                    onError={() => {
                      console.warn(`[v0] iframe onError triggered for: ${cleanId}`)
                      if (useNoCookie && loadAttempt < 1) {
                        // Try fallback (standard YouTube)
                        setUseNoCookie(false)
                        setLoadAttempt(prev => prev + 1)
                        setIsLoading(true)
                      } else {
                        setIsLoading(false)
                        setHasError(true)
                        console.error(`[v0] Failed to load video after all attempts: ${cleanId}`)
                      }
                    }}
                    title={title}
                  />
                  
                  {/* Timeout fallback - if not loaded after 8 seconds, try fallback */}
                  {isLoading && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'none'
                    }} id={`timeout-${cleanId}`} />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/80">
                  <div className="text-center px-4">
                    <FileVideo className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <p className="text-white font-medium mb-2">فشل في تحميل الفيديو</p>
                    {!isValidId ? (
                      <>
                        <p className="text-white/60 text-sm mb-3">معرّف الفيديو غير صحيح</p>
                        <p className="text-white/50 text-xs font-mono">{cleanId}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-white/60 text-sm mb-3">الفيديو غير متاح أو الاتصال بطيء</p>
                        <p className="text-white/50 text-xs">يرجى المحاولة لاحقاً</p>
                      </>
                    )}
                  </div>
                </div>
              )}
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
