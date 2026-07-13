"use client"

import { useState } from "react"
import { BookOpen, Music, Headphones, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface LibraryCardProps {
  id: string
  title: string
  description?: string
  author?: string
  contentType: "book" | "quran_audio" | "nasheed" | "tajweed"
  thumbnail?: string
  onRead?: () => void
  onPlay?: () => void
  category?: string
  isFeatured?: boolean
}

export function LibraryCard({
  id,
  title,
  description,
  author,
  contentType,
  thumbnail,
  onRead,
  onPlay,
  category,
  isFeatured,
}: LibraryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = () => {
    switch (contentType) {
      case "book":
        return <BookOpen className="w-5 h-5" />
      case "quran_audio":
        return <Headphones className="w-5 h-5" />
      case "nasheed":
        return <Music className="w-5 h-5" />
      case "tajweed":
        return <Zap className="w-5 h-5" />
      default:
        return <BookOpen className="w-5 h-5" />
    }
  }

  const getLabel = () => {
    switch (contentType) {
      case "book":
        return "كتاب"
      case "quran_audio":
        return "تلاوة قرآنية"
      case "nasheed":
        return "أنشودة"
      case "tajweed":
        return "متن تجويد"
      default:
        return "محتوى"
    }
  }

  const getColor = () => {
    switch (contentType) {
      case "book":
        return "from-emerald-500/10 to-emerald-600/10"
      case "quran_audio":
        return "from-blue-500/10 to-blue-600/10"
      case "nasheed":
        return "from-purple-500/10 to-purple-600/10"
      case "tajweed":
        return "from-amber-500/10 to-amber-600/10"
      default:
        return "from-primary/10 to-secondary/10"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <div className={`bg-gradient-to-br ${getColor()} rounded-xl border border-border overflow-hidden h-full flex flex-col transition-all hover:shadow-lg`}>
        {/* Thumbnail */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              {getIcon()}
            </div>
          )}

          {isFeatured && (
            <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
              مميز
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <div className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full">
              {category}
            </div>
          )}

          {/* Content Type Badge */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center gap-2"
          >
            <span className="text-white text-xs font-semibold">{getLabel()}</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-bold text-foreground line-clamp-2 mb-2">{title}</h3>

          {author && (
            <p className="text-sm text-muted-foreground mb-3">✍️ {author}</p>
          )}

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-auto flex gap-2">
            {contentType === "book" && onRead && (
              <Button
                onClick={onRead}
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                قراءة
              </Button>
            )}

            {(contentType === "quran_audio" ||
              contentType === "nasheed" ||
              contentType === "tajweed") &&
              onPlay && (
                <Button
                  onClick={onPlay}
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  استماع
                </Button>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
