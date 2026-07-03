import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Download, Share2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface LibraryItem {
  id: string
  title: string
  slug: string
  description: string
  content_type: string
  file_url: string
  cover_image: string
  author: string
  category: string
  is_published: boolean
  duration_seconds?: number
  page_count?: number
}

// Sample data for testing - يتم جلبها من Supabase في الإنتاج
const sampleBooks: Record<string, LibraryItem> = {
  "al-qaida-an-noraniyah": {
    id: "1",
    title: "القاعدة النورانية",
    slug: "al-qaida-an-noraniyah",
    description: "كتاب أساسي لتعليم الأطفال قراءة القرآن الكريم بالطريقة الصحيحة",
    content_type: "pdf",
    file_url: "https://example.com/books/al-qaida.pdf",
    cover_image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=600&h=800",
    author: "الشيخ محمد حقاني",
    category: "quran",
    is_published: true,
    page_count: 24,
  },
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const book = sampleBooks[params.slug]

  if (!book) {
    return { title: "كتاب غير موجود" }
  }

  return {
    title: `${book.title} | أكاديمية الحافظ المتميز`,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      type: "article",
      images: [{ url: book.cover_image }],
    },
  }
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  // First try to fetch from database
  let book = null
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
    
    const response = await fetch(
      `${baseUrl}/api/cms/digital-library?published=false`,
      { 
        headers: {
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
        },
        cache: "no-store"
      }
    )
    
    if (response.ok) {
      const items = await response.json()
      book = items.find((item: any) => item.slug === params.slug)
    }
  } catch (error) {
    console.log("[v0] Database fetch failed, trying sample books")
  }

  // Fallback to sample books
  if (!book) {
    book = sampleBooks[params.slug]
  }

  if (!book) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Breadcrumb */}
      <nav className="bg-muted/30 py-3 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/library" className="text-primary hover:underline">
            المكتبة
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold">{book.title}</span>
        </div>
      </nav>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Cover Image */}
              <div className="rounded-lg overflow-hidden shadow-lg border border-border">
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>

              {/* Book Info */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase">الفئة</p>
                  <p className="text-sm font-semibold text-primary capitalize">{book.category}</p>
                </div>

                {book.page_count && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">عدد الصفحات</p>
                    <p className="text-lg font-bold text-foreground">{book.page_count}</p>
                  </div>
                )}

                {book.duration_seconds && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المدة</p>
                    <p className="text-lg font-bold text-foreground">
                      {Math.round(book.duration_seconds / 60)} دقيقة
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  {book.content_type === "pdf" ? (
                    <a
                      href={book.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      فتح الكتاب
                    </a>
                  ) : book.content_type === "quran_audio" || book.content_type === "nasheed" ? (
                    <audio
                      controls
                      className="w-full rounded-lg bg-muted p-2"
                      src={book.file_url}
                    />
                  ) : null}

                  <button className="w-full py-2.5 px-4 border border-border text-foreground rounded-lg hover:bg-muted transition font-semibold flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
              <p className="text-lg font-semibold text-muted-foreground">
                تأليف: <span className="text-primary">{book.author}</span>
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-foreground leading-relaxed text-lg">{book.description}</p>
            </div>

            {/* Content Display */}
            {book.content_type === "pdf" && (
              <div className="bg-card border border-border rounded-lg p-8">
                <iframe
                  src={`${book.file_url}#view=FitH`}
                  className="w-full h-screen rounded-lg"
                  title={book.title}
                />
              </div>
            )}

            {(book.content_type === "quran_audio" || book.content_type === "nasheed") && (
              <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
                <div className="flex justify-center">
                  <audio
                    controls
                    className="w-full max-w-md"
                    src={book.file_url}
                  />
                </div>
                <p className="text-muted-foreground">
                  {book.content_type === "quran_audio"
                    ? "استمع إلى التلاوة القرآنية"
                    : "استمع إلى الأنشودة"}
                </p>
              </div>
            )}

            {/* Back Link */}
            <div className="pt-8 border-t border-border">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
              >
                <ArrowRight className="w-4 h-4" />
                العودة إلى المكتبة
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
