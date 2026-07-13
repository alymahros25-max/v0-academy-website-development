'use client'

import { useState, useMemo } from 'react'
import { VideoCard } from './VideoCard'

export interface VideoData {
  id: number
  title_ar: string
  title_en: string
  title_fr: string
  description_ar?: string
  description_en?: string
  description_fr?: string
  youtube_embed_id: string
  thumbnail_url?: string
  category?: string
  teacher_name_ar?: string
  teacher_name_en?: string
  teacher_name_fr?: string
  duration_seconds?: number
  is_featured?: boolean
}

interface VideoGridProps {
  videos: VideoData[]
  language?: 'ar' | 'en' | 'fr'
  showCategories?: boolean
}

export function VideoGrid({ videos, language = 'ar', showCategories = true }: VideoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(videos.map(v => v.category).filter(Boolean))) as string[]
  }, [videos])

  // Filter videos by category
  const filteredVideos = useMemo(() => {
    if (!selectedCategory) return videos
    return videos.filter(v => v.category === selectedCategory)
  }, [videos, selectedCategory])

  // Separate featured and regular videos
  const { featured, regular } = useMemo(() => {
    return {
      featured: filteredVideos.filter(v => v.is_featured),
      regular: filteredVideos.filter(v => !v.is_featured),
    }
  }, [filteredVideos])

  // Get localized text
  const getTitle = (video: VideoData) => {
    const titleKey = `title_${language}` as keyof VideoData
    return (video[titleKey] as string) || video.title_ar || 'بدون عنوان'
  }

  const getDescription = (video: VideoData) => {
    const descKey = `description_${language}` as keyof VideoData
    return (video[descKey] as string) || video.description_ar || ''
  }

  const getTeacherName = (video: VideoData) => {
    const teacherKey = `teacher_name_${language}` as keyof VideoData
    return (video[teacherKey] as string) || video.teacher_name_ar || ''
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === null
                ? 'bg-[#1a4d2e] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            الكل
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1a4d2e] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Featured Videos Section */}
      {featured.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[#1a4d2e] mb-4">الحصص المميزة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((video, index) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={getTitle(video)}
                description={getDescription(video)}
                thumbnailUrl={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_embed_id}/hqdefault.jpg`}
                videoId={video.youtube_embed_id}
                category={video.category}
                teacherName={getTeacherName(video)}
                durationSeconds={video.duration_seconds}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Videos Section */}
      {regular.length > 0 && (
        <div>
          {featured.length > 0 && (
            <h2 className="text-2xl font-bold text-[#1a4d2e] mb-4">باقي الحصص</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regular.map((video, index) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={getTitle(video)}
                description={getDescription(video)}
                thumbnailUrl={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_embed_id}/hqdefault.jpg`}
                videoId={video.youtube_embed_id}
                category={video.category}
                teacherName={getTeacherName(video)}
                durationSeconds={video.duration_seconds}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">📹</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">لا توجد حصص متاحة</h3>
          <p className="text-gray-500">سيتم إضافة الحصص قريباً. تابعنا للحصول على أحدث المحتوى</p>
        </div>
      )}
    </div>
  )
}
