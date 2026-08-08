"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { BookOpen, ExternalLink, Search, Tag } from "lucide-react"
import { drivePreviewUrl, localizedValue, type LibraryDocument, type LibraryLocale } from "@/lib/library-types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function LibraryPage() {
  const [locale, setLocale] = useState<LibraryLocale>("ar")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<LibraryDocument | null>(null)
  const { data, isLoading } = useSWR<{ data: LibraryDocument[] }>("/api/library", fetcher)
  const books = useMemo(() => (data?.data ?? []).filter((book) => {
    const haystack = [book.title_ar, book.title_en, book.title_fr, book.description_ar, book.category, ...book.tags].join(" ").toLowerCase()
    return haystack.includes(search.toLowerCase())
  }), [data, search])

  return <main dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-background">
    <section className="islamic-pattern border-b border-border px-6 py-16"><div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><BookOpen /></span><span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">Digital Archive</span></div><div className="flex rounded-lg border border-border bg-card p-1" aria-label="Language"><button onClick={() => setLocale("ar")} className={`px-3 py-1 text-sm ${locale === "ar" ? "rounded bg-primary text-primary-foreground" : "text-muted-foreground"}`}>العربية</button><button onClick={() => setLocale("en")} className={`px-3 py-1 text-sm ${locale === "en" ? "rounded bg-primary text-primary-foreground" : "text-muted-foreground"}`}>EN</button><button onClick={() => setLocale("fr")} className={`px-3 py-1 text-sm ${locale === "fr" ? "rounded bg-primary text-primary-foreground" : "text-muted-foreground"}`}>FR</button></div></div>
      <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">{locale === "ar" ? "مكتبة الحافظ المتميز" : locale === "en" ? "The Hafez Library" : "La bibliothèque Al-Hafez"}</h1><p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{locale === "ar" ? "كتب وموارد تعليمية محفوظة بروابط Google Drive، مع معاينة مباشرة للملفات." : "A curated collection of educational documents with direct Google Drive previews."}</p>
      <label className="flex max-w-xl items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"><Search className="h-5 w-5 text-muted-foreground" /><span className="sr-only">Search</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={locale === "ar" ? "ابحث في الكتب والوسوم..." : "Search books and tags..."} className="w-full bg-transparent outline-none" /></label>
    </div></section>
    <section className="mx-auto max-w-6xl px-6 py-10">{isLoading ? <p className="text-muted-foreground">جاري تحميل المكتبة...</p> : books.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-12 text-center"><BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" /><p className="text-lg font-semibold">لا توجد كتب منشورة بعد</p><p className="mt-2 text-muted-foreground">ستظهر الكتب هنا بعد إضافتها ونشرها من لوحة التحكم.</p></div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{books.map((book) => <article key={book.id} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-primary"><BookOpen /></div><span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{book.category}</span></div><div><h2 className="text-xl font-bold">{localizedValue(book, "title", locale)}</h2>{book.surahs_ar && <p className="mt-2 text-sm font-medium leading-6 text-primary"><span className="text-muted-foreground">السور: </span>{book.surahs_ar}</p>}<p className="mt-2 line-clamp-3 leading-7 text-muted-foreground">{localizedValue(book, "description", locale)}</p></div><div className="flex flex-wrap gap-2">{book.tags.map((tag) => <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground"><Tag className="h-3 w-3" />{tag}</span>)}</div><button onClick={() => setSelected(book)} className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">معاينة المستند <ExternalLink className="h-4 w-4" /></button></article>)}</div>}</section>
    {selected && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4" onClick={() => setSelected(null)}><div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-card" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="font-bold">{localizedValue(selected, "title", locale)}</h2><button onClick={() => setSelected(null)} className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted">إغلاق</button></div><iframe title={localizedValue(selected, "title", locale)} src={drivePreviewUrl(selected.drive_url, selected.file_type)} className="min-h-0 flex-1" allow="autoplay" /></div></div>}
  </main>
}
