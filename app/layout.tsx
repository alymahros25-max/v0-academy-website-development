import type { Metadata, Viewport } from "next"
import { Noto_Sans_Arabic, Inter } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "أكاديمية الحافظ المتميز اون لاين | تحفيظ قران وتأسيس عربي",
    template: "%s | أكاديمية الحافظ المتميز",
  },
  description:
    "أكاديمية عالمية لتحفيظ القرآن الكريم وتعليم التجويد وتأسيس اللغة العربية اون لاين مع معلمين مجازين. حصص فردية، مرونة في المواعيد، أسعار مناسبة.",
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
      <body
        className={`${notoArabic.variable} ${inter.variable} font-sans antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
        <SpeedInsights />
      </body>
    </html>
  )
}
