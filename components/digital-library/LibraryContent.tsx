"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LibraryCard } from "./LibraryCard"
import { PDFViewer } from "./PDFViewer"
import { AudioPlayer } from "./AudioPlayer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Headphones, Music, Zap } from "lucide-react"

// Sample data - will be replaced with API calls
const libraryData = {
  books: [
    {
      id: "book1",
      title: "القاعدة النورانية",
      description: "أساس تعلم القراءة الصحيحة للقرآن الكريم",
      author: "محمد حقاني",
      contentType: "book" as const,
      category: "أساسيات",
      pdfUrl: "https://example.com/qaida.pdf",
      thumbnail: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=500",
      isFeatured: true,
    },
    {
      id: "book2",
      title: "تحفة الأطفال في التجويد",
      description: "متن تجويد بسيط وسهل للأطفال",
      author: "سليمان الجمزوري",
      contentType: "book" as const,
      category: "التجويد",
      pdfUrl: "https://example.com/tuhfa.pdf",
      thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500",
      isFeatured: true,
    },
  ],
  quranAudio: [
    {
      id: "quran1",
      title: "الشيخ محمود خليل الحصري",
      description: "تلاوة مجودة للقرآن الكريم",
      author: "الشيخ الحصري",
      contentType: "quran_audio" as const,
      category: "التلاوات",
      audioUrl: "https://example.com/husari.m4a",
      qariName: "محمود خليل الحصري",
      isFeatured: true,
    },
    {
      id: "quran2",
      title: "الشيخ محمد صديق المنشاوي",
      description: "تلاوة برتقالية بصوت عذب",
      author: "الشيخ المنشاوي",
      contentType: "quran_audio" as const,
      category: "التلاوات",
      audioUrl: "https://example.com/minshawi.m4a",
      qariName: "محمد صديق المنشاوي",
      isFeatured: true,
    },
    {
      id: "quran3",
      title: "الشيخ عبد الباسط عبد الصمد",
      description: "التلاوة الشهيرة بصوت القارئ الأول",
      author: "الشيخ عبد الباسط",
      contentType: "quran_audio" as const,
      category: "التلاوات",
      audioUrl: "https://example.com/abdulbasit.m4a",
      qariName: "عبد الباسط عبد الصمد",
    },
    {
      id: "quran4",
      title: "الشيخ عيسى البنا",
      description: "تلاوة مجودة وسهلة الحفظ",
      author: "الشيخ البنا",
      contentType: "quran_audio" as const,
      category: "التلاوات",
      audioUrl: "https://example.com/alanna.m4a",
      qariName: "عيسى البنا",
    },
  ],
  nasheeds: [
    {
      id: "nasheed1",
      title: "قم للمعلم وفِّهِ التبجيلا",
      description: "أنشودة تربوية عن احترام المعلم",
      author: "أنشودة تراثية",
      contentType: "nasheed" as const,
      category: "أناشيد تربوية",
      audioUrl: "https://example.com/muallim.m4a",
      lyrics: "قم للمعلم وفِّهِ التبجيلا\nكاد المعلم أن يكون رسولا",
      isFeatured: true,
    },
    {
      id: "nasheed2",
      title: "نشيد الوطن الإسلامي",
      description: "أنشودة دينية وطنية",
      author: "فريق الأكاديمية",
      contentType: "nasheed" as const,
      category: "أناشيد وطنية",
      audioUrl: "https://example.com/watan.m4a",
      lyrics: "يا أمتنا يا أمة الإسلام\nحافظي على دينك والقيم",
    },
    {
      id: "nasheed3",
      title: "أنا مسلم",
      description: "أنشودة إسلامية هادفة",
      author: "فريق الأكاديمية",
      contentType: "nasheed" as const,
      category: "أناشيد دينية",
      audioUrl: "https://example.com/anamoslim.m4a",
      lyrics: "أنا مسلم بدين محمد\nأحمل لواء التوحيد الأبد",
    },
  ],
  tajweed: [
    {
      id: "tajweed1",
      title: "متن الجزرية",
      description: "أشهر متن في علم التجويد",
      author: "ابن الجزري",
      contentType: "tajweed" as const,
      category: "متون التجويد",
      pdfUrl: "https://example.com/jazariyya.pdf",
      audioUrl: "https://example.com/jazariyya.m4a",
      tajweedLevel: "intermediate",
      isFeatured: true,
    },
    {
      id: "tajweed2",
      title: "شرح متن الجزرية",
      description: "شرح مبسط ومفصل للجزرية",
      author: "فريق الأكاديمية",
      contentType: "tajweed" as const,
      category: "شروح التجويد",
      audioUrl: "https://example.com/jazariyya-sharh.m4a",
      tajweedLevel: "intermediate",
    },
  ],
}

