import { Metadata } from "next"
import { Suspense } from "react"
import LibraryContent from "@/components/digital-library/LibraryContent"

export const metadata: Metadata = {
  title: "المكتبة الرقمية | أكاديمية الحافظ المتميز",
  description: "مكتبة شاملة تضم كتباً إسلامية وتعليمية، تلاوات قرآنية، أناشيد دينية ومتون التجويد.",
  keywords: ["المكتبة", "كتب إسلامية", "تلاوات قرآنية", "أناشيد", "التجويد"],
  openGraph: {
    title: "المكتبة الرقمية الشاملة",
    description: "مكتبة إسلامية تعليمية شاملة مع كتب وتلاوات وأناشيد",
    type: "website",
  },
}

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1a4d2e]/10 via-background to-[#d4af37]/10 border-b border-border overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-bold border border-primary/30">
              مكتبة الأكاديمية الرقمية الشاملة
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
            المكتبة الرقمية الإسلامية الشاملة
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            مجموعة متنوعة من الكتب الإسلامية والتعليمية، تلاوات قرآنية من الشيوخ الأفاضل، أناشيد دينية تربوية، ومتون التجويد مع الشرح والصوت
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">جاري تحميل المحتوى...</p>
            </div>
          }>
            <LibraryContent />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
