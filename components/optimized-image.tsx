import Image, { ImageProps } from 'next/image'
import { CSSProperties, useState } from 'react'
import { imageContextConfig, imageDimensions } from '@/lib/image-optimization'

type ImageContext = 'hero' | 'card' | 'thumbnail' | 'background'

interface OptimizedImageProps extends Omit<ImageProps, 'sizes'> {
  context?: ImageContext
  blurDataURL?: string
  showPlaceholder?: boolean
  containerClassName?: string
}

/**
 * Optimized Image Component with AVIF/WebP support
 * Provides automatic format selection, lazy loading, and responsive sizing
 */
export function OptimizedImage({
  context = 'card',
  blurDataURL,
  showPlaceholder = true,
  containerClassName = '',
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const config = imageContextConfig[context]

  return (
    <div className={`relative bg-muted/50 overflow-hidden ${containerClassName}`}>
      {/* Placeholder while loading */}
      {isLoading && showPlaceholder && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/5 animate-pulse" />
      )}

      {/* Actual image */}
      <Image
        {...props}
        alt={alt}
        quality={config.quality}
        priority={config.priority}
        loading={config.loading}
        onLoadingComplete={() => setIsLoading(false)}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${props.className || ''}`}
      />
    </div>
  )
}

/**
 * Picture element with AVIF/WebP support for maximum compatibility
 * Use this when you need the most control over image delivery
 */
export function PictureImage({
  src,
  alt,
  width,
  height,
  className = '',
  context = 'card',
  priority = false,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  context?: ImageContext
  priority?: boolean
}) {
  const pathWithoutExt = src.replace(/\.[^/.]+$/, '')
  const config = imageContextConfig[context]

  return (
    <picture>
      <source srcSet={`${pathWithoutExt}.avif`} type="image/avif" />
      <source srcSet={`${pathWithoutExt}.webp`} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`max-w-full h-auto ${className}`}
        loading={config.priority ? 'eager' : 'lazy'}
        style={{ width: '100%', height: 'auto' } as CSSProperties}
      />
    </picture>
  )
}

/**
 * High-performance background image component
 * Uses Next.js Image with fill layout for backgrounds
 */
export function BackgroundImage({
  src,
  alt,
  className = '',
  children,
}: {
  src: string
  alt: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        quality={85}
        priority={true}
        sizes="100vw"
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

/**
 * Lazy-loaded image component with intersection observer
 * Only loads image when it enters viewport
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  context = 'card',
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  context?: ImageContext
}) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isInView, setIsInView] = useState(false)

  return (
    <div
      className={className}
      ref={(el) => {
        if (!el || isInView) return
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(el)
          }
        })
        observer.observe(el)
      }}
    >
      {isInView ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          context={context}
        />
      ) : (
        <div className="w-full h-full bg-muted/50 animate-pulse" />
      )}
    </div>
  )
}