export default function LibraryContent() {
  const [selectedPDF, setSelectedPDF] = useState<{ isOpen: boolean; url?: string; title?: string }>({
    isOpen: false,
  })
  const [selectedAudio, setSelectedAudio] = useState<{ isOpen: boolean; url?: string; title?: string; artist?: string; lyrics?: string }>(
    { isOpen: false }
  )

  const handleReadBook = (title: string, url: string) => {
    setSelectedPDF({ isOpen: true, url, title })
  }

  const handlePlayAudio = (title: string, url: string, artist?: string, lyrics?: string) => {
    setSelectedAudio({ isOpen: true, url, title, artist, lyrics })
  }

  return (
    <div className="space-y-12">
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">الكتب</span>
          </TabsTrigger>
          <TabsTrigger value="quran" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline">القرآن</span>
          </TabsTrigger>
          <TabsTrigger value="nasheeds" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">الأناشيد</span>
          </TabsTrigger>
          <TabsTrigger value="tajweed" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">التجويد</span>
          </TabsTrigger>
        </TabsList>

        {/* Books Section */}
        <TabsContent value="books" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">الكتب الإسلامية والتعليمية</h2>
            <p className="text-muted-foreground">مجموعة متنوعة من الكتب الموثوقة والمضمونة</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {libraryData.books.map((book) => (
              <LibraryCard
                key={book.id}
                id={book.id}
                title={book.title}
                description={book.description}
                author={book.author}
                contentType={book.contentType}
                category={book.category}
                thumbnail={book.thumbnail}
                isFeatured={book.isFeatured}
                onRead={() => handleReadBook(book.title, book.pdfUrl)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Quran Audio Section */}
        <TabsContent value="quran" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">تلاوات قرآنية مميزة</h2>
            <p className="text-muted-foreground">استمع إلى تلاوات الشيوخ الأفاضل المشهورين</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryData.quranAudio.map((qari) => (
              qari.audioUrl && !qari.audioUrl.startsWith("https://example.com") && (
                <motion.div key={qari.id}>
                  <AudioPlayer
                    audioUrl={qari.audioUrl}
                    title={qari.title}
                    artist={qari.qariName}
                  />
                </motion.div>
              )
            ))}
          </div>
          {!libraryData.quranAudio.some((q) => q.audioUrl && !q.audioUrl.startsWith("https://example.com")) && (
            <div className="text-center py-12 text-muted-foreground">
              <p>لم تتم إضافة تلاوات قرآنية بعد</p>
            </div>
          )}
        </TabsContent>

        {/* Nasheeds Section */}
        <TabsContent value="nasheeds" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">الأناشيد الدينية والتربوية</h2>
            <p className="text-muted-foreground">أناشيد بدون موسيقى مع كلمات هادفة</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryData.nasheeds.map((nasheed) => (
              nasheed.audioUrl && !nasheed.audioUrl.startsWith("https://example.com") && (
                <motion.div key={nasheed.id}>
                  <AudioPlayer
                    audioUrl={nasheed.audioUrl}
                    title={nasheed.title}
                    artist={nasheed.author}
                    lyrics={nasheed.lyrics}
                    isNasheed={true}
                  />
                </motion.div>
              )
            ))}
          </div>
          {!libraryData.nasheeds.some((n) => n.audioUrl && !n.audioUrl.startsWith("https://example.com")) && (
            <div className="text-center py-12 text-muted-foreground">
              <p>لم تتم إضافة أناشيد بعد</p>
            </div>
          )}
        </TabsContent>

        {/* Tajweed Section */}
        <TabsContent value="tajweed" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">متون التجويد وشروحاتها</h2>
            <p className="text-muted-foreground">اقرأ وادرس متون التجويد مع الشرح الصوتي</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {libraryData.tajweed.map((tajweed) => (
              <motion.div key={tajweed.id} whileHover={{ y: -4 }}>
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl border border-border p-6 h-full flex flex-col">
                  <h3 className="font-bold text-foreground mb-2">{tajweed.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{tajweed.description}</p>
                  {tajweed.audioUrl && (
                    <AudioPlayer
                      audioUrl={tajweed.audioUrl}
                      title={tajweed.title}
                      artist={tajweed.author}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={selectedPDF.isOpen}
        onClose={() => setSelectedPDF({ isOpen: false })}
        pdfUrl={selectedPDF.url || ""}
        title={selectedPDF.title || ""}
      />

      {/* Audio Player Modal */}
      {selectedAudio.isOpen && selectedAudio.url && !selectedAudio.url.startsWith("https://example.com") && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md">
          <AudioPlayer
            audioUrl={selectedAudio.url || ""}
            title={selectedAudio.title || ""}
          />
        </div>
      )}
    </div>
  )
}
