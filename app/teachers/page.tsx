'use client'

import { useMemo, useState } from "react"
import { useI18n } from "@/lib/i18n"
import { siteStats } from "@/lib/site-stats"
import { Award, BookOpen, Check, Globe2, MessageCircle, Star } from "lucide-react"
import teachers from "@/data/teachers.json"

type Teacher = (typeof teachers)[number]
type Filter = "all" | "kids" | "male" | "female" | "ijazah"

const filters: { key: Filter; ar: string; en: string }[] = [
  { key: "all", ar: "الكل", en: "All Tutors" },
  { key: "kids", ar: "للأطفال والتأسيس", en: "Kids & Beginners" },
  { key: "male", ar: "معلمين", en: "Male Tutors" },
  { key: "female", ar: "معلمات", en: "Female Tutors" },
  { key: "ijazah", ar: "الإجازات والقراءات", en: "Ijazah & Recitations" },
]

const whatsappUrl = (teacher: Teacher, locale: string) => {
  const name = teacher.name.ar
  const message = locale === "ar"
    ? `السلام عليكم، أرغب في حجز حصة تجريبية مجانية مع ${name}. أبحث عن تعليم القرآن وتأسيس العربي للناطقين بالعربية.`
    : `Hello, I would like to book a free trial class with ${teacher.name.en}. I am looking for Quran and Arabic lessons.`
  return `https://wa.me/201130127894?text=${encodeURIComponent(message)}`
}

function TeacherSchema({ teacher }: { teacher: Teacher }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.name.ar,
    jobTitle: teacher.role.ar,
    description: teacher.bio.ar,
    knowsLanguage: ["ar", ...(teacher.english ? ["en"] : [])],
    areaServed: ["Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Jordan", "United States", "United Kingdom", "Canada", "Europe"],
    hasCredential: teacher.ijazah ? { "@type": "EducationalOccupationalCredential", credentialCategory: teacher.role.ar, recognizedBy: { "@type": "Organization", name: "أكاديمية الحافظ المتميز" } } : undefined,
    worksFor: { "@type": "EducationalOrganization", name: "أكاديمية الحافظ المتميز" },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function TeacherCard({ teacher, index, locale }: { teacher: Teacher; index: number; locale: string }) {
  const isFemale = teacher.gender === "female"
  return (
    <article className={`relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${index % 2 ? "border-primary/20" : "border-border"}`}>
      <TeacherSchema teacher={teacher} />
      <div className={`absolute inset-x-0 top-0 h-1 ${index % 3 === 0 ? "bg-primary" : "bg-[#d4af37]"}`} />
      <div className="mb-5 flex items-start gap-4">
        <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ${isFemale ? "bg-[#d4af37]/15 text-[#9b7b16]" : "bg-primary/10 text-primary"}`}>
          {teacher.name.ar.charAt(teacher.name.ar.indexOf("/") + 2)}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-foreground">{locale === "ar" ? teacher.name.ar : teacher.name.en}</h2>
          <p className="mt-1 text-sm font-medium text-primary">{locale === "ar" ? teacher.role.ar : teacher.role.en}</p>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><Award className="size-3" />{teacher.ijazah ? "مجاز بالسند المتصل" : "معلم قرآن كريم"}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground"><Globe2 className="size-3" />{teacher.english ? "يتحدث الإنجليزية" : "يفهم لهجة الخليج"}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/15 px-3 py-1 text-xs font-bold text-[#806510]"><Check className="size-3" />يقدم حصة تجريبية مجانية</span>
      </div>
      <p className="min-h-28 text-sm leading-7 text-muted-foreground">{locale === "ar" ? teacher.bio.ar : teacher.bio.en}</p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">الخبرة</p>
          <p className="font-bold text-foreground">+{teacher.experience} سنوات</p>
        </div>
        <div className="text-end">
          <div className="flex items-center gap-1 text-[#d4af37]" aria-label="5 out of 5 stars">{[1,2,3,4,5].map((star) => <Star key={star} className="size-4 fill-current" />)}</div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">5/5 — 10/10 ممتاز</p>
        </div>
      </div>
      <a href={whatsappUrl(teacher, locale)} target="_blank" rel="noreferrer" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
        <MessageCircle className="size-4" />
        {locale === "ar" ? `احجز حصة تجريبية مجانية مع ${teacher.name.ar}` : `Book a free trial with ${teacher.name.en}`}
      </a>
    </article>
  )
}

export default function TeachersPage() {
  const { t, locale } = useI18n()
  const [filter, setFilter] = useState<Filter>("all")
  const filteredTeachers = useMemo(() => teachers.filter((teacher) => filter === "all" || (filter === "kids" && teacher.kids) || (filter === "male" && teacher.gender === "male") || (filter === "female" && teacher.gender === "female") || (filter === "ijazah" && teacher.ijazah)), [filter])
  return (
    <>
      <section className="relative overflow-hidden bg-primary pb-20 pt-32 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-4 py-1.5 text-sm font-bold text-[#f1d978]">{t("nav.teachers")}</span>
          <h1 className="text-balance text-4xl font-extrabold text-primary-foreground md:text-5xl">{t("teachers.title")}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg leading-8 text-primary-foreground/80">معلمون ومعلمات مجازون لخدمة الناطقين بالعربية في الخليج والأردن وأوروبا وأمريكا وكندا</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm font-semibold text-primary-foreground/90"><span>+{siteStats.students} طالب</span><span>•</span><span>{siteStats.teachers} معلمين ومعلمات</span><span>•</span><span>{siteStats.countries} دولة</span></div>
        </div>
      </section>
      <section className="bg-background py-10 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Teacher filters">
            {filters.map((item) => <button key={item.key} type="button" role="tab" aria-selected={filter === item.key} onClick={() => setFilter(item.key)} className={`rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${filter === item.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>{locale === "ar" ? item.ar : item.en}</button>)}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredTeachers.map((teacher, index) => <TeacherCard key={teacher.id} teacher={teacher} index={index} locale={locale} />)}</div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-primary py-16"><div className="absolute inset-0 islamic-pattern opacity-20" /><div className="relative z-10 mx-auto max-w-4xl px-4 text-center"><h2 className="text-3xl font-extrabold text-primary-foreground">{locale === "ar" ? "هل أنت معلم/ة وتريد الانضمام لفريقنا؟" : "Join our certified teaching team"}</h2><a href="mailto:enamel311@gmail.com" className="mt-7 inline-flex rounded-xl bg-[#d4af37] px-8 py-4 font-bold text-[#1f260d] transition hover:brightness-110">{locale === "ar" ? "تواصل معنا" : "Contact us"}</a></div></section>
    </>
  )
}
