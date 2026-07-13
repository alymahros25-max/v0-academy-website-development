"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { BookOpen, Download, Eye, Star, Search, Filter } from "lucide-react"
import { useState, useMemo } from "react"

type Category = "all" | "quran" | "tajweed" | "arabic" | "islamic" | "children"

const books = [
  {
    id: 1,
    title: { ar: "القاعدة النورانية", en: "Al-Qaida An-Noraniyah", fr: "Al-Qaida An-Noraniyah" },
    author: { ar: "محمد حقاني", en: "Muhammad Haqqani", fr: "Muhammad Haqqani" },
    category: "quran" as Category,
    rating: 4.9,
    downloads: 12500,
    color: "from-emerald-600 to-emerald-800",
    icon: "quran",
  },
  {
    id: 2,
    title: { ar: "تحفة الأطفال", en: "Tuhfat Al-Atfal", fr: "Tuhfat Al-Atfal" },
    author: { ar: "سليمان الجمزوري", en: "Sulaiman Al-Jamzuri", fr: "Sulaiman Al-Jamzuri" },
    category: "tajweed" as Category,
    rating: 4.8,
    downloads: 9800,
    color: "from-amber-600 to-amber-800",
    icon: "tajweed",
  },
  {
    id: 3,
    title: { ar: "المعلم الأول - الحروف العربية", en: "First Teacher - Arabic Letters", fr: "Premier enseignant - Lettres arabes" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Equipe de l'academie" },
    category: "arabic" as Category,
    rating: 4.7,
    downloads: 8200,
    color: "from-blue-600 to-blue-800",
    icon: "arabic",
  },
  {
    id: 4,
    title: { ar: "الجزرية في التجويد", en: "Al-Jazariyya in Tajweed", fr: "Al-Jazariyya en Tajweed" },
    author: { ar: "ابن الجزري", en: "Ibn Al-Jazari", fr: "Ibn Al-Jazari" },
    category: "tajweed" as Category,
    rating: 4.9,
    downloads: 15000,
    color: "from-emerald-700 to-teal-800",
    icon: "tajweed",
  },
  {
    id: 5,
    title: { ar: "قصص الأنبياء للأطفال", en: "Stories of Prophets for Children", fr: "Histoires des prophetes pour enfants" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Equipe de l'academie" },
    category: "children" as Category,
    rating: 4.6,
    downloads: 11200,
    color: "from-purple-600 to-purple-800",
    icon: "children",
  },
  {
    id: 6,
    title: { ar: "أحكام التجويد المبسطة", en: "Simplified Tajweed Rules", fr: "Regles de Tajweed simplifiees" },
    author: { ar: "أحمد محمود", en: "Ahmad Mahmoud", fr: "Ahmad Mahmoud" },
    category: "tajweed" as Category,
    rating: 4.8,
    downloads: 7600,
    color: "from-amber-700 to-orange-800",
    icon: "tajweed",
  },
  {
    id: 7,
    title: { ar: "حصن المسلم", en: "Hisn Al-Muslim", fr: "Hisn Al-Muslim" },
    author: { ar: "سعيد القحطاني", en: "Said Al-Qahtani", fr: "Said Al-Qahtani" },
    category: "islamic" as Category,
    rating: 5.0,
    downloads: 25000,
    color: "from-green-700 to-green-900",
    icon: "islamic",
  },
  {
    id: 8,
    title: { ar: "تعلم الإملاء والكتابة", en: "Learn Spelling & Writing", fr: "Apprendre l'orthographe et l'ecriture" },
    author: { ar: "نورة العلي", en: "Noura Al-Ali", fr: "Noura Al-Ali" },
    category: "arabic" as Category,
    rating: 4.5,
    downloads: 6300,
    color: "from-blue-700 to-indigo-800",
    icon: "arabic",
  },
  {
    id: 9,
    title: { ar: "المصحف المعلم للأطفال", en: "Quran Teacher for Kids", fr: "Coran enseignant pour enfants" },
    author: { ar: "عبد الباسط عبد الصمد", en: "Abdul Basit Abdul Samad", fr: "Abdul Basit Abdul Samad" },
    category: "quran" as Category,
    rating: 4.9,
    downloads: 18000,
    color: "from-emerald-800 to-green-900",
    icon: "quran",
  },
  {
    id: 10,
    title: { ar: "أذكار الصباح والمساء", en: "Morning & Evening Adhkar", fr: "Adhkar du matin et du soir" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Equipe de l'academie" },
    category: "islamic" as Category,
    rating: 4.7,
    downloads: 14000,
    color: "from-teal-700 to-emerald-800",
    icon: "islamic",
  },
  {
    id: 11,
    title: { ar: "نور البيان", en: "Noor Al-Bayan", fr: "Noor Al-Bayan" },
    author: { ar: "طارق السعيد", en: "Tarek Al-Said", fr: "Tarek Al-Said" },
    category: "quran" as Category,
    rating: 4.8,
    downloads: 20000,
    color: "from-green-600 to-emerald-700",
    icon: "quran",
  },
  {
    id: 12,
    title: { ar: "الأربعون النووية للأطفال", en: "Nawawi's 40 Hadith for Kids", fr: "40 Hadiths de Nawawi pour enfants" },
    author: { ar: "الإمام النووي", en: "Imam An-Nawawi", fr: "Imam An-Nawawi" },
    category: "children" as Category,
    rating: 4.6,
    downloads: 9500,
    color: "from-violet-600 to-purple-800",
    icon: "children",
  },
]

const categories: { key: Category; label: Record<string, string> }[] = [
  { key: "all", label: { ar: "الكل", en: "All", fr: "Tout" } },
  { key: "quran", label: { ar: "القرآن الكريم", en: "Quran", fr: "Coran" } },
  { key: "tajweed", label: { ar: "التجويد", en: "Tajweed", fr: "Tajweed" } },
  { key: "arabic", label: { ar: "اللغة العربية", en: "Arabic", fr: "Arabe" } },
  { key: "islamic", label: { ar: "كتب إسلامية", en: "Islamic", fr: "Islamique" } },
  { key: "children", label: { ar: "كتب الأطفال", en: "Children", fr: "Enfants" } },
]

export default function LibraryPage() {
  const { t, locale } = useI18n()
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory = activeCategory === "all" || book.category === activeCategory
      const matchesSearch =
        searchQuery === "" ||
        book.title[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author[locale].toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery, locale])

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
                {t("nav.library")}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
                {t("library.title")}
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed text-pretty">
                {t("library.desc")}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/library.jpg"
                  alt="Islamic Library"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "ar" ? "ابحث عن كتاب..." : locale === "en" ? "Search for a book..." : "Rechercher un livre..."}
              className="w-full ps-12 pe-4 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-foreground border border-border hover:bg-primary/10 hover:border-primary/30"
                }`}
              >
                {cat.label[locale]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 pb-20 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {locale === "ar" ? "لا توجد نتائج" : locale === "en" ? "No results found" : "Aucun resultat"}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Book Cover */}
                  <div className={`relative h-48 bg-gradient-to-br ${book.color} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 islamic-pattern opacity-30" />
                    <div className="relative text-center px-6">
                      <BookOpen className="w-10 h-10 text-white/80 mx-auto mb-2" />
                      <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">
                        {book.title[locale]}
                      </h3>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Preview book">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Download book">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1 line-clamp-1 text-sm">
                      {book.title[locale]}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {book.author[locale]}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                        <span className="text-xs font-medium text-foreground">{book.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Download className="w-3 h-3" />
                        <span>{book.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        {t("common.read")}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-secondary/10 text-secondary-foreground text-xs font-bold hover:bg-secondary transition-colors border border-secondary/30">
                        <Download className="w-3.5 h-3.5" />
                        {t("common.download")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
