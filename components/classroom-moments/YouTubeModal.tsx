'use client'

import { useState, useEffect } from 'react'
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

  // استخراج الـ ID بشكل آمن وتنظيفه من أي بارامترات زيادة
  const cleanId = extractYouTubeId(videoId) ?? videoId
  
  // التحقق من أن الـ ID يتكون من 11 حرفاً (صيغة اليوتيوب الرسمية)
  const isValidId = /^[a-zA-Z0-9_-]{11}$/.test(cleanId)
  
  // رابط التضمين الرسمي والسريع والمباشر
  const embedUrl = `https://www.youtube.com/embed/${cleanId}?rel=0&modestbranding=1&playsinline=1&controls=1`
  
  // إعادة تعيين حالة التحميل عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [isOpen, cleanId])

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
            onClick={onClose}
          />

          {/* نافذة الفيديو المتمركزة */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
              className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* الهيدر أو شريط العنوان */}
              <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#1a4d2e] to-[#2d7a4e] px-4 py-3 sm:px-6">
                <h2 className="text-sm sm:text-base font-bold text-white truncate" dir="rtl">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* حاوية الفيديو */}
              <div className="relative w-full bg-black aspect-video">
                {isValidId ? (
                  <>
                    <iframe
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full border-0 z-10"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      loading="eager"
                      onLoad={() => setIsLoading(false)}
                      title={title}
                    />
                    
                    {/* شاشة التحميل الذكية المؤقتة */}
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
                  /* في حال كان الآيدي غير صحيح */
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-900">
                    <div className="text-center px-4">
                      <FileVideo className="w-14 h-14 text-red-500 mx-auto mb-3" />
                      <p className="text-white font-medium text-sm sm:text-base mb-1">عذراً، لا يمكن تشغيل هذا الفيديو</p>
                      <p className="text-white/50 text-xs font-mono">ID غير صالح: {cleanId}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* الفوتر */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
                <button 
                  onClick={onClose}
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
