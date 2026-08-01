import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Noto_Sans_Arabic, Inter } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { ErrorBoundary } from "@/components/error-boundary"
import { generateOrganizationSchema, generateWebSiteSchema, generateCombinedSchema } from "@/lib/schema"
import { generatePreconnectLinks } from "@/lib/prefetch-utils"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "600", "700"],
  preload: true,
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://quran-elhafez.com'),
  title: "أكاديمية الحافظ المتميز اون لاين | تحفيظ قران وتأسيس عربي",
  description:
    "أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين مع معلمين مجازين",
  keywords: [
    "تحفيظ قران اون لاين",
    "تأسيس عربي",
    "أكاديمية الحافظ المتميز",
    "تعليم القرآن",
    "تجويد",
    "حفظ القرآن",
    "معلم قرآن اون لاين",
    "تعليم اللغة العربية للأطفال",
    "Quran memorization online",
    "Arabic language learning",
    "online Quran academy",
  ],
  authors: [{ name: "أكاديمية الحافظ المتميز" }],
  creator: "أكاديمية الحافظ المتميز",
  alternates: {
    languages: {
      'ar': 'https://quran-elhafez.com',
      'en': 'https://quran-elhafez.com?lang=en',
      'fr': 'https://quran-elhafez.com?lang=fr',
      'x-default': 'https://quran-elhafez.com',
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US", "fr_FR"],
    url: "https://quran-elhafez.com",
    siteName: "أكاديمية الحافظ المتميز اون لاين",
    title: "أكاديمية الحافظ المتميز اون لاين | تحفيظ قران وتأسيس عربي",
    description:
      "أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين مع معلمين مجازين",
    images: [{ url: "/images/hero-children.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أكاديمية الحافظ المتميز اون لاين",
    description:
      "أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين",
    images: ["/images/hero-children.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // JSON-LD Schema for SEO rich snippets
    'application/ld+json': JSON.stringify(
      generateCombinedSchema(
        generateOrganizationSchema(),
        generateWebSiteSchema()
      )
    ),
  },
}

export const viewport: Viewport = {
  themeColor: "#1a4d2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Critical resource preloading for faster FCP/LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://xtfyrskkoewanmkcfixw.supabase.co" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        
        {/* Defer Google Analytics to improve FCP/LCP */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-94X5S3J229"
          async
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-94X5S3J229', {
                page_path: window.location.pathname,
                page_title: document.title,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${notoArabic.variable} ${inter.variable} font-sans antialiased`}
      >
        <ErrorBoundary context="RootLayout">
          <ClientProviders>{children}</ClientProviders>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
