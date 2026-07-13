"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LibraryCard } from "./LibraryCard"
import { PDFViewer } from "./PDFViewer"
import { AudioPlayer } from "./AudioPlayer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Headphones, Music, Zap, Loader2 } from "lucide-react"

interface LibraryItem {
  id: string
  slug: string
  title_ar: string
  title_en: string
  description_ar: string
  author_ar: string
  content_type: "book" | "quran_audio" | "nasheed" | "tajweed"
  pdf_url: string | null
  audio_url: string | null
  thumbnail_url: string | null
  category: string | null
  qari_name_ar: string | null
  lyrics_ar: string | null
  is_featured: boolean
  is_published: boolean
}

export default function LibraryContent() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedPDF, setSelectedPDF] = useState<{ isOpen: boolean; url?: string; title?: string }>({
    isOpen: false,
  })
  const [activeAudio, setActiveAudio] = useState<{ url: string; title: string; artist?: string; lyrics?: string } | null>(null)

  useEffect(() => {
    async function fetchLibrary() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/cms/digital-library?published=true")
        if (!res.ok) throw new Error("فشل تحميل المكتبة")
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (err: any) {
        setError(err?.message || "حدث خطأ غير متوقع")
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchLibrary()
  }, [])

  const books = items.filter((i) => i.content_type === "book")
  const quranAudio = items.filter((i) => i.content_type === "quran_audio")
  const nasheeds = items.filter((i) => i.content_type === "nasheed")
  const tajweed = items.filter((i) => i.content_type === "tajweed")

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">جاري تحميل المكتبة...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">الكتب</span>
            {books.length > 0 && (
              <span className="bg-primary/20 text-primary text-xs px-1.5 rounded-full hidden sm:inline">
                {books.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="quran" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline">القرآن</span>
            {quranAudio.length > 0 && (
              <span className="bg-primary/20 text-primary text-xs px-1.5 rounded-full hidden sm:inline">
                {quranAudio.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="nasheeds" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">الأناشيد</span>
            {nasheeds.length > 0 && (
              <span className="bg-primary/20 text-primary text-xs px-1.5 rounded-full hidden sm:inline">
                {nasheeds.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tajweed" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">التجويد</span>
            {tajweed.length > 0 && (
              <span className="bg-primary/20 text-primary text-xs px-1.5 rounded-full hidden sm:inline">
                {tajweed.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Books Section */}
        <TabsContent value="books" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">الكتب الإسلامية والتعليمية</h2>
            <p className="text-muted-foreground">مجموعة متنوعة من الكتب الموثوقة والمضمونة</p>
          </div>
          {books.length === 0 ? (
            <EmptyState message="لم تُضَف كتب حتى الآن" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <LibraryCard
                  key={book.id}
                  id={book.id}
                  title={book.title_ar}
                  description={book.description_ar}
                  author={book.author_ar}
                  contentType={book.content_type}
                  category={book.category || ""}
                  thumbnail={book.thumbnail_url || undefined}
                  isFeatured={book.is_featured}
                  onRead={
                    book.pdf_url
                      ? () => setSelectedPDF({ isOpen: true, url: book.pdf_url!, title: book.title_ar })
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Quran Audio Section */}
        <TabsContent value="quran" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">تلاوات قرآنية مميزة</h2>
            <p className="text-muted-foreground">استمع إلى تلاوات الشيوخ الأفاضل المشهورين</p>
          </div>
          {quranAudio.length === 0 ? (
            <EmptyState message="لم تُضَف تلاوات قرآنية حتى الآن" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quranAudio.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    {item.thumbnail_url && (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title_ar}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-1 text-sm">{item.title_ar}</h3>
                      {item.qari_name_ar && (
                        <p className="text-xs text-muted-foreground mb-3">{item.qari_name_ar}</p>
                      )}
                      {item.audio_url ? (
                        <audio
                          controls
                          className="w-full"
                          style={{ height: "36px" }}
                          preload="none"
                        >
                          <source src={item.audio_url} type="audio/mpeg" />
                          متصفحك لا يدعم تشغيل الصوت
                        </audio>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">لا يوجد ملف صوتي</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Nasheeds Section */}
        <TabsContent value="nasheeds" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">الأناشيد الدينية والتربوية</h2>
            <p className="text-muted-foreground">أناشيد هادفة مع كلمات واضحة</p>
          </div>
          {nasheeds.length === 0 ? (
            <EmptyState message="لم تُضَف أناشيد حتى الآن" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nasheeds.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    {item.thumbnail_url && (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title_ar}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-1 text-sm">{item.title_ar}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{item.author_ar}</p>
                      {item.audio_url ? (
                        <audio
                          controls
                          className="w-full"
                          style={{ height: "36px" }}
                          preload="none"
                        >
                          <source src={item.audio_url} type="audio/mpeg" />
                          متصفحك لا يدعم تشغيل الصوت
                        </audio>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">لا يوجد ملف صوتي</p>
                      )}
                      {item.lyrics_ar && (
                        <details className="mt-3">
                          <summary className="text-xs text-primary cursor-pointer">الكلمات</summary>
                          <p className="text-xs text-muted-foreground mt-2 whitespace-pre-line leading-relaxed">
                            {item.lyrics_ar}
                          </p>
                        </details>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tajweed Section */}
        <TabsContent value="tajweed" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">متون التجويد وشروحاتها</h2>
            <p className="text-muted-foreground">اقرأ وادرس متون التجويد</p>
          </div>
          {tajweed.length === 0 ? (
            <EmptyState message="لم تُضَف مواد تجويد حتى الآن" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tajweed.map((item) => (
                <LibraryCard
                  key={item.id}
                  id={item.id}
                  title={item.title_ar}
                  description={item.description_ar}
                  author={item.author_ar}
                  contentType={item.content_type}
                  category={item.category || ""}
                  thumbnail={item.thumbnail_url || undefined}
                  isFeatured={item.is_featured}
                  onRead={
                    item.pdf_url
                      ? () => setSelectedPDF({ isOpen: true, url: item.pdf_url!, title: item.title_ar })
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={selectedPDF.isOpen}
        onClose={() => setSelectedPDF({ isOpen: false })}
        pdfUrl={selectedPDF.url || ""}
        title={selectedPDF.title || ""}
      />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p>{message}</p>
    </div>
  )
}
