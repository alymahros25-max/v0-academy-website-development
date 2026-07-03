import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Download, Share2, ArrowRight, BookOpen, Headphones, Music2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

interface LibraryItem {
  id: string
  slug: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  author_ar: string
  author_en: string
  content_type: "book" | "quran_audio" | "nasheed" | "tajweed"
  pdf_url: string | null
  audio_url: string | null
  thumbnail_url: string | null
  category: string
  page_count: number | null
  duration_seconds: number | null
  qari_name_ar: string | null
  is_published: boolean
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function getBook(slug: string): Promise<LibraryItem | null> {
  try {
    const supabase = getSupabase()
    if (!supabase) return null

    const { data, error } = await supabase
      .from("digital_library")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error || !data) return null
    return data as LibraryItem
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const book = await getBook(slug)

  if (!book) {
    return { title: "محتوى غير موجود | أكاديمية الحافظ المتميز" }
  }

  return {
    title: `${book.title_ar} | أكاديمية الحافظ المتميز`,
    description: book.description_ar || book.title_ar,
    openGraph: {
      title: book.title_ar,
      description: book.description_ar || "",
      type: "article",
      images: book.thumbnail_url ? [{ url: book.thumbnail_url }] : [],
    },
  }
}

function getContentTypeLabel(type: string) {
  switch (type) {
    case "book": return "كتاب"
    case "tajweed": return "متن تجويد"
    case "quran_audio": return "تلاوة قرآنية"
    case "nasheed": return "نشيد"
    default: return "محتوى"
  }
}

function getContentTypeIcon(type: string) {
  switch (type) {
    case "book":
    case "tajweed": return BookOpen
    case "quran_audio":
    case "nasheed": return type === "nasheed" ? Music2 : Headphones
    default: return BookOpen
  }
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)

  if (!book) {
    notFound()
  }

  const isAudio = book.content_type === "quran_audio" || book.content_type === "nasheed"
  const isPdf = book.content_type === "book" || book.content_type === "tajweed"
  const ContentIcon = getContentTypeIcon(book.content_type)
  const authorName = book.qari_name_ar || book.author_ar || "غير محدد"

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Breadcrumb */}
      <nav className="bg-muted/30 py-3 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">الرئيسية</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/library" className="text-muted-foreground hover:text-primary transition-colors">المكتبة</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-semibold truncate max-w-xs">{book.title_ar}</span>
        </div>
      </nav>

      {/* Content */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-5">
              {/* Cover */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
                {book.thumbnail_url ? (
                  <img
                    src={book.thumbnail_url}
                    alt={book.title_ar}
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: isAudio ? "1/1" : "3/4" }}
                  />
                ) : (
                  <div
                    className="w-full bg-primary/10 flex items-center justify-center"
                    style={{ aspectRatio: isAudio ? "1/1" : "3/4" }}
                  >
                    <ContentIcon className="w-20 h-20 text-primary/40" />
                  </div>
                )}
              </div>

              {/* Meta card */}
              <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <ContentIcon className="w-3.5 h-3.5" />
                  {getContentTypeLabel(book.content_type)}
                </span>

                {book.page_count && (
                  <div className="flex justify-between items-center text-sm border-b border-border pb-3">
                    <span className="text-muted-foreground">عدد الصفحات</span>
                    <span className="font-bold text-foreground">{book.page_count}</span>
                  </div>
                )}

                {book.duration_seconds && (
                  <div className="flex justify-between items-center text-sm border-b border-border pb-3">
                    <span className="text-muted-foreground">المدة</span>
                    <span className="font-bold text-foreground">
                      {Math.floor(book.duration_seconds / 60)} د {book.duration_seconds % 60} ث
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">الفئة</span>
                  <span className="font-semibold text-foreground">{book.category || "عام"}</span>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-border space-y-3">
                  {isPdf && book.pdf_url && (
                    <a
                      href={book.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-bold flex items-center justify-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      تحميل / فتح الكتاب
                    </a>
                  )}

                  {isAudio && book.audio_url && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground text-center">الاستماع المباشر</p>
                      <audio
                        controls
                        className="w-full rounded-xl"
                        src={book.audio_url}
                        preload="metadata"
                      />
                    </div>
                  )}

                  <button className="w-full py-2.5 px-4 border border-border text-foreground rounded-xl hover:bg-muted transition font-semibold flex items-center justify-center gap-2 text-sm">
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
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">{book.title_ar}</h1>
              <p className="text-base font-medium text-muted-foreground">
                {isAudio ? "بصوت: " : "تأليف: "}
                <span className="text-primary font-bold">{authorName}</span>
              </p>
            </div>

            {book.description_ar && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <p className="text-foreground leading-relaxed text-base">{book.description_ar}</p>
              </div>
            )}

            {/* PDF Viewer */}
            {isPdf && book.pdf_url && (
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <p className="font-bold text-foreground text-sm">معاينة الكتاب</p>
                  <a
                    href={book.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    فتح في نافذة جديدة
                  </a>
                </div>
                <iframe
                  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(book.pdf_url)}`}
                  className="w-full border-0"
                  style={{ height: "80vh" }}
                  title={book.title_ar}
                  loading="lazy"
                />
              </div>
            )}

            {/* Audio Player (large) */}
            {isAudio && book.audio_url && (
              <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ContentIcon className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-xl mb-1">{book.title_ar}</p>
                  <p className="text-muted-foreground text-sm">{authorName}</p>
                </div>
                <audio
                  controls
                  className="w-full max-w-lg mx-auto"
                  src={book.audio_url}
                  preload="metadata"
                >
                  متصفحك لا يدعم تشغيل الصوت
                </audio>
                <p className="text-xs text-muted-foreground">
                  {book.content_type === "quran_audio"
                    ? "سورة الفاتحة — نموذج من التلاوة"
                    : "استمع إلى الأنشودة كاملة"}
                </p>
              </div>
            )}

            {/* Back Link */}
            <div className="pt-6 border-t border-border">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
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
