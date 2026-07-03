import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Download, Share2, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data - في الإنتاج ستأتي من قاعدة البيانات
const books = {
  "al-qaida-an-noraniyah": {
    id: 1,
    title: "القاعدة النورانية",
    titleEn: "Al-Qaida An-Noraniyah",
    author: "الشيخ محمد حقاني",
    authorEn: "Sheikh Muhammad Haqqani",
    description: "أساس تعليم القراءة السليمة للقرآن الكريم بطريقة ميسرة وسهلة",
    descriptionEn: "The foundation for teaching correct Quranic reading in an easy and simplified way",
    category: "quran",
    pages: 24,
    content: `
      # القاعدة النورانية
      
      ## مقدمة
      كتاب القاعدة النورانية يعتبر من أهم وأشهر الكتب التي تعلم قراءة القرآن الكريم بالطريقة الصحيحة.
      
      ## محتويات الكتاب
      1. تعليم الحروف العربية والنطق الصحيح
      2. قواعد التشديد والتنوين
      3. أحكام التفخيم والترقيق
      4. تمارين عملية على الحروف
      
      ## الفوائد
      - تعلم نطق الحروف من مخارجها الصحيحة
      - إتقان أحكام التجويد الأساسية
      - تحسين مستوى التلاوة والقراءة
      - مناسبة للأطفال والمبتدئين
    `,
    pdfUrl: "https://example.com/books/al-qaida-an-noraniyah.pdf",
    coverUrl: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600",
    rating: 4.9,
    downloads: 12500,
    isFree: true,
  },
  "tajweed-rules": {
    id: 2,
    title: "أحكام التجويد المبسطة",
    titleEn: "Simplified Tajweed Rules",
    author: "الشيخ أحمد محمود",
    authorEn: "Sheikh Ahmad Mahmoud",
    description: "شرح مبسط لأهم أحكام التجويد بطريقة سهلة وعملية",
    descriptionEn: "Simplified explanation of the most important Tajweed rules in an easy and practical way",
    category: "tajweed",
    pages: 48,
    content: `
      # أحكام التجويد المبسطة
      
      ## الأحكام الأساسية
      1. الإظهار والإدغام
      2. الإقلاب والإخفاء
      3. التفخيم والترقيق
      4. المد والقصر
      
      ## القواعد العملية
      - كيفية تطبيق الأحكام في التلاوة
      - تمارين عملية
      - أمثلة من سور القرآن الكريم
    `,
    pdfUrl: "https://example.com/books/tajweed-rules.pdf",
    coverUrl: "https://images.unsplash.com/photo-1543002588-d83cdf395fff?w=400&h=600",
    rating: 4.8,
    downloads: 7600,
    isFree: true,
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const book = books[params.slug as keyof typeof books]

  if (!book) {
    return {
      title: "الكتاب غير موجود",
    }
  }

  return {
    title: `${book.title} | أكاديمية الحافظ المتميز`,
    description: book.description,
    keywords: [book.title, book.author, "كتب إسلامية", "تعليم القرآن"],
    openGraph: {
      title: book.title,
      description: book.description,
      type: "article",
      images: [
        {
          url: book.coverUrl,
          width: 400,
          height: 600,
          alt: book.title,
        },
      ],
    },
  }
}

export function generateStaticParams() {
  return Object.keys(books).map((slug) => ({
    slug,
  }))
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = books[params.slug as keyof typeof books]

  if (!book) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/library" className="text-primary hover:underline">
            المكتبة الرقمية
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">{book.title}</span>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Book Cover & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Cover */}
              <div className="rounded-lg overflow-hidden shadow-lg border border-border">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>

              {/* Book Info */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">الفئة</p>
                  <p className="text-sm font-semibold text-primary">
                    {book.category === "quran"
                      ? "القرآن الكريم"
                      : book.category === "tajweed"
                        ? "التجويد"
                        : "كتب إسلامية"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">التقييم</p>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-foreground">{book.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">عدد الصفحات</p>
                    <p className="text-lg font-bold text-foreground">{book.pages}</p>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {book.downloads.toLocaleString()} تحميل
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  {book.isFree && (
                    <button className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      تحميل مجاني
                    </button>
                  )}
                  <button className="w-full py-2.5 px-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition font-semibold flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{book.titleEn}</p>
              <p className="text-lg font-semibold text-foreground">
                تأليف: <span className="text-primary">{book.author}</span>
              </p>
            </div>

            {/* Description */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-foreground leading-relaxed">{book.description}</p>
            </div>

            {/* Detailed Content */}
            <div className="prose prose-invert max-w-none">
              <div className="bg-card border border-border rounded-lg p-8 text-foreground space-y-6">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {book.content.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) {
                      return (
                        <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-primary">
                          {line.replace("# ", "")}
                        </h2>
                      )
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h3 key={i} className="text-xl font-semibold mt-4 mb-2 text-foreground">
                          {line.replace("## ", "")}
                        </h3>
                      )
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="ml-6 list-disc text-muted-foreground">
                          {line.replace("- ", "")}
                        </li>
                      )
                    }
                    if (line.startsWith("1. ") || line.match(/^\d+\. /)) {
                      return (
                        <li key={i} className="ml-6 list-decimal text-muted-foreground">
                          {line.replace(/^\d+\. /, "")}
                        </li>
                      )
                    }
                    if (line.trim() === "") {
                      return <div key={i} className="h-3" />
                    }
                    return (
                      <p key={i} className="text-muted-foreground leading-relaxed">
                        {line.trim()}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Related Books */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">كتب ذات صلة</h2>
                <Link
                  href="/library"
                  className="flex items-center gap-1 text-primary hover:underline text-sm font-semibold"
                >
                  عرض الكل
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {Object.entries(books)
                  .filter(([slug]) => slug !== params.slug)
                  .slice(0, 2)
                  .map(([slug, relatedBook]) => (
                    <Link
                      key={slug}
                      href={`/library/${slug}`}
                      className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-muted">
                        <img
                          src={relatedBook.coverUrl}
                          alt={relatedBook.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {relatedBook.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{relatedBook.author}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
