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
    // Enable external packages for better tree-shaking (disabled for Vercel compat)
    // optimizePackageImports: [
    //   '@vercel/analytics',
    //   '@supabase/supabase-js',
    //   'lucide-react',
    // ],
  },

  // ============================================================
  // TURBOPACK CONFIGURATION (Next.js 16 default bundler)
  // ============================================================
  // Empty turbopack config allows custom webpack configs to work alongside Turbopack
  // This resolves the "This build is using Turbopack, with a custom webpack configuration" warning
  turbopack: {},

  // ============================================================
  // IMAGE OPTIMIZATION
  // ============================================================
  images: {
    qualities: [75, 80, 85, 100],
    formats: ['image/avif', 'image/webp'],
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
      // Content Security Policy for all pages
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com https://www.googletagmanager.com https://www.google-analytics.com cdn.jsdelivr.net",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data: https:",
              "connect-src 'self' https: blob:",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
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
      // Admin routes are handled by proxy.ts - do NOT redirect here
      // Ensure trailing slashes are consistent for other routes only
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
