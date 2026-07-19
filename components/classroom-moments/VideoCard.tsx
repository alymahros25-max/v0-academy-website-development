'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { VideoPlayer } from '@/components/VideoPlayer'

interface VideoCardProps {
  id: string
  title: string
  description?: string
  thumbnailUrl: string
  videoId: string
  category?: string
  teacherName?: string
  durationSeconds?: number
  index?: number
}

export function VideoCard({
  id,
  title,
  description,
  thumbnailUrl,
  videoId,
  category,
  teacherName,
  durationSeconds,
  index = 0,
}: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const duration = formatDuration(durationSeconds)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-100">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-black overflow-hidden">
            {!imageError ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <Play className="w-12 h-12 text-white/50" />
              </div>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="bg-white/95 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                aria-label={`Play ${title}`}
              >
                <Play className="w-6 h-6 text-[#1a4d2e] fill-current" />
              </motion.button>
            </div>

            {/* Category Badge */}
            {category && (
              <div className="absolute top-2 left-2 px-3 py-1 bg-[#d4af37] text-[#1a4d2e] text-xs font-semibold rounded-full">
                {category}
              </div>
            )}

            {/* Duration Badge */}
            {duration && (
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 text-white text-xs font-medium rounded">
                {duration}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 bg-white">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#1a4d2e] transition-colors">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {description}
              </p>
            )}

            {/* Teacher Name */}
            {teacherName && (
              <p className="text-xs text-[#1a4d2e] font-medium">
                👨‍🏫 {teacherName}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Video Player - Protected Component */}
      <VideoPlayer
        isOpen={isOpen}
        videoId={videoId}
        title={title}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
