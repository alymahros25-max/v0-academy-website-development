'use client'

import { useState, useEffect, useRef } from 'react'
import { X, FileVideo } from 'lucide-react'
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // تنظيف الـ ID من أي بارامترات زيادة (زي ?si=) أو لو جالنا رابط كامل بالغلط
  const cleanId = extractYouTubeId(videoId) ?? videoId

  // صيغة يوتيوب الرسمية: 11 حرف/رقم
  const isValidId = /^[a-zA-Z0-9_-]{11}$/.test(cleanId)

  // youtube-nocookie أفضل للخصوصية وبيشتغل بنفس الكفاءة
  const embedUrl = `https://www.youtube-nocookie.com/embed/${cleanId}?rel=0&modestbranding=1&playsinline=1`

  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)
    setHasError(false)

    // مهم: الـ iframe مش دايمًا بيطلق onError لو الفيديو محجوب أو الـ embedding متقفل
    // (بيرجع صفحة خطأ من يوتيوب نفسها وده بيتحسب onLoad ناجح)
    // فبنحط timeout كـ safety net: لو التحميل فضل شغال أكتر من كده، على الأغلب فيه مشكلة
    timeoutRef.current = setTimeout(() => {
      setIsLoading((loading) => {
        if (loading) setHasError(true)
        return false
      })
    }, 8000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isOpen, cleanId])

  const handleClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* الخلفية المظلمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* نافذة الفيديو */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* الهيدر */}
              <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#1a4d2e] to-[#2d7a4e] px-4 py-3 sm:px-6">
                <h2 className="text-sm sm:text-base font-bold text-white truncate" dir="rtl">
                  {title}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* حاوية الفيديو */}
              <div className="relative w-full bg-black aspect-video">
                {isValidId && !hasError ? (
                  <>
                    {/* لا تستخدم sandbox هنا — يعطّل postMessage APIs اللي يوتيوب محتاجها */}
                    <iframe
                      key={cleanId}
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full border-0 z-10"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      loading="eager"
                      onLoad={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current)
                        setIsLoading(false)
                      }}
                      title={title}
                    />

                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-4 border-[#d4af37]/35 border-t-[#d4af37] rounded-full animate-spin" />
                          <p className="text-sm text-white/70">جاري تحميل الفيديو...</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-900">
                    <div className="text-center px-4">
                      <FileVideo className="w-14 h-14 text-red-500 mx-auto mb-3" />
                      <p className="text-white font-medium text-sm sm:text-base mb-1">
                        عذراً، لا يمكن تشغيل هذا الفيديو
                      </p>
                      {!isValidId ? (
                        <p className="text-white/50 text-xs font-mono">ID غير صالح: {cleanId}</p>
                      ) : (
                        <a
                          href={`https://www.youtube.com/watch?v=${cleanId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d4af37] text-xs underline"
                        >
                          مشاهدة الفيديو على يوتيوب مباشرة
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* الفوتر */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
                <button
                  onClick={handleClose}
                  className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 font-medium"
                >
                  إغلاق النافذة
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
