'use client'

import { useState, useMemo } from 'react'
import { useLocale } from '@/hooks/use-locale'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { BookOpen, Headphones, Music, Award } from 'lucide-react'
import { LibraryCard } from '@/components/library/LibraryCard'
import { PDFViewerModal } from '@/components/library/PDFViewerModal'
import { AudioPlayer } from '@/components/library/AudioPlayer'
import { LibraryItem, organizeBySection } from '@/lib/library-utils'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function EnhancedLibraryPage() {
  const { locale, t } = useLocale()
  const isRTL = locale === 'ar'

  // State for modals
  const [selectedPdf, setSelectedPdf] = useState<LibraryItem | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<LibraryItem | null>(null)

  // Fetch library items
  const { data: allItems = [], isLoading } = useSWR(
    '/api/cms/digital-library?published=true',
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  )

  // Filter by content type
  const sections = useMemo(() => organizeBySection(allItems), [allItems])

  const books = sections['book'] || []
  const quranAudio = sections['quran_audio'] || []
  const nasheeds = sections['nasheed'] || []
  const tajweed = sections['tajweed'] || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 max-w-6xl text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {locale === 'ar' ? 'المكتبة الرقمية' : 'Digital Library'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'مكتبة شاملة تتضمن الكتب الإسلامية، تلاوات قرآنية بأصوات الشيوخ المشهورين، أناشيد دينية، ومتون تجويدية'
              : 'A comprehensive library featuring Islamic books, Quranic recitations, religious nasheeds, and tajweed texts'}
          </p>
        </motion.div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 max-w-6xl py-20">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      )}

      {!isLoading && allItems.length === 0 && (
        <div className="container mx-auto px-4 max-w-6xl py-20 text-center">
          <p className="text-muted-foreground">{locale === 'ar' ? 'لا توجد محتويات متاحة' : 'No content available'}</p>
        </div>
      )}

      {/* Books Section */}
      {books.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 max-w-6xl py-16"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {locale === 'ar' ? 'الكتب الإسلامية' : 'Islamic Books'}
              </h2>
            </div>
            <p className="text-muted-foreground">{locale === 'ar' ? 'مجموعة من الكتب الإسلامية المهمة' : 'A collection of important Islamic books'}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {books.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <LibraryCard
                  item={item}
                  locale={locale}
                  onRead={setSelectedPdf}
                  isRTL={isRTL}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Quran Audio Section */}
      {quranAudio.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 max-w-6xl py-16"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {locale === 'ar' ? 'تلاوات قرآنية' : 'Quranic Recitations'}
              </h2>
            </div>
            <p className="text-muted-foreground">{locale === 'ar' ? 'تلاوات من أعظم القراء والشيوخ' : 'Recitations by the greatest Qaris'}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {quranAudio.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <LibraryCard
                  item={item}
                  locale={locale}
                  onListen={setSelectedAudio}
                  isRTL={isRTL}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Nasheeds Section */}
      {nasheeds.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 max-w-6xl py-16"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {locale === 'ar' ? 'الأناشيد الدينية' : 'Islamic Nasheeds'}
              </h2>
            </div>
            <p className="text-muted-foreground">{locale === 'ar' ? 'أناشيد دينية بدون موسيقى' : 'Religious nasheeds without music'}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {nasheeds.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <LibraryCard
                  item={item}
                  locale={locale}
                  onListen={setSelectedAudio}
                  isRTL={isRTL}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Tajweed Section */}
      {tajweed.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 max-w-6xl py-16"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-700" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {locale === 'ar' ? 'متون التجويد' : 'Tajweed Texts'}
              </h2>
            </div>
            <p className="text-muted-foreground">{locale === 'ar' ? 'متون تجويدية للحفظ والتعلم' : 'Tajweed texts for memorization'}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {tajweed.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <LibraryCard
                  item={item}
                  locale={locale}
                  onRead={setSelectedPdf}
                  onListen={setSelectedAudio}
                  isRTL={isRTL}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={!!selectedPdf}
        pdfUrl={selectedPdf?.pdf_url}
        title={selectedPdf?.title_ar || ''}
        author={selectedPdf?.author_ar}
        onClose={() => setSelectedPdf(null)}
      />

      {/* Audio Player Modal */}
      {selectedAudio && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 left-4 md:bottom-8 md:right-8 md:left-auto md:w-96 z-40"
        >
          <AudioPlayer
            audioUrl={selectedAudio.audio_url}
            title={selectedAudio.title_ar}
            artist={selectedAudio.qari_name_ar || selectedAudio.nasheed_artist_ar}
            duration={selectedAudio.duration_seconds}
            autoPlay
          />
        </motion.div>
      )}
    </div>
  )
}
