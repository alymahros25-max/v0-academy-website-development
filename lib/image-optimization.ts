// Image Optimization Utilities for Next.js
// Provides functions for optimized image loading with AVIF, WebP, and fallback support

/**
 * Get optimized image src with format fallback
 * @param imagePath - Original image path
 * @returns Object with primary and fallback image sources
 */
export const getOptimizedImageSrc = (imagePath: string) => {
  // Extract path without extension
  const pathWithoutExt = imagePath.replace(/\.[^/.]+$/, '')
  
  return {
    avif: `${pathWithoutExt}.avif`,
    webp: `${pathWithoutExt}.webp`,
    original: imagePath,
  }
}

/**
 * Image quality settings for different use cases
 */
export const imageQuality = {
  thumbnail: 60,    // Small thumbnails
  card: 75,         // Card images
  hero: 85,         // Large hero images
  optimal: 80,      // Default optimal quality
}

/**
 * Image dimensions presets for responsive design
 */
export const imageDimensions = {
  thumbnail: { width: 150, height: 150 },
  avatar: { width: 100, height: 100 },
  card: { width: 400, height: 300 },
  hero: { width: 1200, height: 600 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 900, height: 600 },
}

/**
 * Responsive image sizes for Next.js Image component
 * Tells Next.js what image sizes to generate
 */
export const responsiveImageSizes = {
  thumbnail: '(max-width: 768px) 100px, 150px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
  hero: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px',
  full: '100vw',
}

/**
 * Generate srcSet for picture element with WebP and AVIF support
 */
export const generateSrcSet = (imagePath: string) => {
  const pathWithoutExt = imagePath.replace(/\.[^/.]+$/, '')
  
  return {
    avif: `${pathWithoutExt}.avif`,
    webp: `${pathWithoutExt}.webp`,
    png: `${pathWithoutExt}.png`,
    jpg: `${pathWithoutExt}.jpg`,
  }
}

/**
 * Image loading strategies for performance
 */
export const loadingStrategies = {
  eager: 'eager',          // Load immediately (above the fold)
  lazy: 'lazy',            // Lazy load (below the fold)
}

/**
 * Placeholder blur data generation configuration
 * Use for low-quality placeholder while image loads
 */
export const placeholderConfig = {
  enabled: true,
  size: 10,  // Low-quality image size
  quality: 1, // Very low quality
}

/**
 * Extract image filename from path
 */
export const getImageFileName = (imagePath: string): string => {
  return imagePath.split('/').pop() || 'image'
}

/**
 * Calculate aspect ratio from dimensions
 */
export const calculateAspectRatio = (width: number, height: number): string => {
  return `${width}/${height}`
}

/**
 * Next.js Image component optimization defaults
 */
export const nextImageDefaults = {
  quality: 85,
  placeholder: 'blur',
  sizes: responsiveImageSizes.card,
  priority: false,
  loading: 'lazy' as const,
}

/**
 * Image optimization configuration for different contexts
 */
export const imageContextConfig = {
  hero: {
    priority: true,
    loading: 'eager' as const,
    quality: 85,
    sizes: responsiveImageSizes.hero,
  },
  card: {
    priority: false,
    loading: 'lazy' as const,
    quality: 75,
    sizes: responsiveImageSizes.card,
  },
  thumbnail: {
    priority: false,
    loading: 'lazy' as const,
    quality: 60,
    sizes: responsiveImageSizes.thumbnail,
  },
  background: {
    priority: true,
    loading: 'eager' as const,
    quality: 80,
    sizes: responsiveImageSizes.full,
  },
}

/**
 * Generate Next.js Image fill props for background images
 */
export const generateFillProps = (context: 'hero' | 'card' | 'thumbnail' | 'background' = 'card') => {
  return {
    ...imageContextConfig[context],
    fill: true,
    style: { objectFit: 'cover' },
  }
}

/**
 * Performance metrics for image optimization
 * Expected improvements with AVIF/WebP
 */
export const performanceMetrics = {
  averageCompressionAVIF: 0.25,  // 75% compression (25% of original)
  averageCompressionWebP: 0.30,  // 70% compression (30% of original)
  averageCompressionJPG: 0.50,   // 50% compression (50% of original)
  estimatedLoadTimeReduction: 0.40, // 40% faster loading
}

/**
 * Browser support detection for image formats
 */
export const getBrowserImageSupport = () => {
  if (typeof window === 'undefined') {
    return { avif: true, webp: true } // Assume support on server
  }
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  return {
    webp: canvas.toDataURL('image/webp').includes('webp'),
    avif: canvas.toDataURL('image/avif').includes('avif'),
  }
}

/**
 * Lazy load intersection observer for images
 */
export const createLazyImageObserver = (threshold = 0.1) => {
  if (typeof window === 'undefined') return null
  
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute('data-src')
        }
        observer?.unobserve(entry.target)
      }
    })
  }, { threshold })
}

let observer: IntersectionObserver | null = null

/**
 * Initialize lazy image loading for all images with data-src attribute
 */
export const initLazyImageLoading = () => {
  if (typeof window === 'undefined') return
  
  observer = createLazyImageObserver()
  const images = document.querySelectorAll('img[data-src]')
  images.forEach((img) => observer?.observe(img))
}

/**
 * Image optimization summary configuration
 */
export const optimizationSummary = {
  formats: ['AVIF', 'WebP', 'JPG/PNG Fallback'],
  compressionRatio: '60-75%',
  loadTimeReduction: '30-50%',
  supportedBrowsers: 'All modern browsers',
  fallbackSupport: 'Automatic JPG/PNG',
}
