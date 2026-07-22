// CRITICAL COMPONENT - DO NOT MODIFY
// This component is LOCKED and should only be imported.
// All blog rendering logic is isolated here to prevent breakage from global updates.
// To change blog appearance, only modify props or extend via composition.

"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, Tag } from "lucide-react"
import { useI18n, type Locale } from "@/lib/i18n"
import useSWR from "swr"

export interface BlogPost {
  id: string
  slug: string
  title_ar: string
  title_en: string
  title_fr: string
  excerpt_ar: string
  excerpt_en: string
  excerpt_fr: string
  content_ar: string
  content_en: string
  content_fr: string
  cover_image: string
  category_ar: string
  category_en: string
  category_fr: string
  author_ar: string
  author_en: string
  author_fr: string
  read_time: number
  is_published: boolean
  published_at: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

function getField(post: BlogPost, field: 'title' | 'excerpt' | 'content' | 'category' | 'author', locale: Locale): string {
  return post[`${field}_${locale}` as keyof BlogPost] as string
    || post[`${field}_ar` as keyof BlogPost] as string
    || ''
}

function BlogCard({ post, locale, t }: { post: BlogPost; locale: Locale; t: (k: string) => string }) {
  const title = getField(post, 'title', locale)
  const excerpt = getField(post, 'excerpt', locale)
  const category = getField(post, 'category', locale)

  const dateLocale = locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US'
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group cursor-pointer h-full">
        <div className="rounded-xl overflow-hidden bg-card border border-border transition-all hover:shadow-lg hover:border-primary/50 h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 overflow-hidden shrink-0">
            <Image
              src={post.cover_image || '/images/hero-children.jpg'}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {category && (
              <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                {category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            {/* Date */}
            {formattedDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {title}
            </h2>

            {/* Excerpt */}
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed flex-1">
              {excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{getField(post, 'author', locale)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{post.read_time} {t('blog.readTime')}</span>
              </div>
            </div>

            <span className="inline-flex items-center justify-center w-full mt-1 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              {t('common.readMore')}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl border border-border overflow-hidden animate-pulse">
          <div className="h-48 bg-muted" />
          <div className="p-5 flex flex-col gap-3">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-5 w-full bg-muted rounded" />
            <div className="h-5 w-3/4 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-5/6 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Main exported component - LOCKED
export function BlogSection() {
  const { t, locale } = useI18n()
  const { data: posts, isLoading, error } = useSWR<BlogPost[]>('/api/blog', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  if (isLoading) return <BlogSkeleton />

  if (error || !posts) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>{t('common.error')}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>{t('admin.noData')}</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <BlogCard key={post.id} post={post} locale={locale} t={t} />
      ))}
    </div>
  )
}
