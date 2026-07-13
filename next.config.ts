import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
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
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.vercel-insights.com https://*.vercel-analytics.com;",
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
