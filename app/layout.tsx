import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Noto_Sans_Arabic, Inter } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { ErrorBoundary } from "@/components/error-boundary"
import { generateOrganizationSchema, generateWebSiteSchema, generateCombinedSchema } from "@/lib/schema"
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
    "أكاديمية الحافظ المتميز العالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية أونلاين للناطقين بالعربية في الخليج وأوروبا وأمريكا وكندا، مع معلمين مجازين وحصص فردية ومواعيد تناسب فروق التوقيت.",
  keywords: [
    "تحفيظ القرآن أونلاين للعرب في الخارج",
    "تحفيظ القرآن أونلاين للسعودية والإمارات وقطر والكويت والبحرين وعمان والأردن للناطقين بالعربية",
    "تحفيظ القرآن للناطقين بالعربية في الخليج والأردن وأوروبا وأمريكا",
    "معلم قرآن عربي أونلاين في السعودية والإمارات وأوروبا وأمريكا",
    "دروس تجويد وحفظ قرآن عن بعد",
    "تأسيس اللغة العربية للأطفال العرب في الخليج والأردن وأوروبا وأمريكا",
    "تأسيس العربي أونلاين للناطقين بالعربية في الخليج والأردن وأوروبا وأمريكا",
    "online Quran memorization classes for Arabic speakers in Gulf Europe USA",
    "online Arabic classes for Arab children abroad",
    "native Arabic Quran tutor online",
    "Quran and Arabic lessons for students in USA UK Canada Europe",
  ],
  authors: [{ name: "أكاديمية الحافظ المتميز" }],
  creator: "أكاديمية الحافظ المتميز",
  alternates: {
    // Only advertise language URLs that the application actually serves.
    // Regional relevance comes from truthful content and structured data, not cloaking.
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
    alternateLocale: [
      "ar_AE", "ar_KW", "ar_QA", "ar_BH", "ar_OM", // Gulf regions
      "ar_US", "ar_GB", "ar_FR", "ar_DE", "ar_IT", // Western diaspora
      "en_US", "en_GB", "fr_FR", // Western languages
    ],
    url: "https://quran-elhafez.com",
    siteName: "أكاديمية الحافظ المتميز اون لاين",
    title: "أكاديمية الحافظ المتميز اون لاين | تحفيظ قران وتأسيس عربي",
    description:
      "تحفيظ القرآن وتأسيس العربية أونلاين للناطقين بالعربية في السعودية والإمارات وقطر وأوروبا وأمريكا وكندا، مع تعليم فردي عن بعد.",
    images: [{ url: "/images/hero-children.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أكاديمية الحافظ المتميز اون لاين",
    description:
      "تعليم القرآن وتأسيس اللغة العربية أونلاين للطلاب العرب في الخليج وأوروبا وأمريكا وكندا.",
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
    // Geographical targeting meta tags for Gulf region primary focus
    'geo.region': 'SA', // Saudi Arabia as primary
    'geo.position': '24.7136; 46.6753', // Riyadh coordinates (Gulf region center)
    'ICBM': '24.7136, 46.6753', // ICBM format for geographic position
    
    // Additional service regions for diaspora targeting
    'serviceable-regions': 'SA,AE,KW,QA,BH,OM,US,GB,FR,DE,IT',
    
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
  themeColor: "#91a63b",
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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
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
