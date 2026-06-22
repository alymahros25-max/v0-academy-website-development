'use client'

import { motion } from 'framer-motion'
import { BookOpen, Music, Headphones } from 'lucide-react'
import { LibraryItem, getTitle, getContentTypeLabel, getContentTypeColor } from '@/lib/library-utils'

interface LibraryCardProps {
  item: LibraryItem
  locale: string
  onRead?: (item: LibraryItem) => void
  onListen?: (item: LibraryItem) => void
  isRTL?: boolean
}

export function LibraryCard({
  item,
  locale,
  onRead,
  onListen,
  isRTL = true
}: LibraryCardProps) {
  const title = getTitle(item, locale)
  const typeLabel = getContentTypeLabel(item.content_type, locale)
  const colors = getContentTypeColor(item.content_type)
  
  const hasRead = item.pdf_url && item.content_type === 'book'
  const hasListen = item.audio_url

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      {item.thumbnail_url ? (
        <div className="relative h-40 bg-muted overflow-hidden">
          <img
            src={item.thumbnail_url}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {item.is_featured && (
            <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold">
              {locale === 'ar' ? 'مميز' : 'Featured'}
            </div>
          )}
        </div>
      ) : (
        <div className={`h-40 ${colors.bg} flex items-center justify-center border-b ${colors.border}`}>
          {item.content_type === 'book' && (
            <BookOpen className={`w-16 h-16 ${colors.text}`} />
          )}
          {item.content_type === 'quran_audio' && (
            <Headphones className={`w-16 h-16 ${colors.text}`} />
          )}
          {item.content_type === 'nasheed' && (
            <Music className={`w-16 h-16 ${colors.text}`} />
          )}
          {item.content_type === 'tajweed' && (
            <BookOpen className={`w-16 h-16 ${colors.text}`} />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className={`text-xs font-semibold ${colors.text} mb-1`}>
            {typeLabel}
          </p>
          <h3 className="font-bold text-foreground line-clamp-2">{title}</h3>
          {item.author_ar && (
            <p className="text-xs text-muted-foreground mt-1">
              {locale === 'ar' ? 'المؤلف: ' : 'Author: '}
              {locale === 'ar' ? item.author_ar : item.author_en || item.author_ar}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {item.page_count && item.content_type === 'book' && (
            <span className="bg-muted px-2 py-1 rounded">
              {item.page_count} {locale === 'ar' ? 'صفحة' : 'pages'}
            </span>
          )}
          {item.duration_seconds && (
            <span className="bg-muted px-2 py-1 rounded">
              {Math.floor(item.duration_seconds / 60)} {locale === 'ar' ? 'دقيقة' : 'min'}
            </span>
          )}
          {item.tajweed_level && (
            <span className="bg-muted px-2 py-1 rounded">
              {locale === 'ar' ? 'مستوى: ' : 'Level: '}
              {item.tajweed_level}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {hasRead && onRead && (
            <button
              onClick={() => onRead(item)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              {locale === 'ar' ? '📖 قراءة' : 'Read'}
            </button>
          )}
          {hasListen && onListen && (
            <button
              onClick={() => onListen(item)}
              className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
            >
              {locale === 'ar' ? '🎧 استمع' : 'Listen'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
