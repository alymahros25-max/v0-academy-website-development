import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // ============================================================
  // IMAGE OPTIMIZATION
  // ============================================================
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // ============================================================
  // COMPRESSION & PERFORMANCE
  // ============================================================
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  trailingSlash: false,

  // ============================================================
  // HEADERS FOR SECURITY & SEO
  // ============================================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // ============= SECURITY HEADERS =============
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Enable XSS protection in older browsers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy for privacy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Content Security Policy
          // IMPORTANT: frame-src MUST include YouTube domains for the video player to work.
          // Do NOT remove youtube.com or youtube-nocookie.com from frame-src.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-insights.com https://www.googletagmanager.com https://*.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.vercel-insights.com https://*.vercel-analytics.com https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://www.google.com https://*.googletagmanager.com",
              // LOCKED: These two frame-src entries keep the YouTube video player working.
              // Do NOT remove or modify them during future updates.
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "worker-src blob:",
              "media-src 'self' https:",
            ].join('; '),
          },
          // Permissions Policy (formerly Feature Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // ============= SEO & META HEADERS =============
          // Ensure HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Prevent DNS prefetching security issues
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      // ============= STATIC ASSETS CACHING =============
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ============= FONT FILES CACHING =============
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ============= IMAGES CACHING =============
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // ============================================================
  // REDIRECTS FOR BACKWARD COMPATIBILITY
  // ============================================================
  async redirects() {
    return [
      // Old domain redirect (if needed)
      {
        source: '/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ]
  },

  // ============================================================
  // WEBPACK OPTIMIZATION
  // ============================================================
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Separate vendor code for better caching
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        // React libraries
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          name: 'react',
          priority: 20,
          reuseExistingChunk: true,
          enforce: true,
        },
      }
    }
    return config
  },

  // ============================================================
  // EXPERIMENTAL FEATURES FOR PERFORMANCE
  // ============================================================
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
