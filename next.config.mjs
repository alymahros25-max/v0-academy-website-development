/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================
  // PERFORMANCE & OPTIMIZATION
  // ============================================================
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enable experimental features for optimization
  experimental: {
    // Enable external packages for better tree-shaking
    optimizePackageImports: [
      '@vercel/analytics',
      '@supabase/supabase-js',
      'lucide-react',
    ],
  },

  // ============================================================
  // IMAGE OPTIMIZATION
  // ============================================================
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for immutable images
    unoptimized: false,
  },

  // ============================================================
  // HEADERS & SECURITY
  // ============================================================
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Vary',
            value: 'Accept-Encoding, Accept-Language',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },

  // ============================================================
  // REDIRECTS (301 Permanent)
  // ============================================================
  async redirects() {
    return [
      // Ensure trailing slashes are consistent
      {
        source: '/admin/:path',
        destination: '/admin/:path/',
        permanent: false,
      },
    ]
  },

  // ============================================================
  // REWRITES (Internal routing without URL change)
  // ============================================================
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite language-prefixed routes to root routes
        {
          source: '/en/:path*',
          destination: '/:path*?lang=en',
        },
        {
          source: '/fr/:path*',
          destination: '/:path*?lang=fr',
        },
      ],
    }
  },

  // ============================================================
  // BUILD OPTIMIZATION
  // ============================================================
  productionBrowserSourceMaps: false,

  // Generate ETags for better caching
  generateEtags: true,

  // Enable compression for responses
  compress: true,

  // ============================================================
  // WEBPACK BUNDLING
  // ============================================================
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor code
            vendor: {
              filename: 'chunks/vendor.js',
              test: /node_modules/,
              priority: 10,
              reuseExistingChunk: true,
              name: 'vendor',
            },
            // React and related
            react: {
              filename: 'chunks/react.js',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
              name: 'react',
            },
            // Common code shared between chunks
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    return config
  },
}

export default nextConfig
