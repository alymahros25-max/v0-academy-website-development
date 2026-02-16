"use client"

import { useI18n } from "@/lib/i18n"
import { Award, BookOpen, Star, Users } from "lucide-react"

const teachers = [
  {
    name: { ar: "الشيخ أحمد محمد", en: "Sheikh Ahmed Mohamed", fr: "Cheikh Ahmed Mohamed" },
    role: { ar: "معلم قرآن كريم وتجويد", en: "Quran & Tajweed Teacher", fr: "Enseignant Coran & Tajweed" },
    bio: { ar: "حاصل على إجازة في القراءات العشر، خبرة 10 سنوات في تعليم القرآن الكريم", en: "Holds Ijazah in the ten Qira'at, 10 years experience in Quran teaching", fr: "Titulaire d'Ijazah en dix Qira'at, 10 ans d'experience" },
    specialization: { ar: "القراءات العشر", en: "Ten Qira'at", fr: "Dix Qira'at" },
  },
  {
    name: { ar: "الأستاذة فاطمة علي", en: "Ustadha Fatima Ali", fr: "Ustadha Fatima Ali" },
    role: { ar: "معلمة قرآن كريم", en: "Quran Teacher", fr: "Enseignante de Coran" },
    bio: { ar: "مجازة بسند متصل في حفص عن عاصم، متخصصة في تعليم الأطفال", en: "Certified with connected chain in Hafs from Asim, specialized in teaching children", fr: "Certifiee avec chaine connectee en Hafs, specialisee dans l'enseignement des enfants" },
    specialization: { ar: "تحفيظ الأطفال", en: "Children's Memorization", fr: "Memorisation des enfants" },
  },
  {
    name: { ar: "الأستاذ عمر حسن", en: "Ustadh Omar Hassan", fr: "Ustadh Omar Hassan" },
    role: { ar: "معلم لغة عربية", en: "Arabic Language Teacher", fr: "Enseignant de langue arabe" },
    bio: { ar: "متخصص في تأسيس اللغة العربية للناطقين بغيرها، خبرة 8 سنوات", en: "Specialized in Arabic foundation for non-native speakers, 8 years experience", fr: "Specialise dans les bases de l'arabe pour non-natifs, 8 ans d'experience" },
    specialization: { ar: "تأسيس العربي", en: "Arabic Foundation", fr: "Fondation arabe" },
  },
  {
    name: { ar: "الأستاذة مريم إبراهيم", en: "Ustadha Maryam Ibrahim", fr: "Ustadha Maryam Ibrahim" },
    role: { ar: "معلمة قرآن وعربي", en: "Quran & Arabic Teacher", fr: "Enseignante Coran & Arabe" },
    bio: { ar: "حاصلة على إجازة في التجويد والقراءة، تجيد تعليم الأطفال والمبتدئين", en: "Certified in Tajweed and recitation, excels at teaching children and beginners", fr: "Certifiee en Tajweed et recitation, excellente avec les enfants et debutants" },
    specialization: { ar: "التجويد والتأسيس", en: "Tajweed & Foundation", fr: "Tajweed & Fondation" },
  },
  {
    name: { ar: "الشيخ يوسف عبدالله", en: "Sheikh Yusuf Abdullah", fr: "Cheikh Yusuf Abdullah" },
    role: { ar: "معلم قرآن وتفسير", en: "Quran & Tafseer Teacher", fr: "Enseignant Coran & Tafsir" },
    bio: { ar: "متخصص في تفسير القرآن الكريم والسيرة النبوية، خبرة 12 سنة", en: "Specialized in Quran interpretation and Prophetic biography, 12 years experience", fr: "Specialise en interpretation du Coran et biographie prophetique, 12 ans" },
    specialization: { ar: "التفسير", en: "Tafseer", fr: "Tafsir" },
  },
  {
    name: { ar: "الأستاذة نور محمود", en: "Ustadha Noor Mahmoud", fr: "Ustadha Noor Mahmoud" },
    role: { ar: "معلمة لغة عربية", en: "Arabic Language Teacher", fr: "Enseignante de langue arabe" },
    bio: { ar: "متخصصة في تعليم القراءة والكتابة للأطفال بطرق حديثة ومبتكرة", en: "Specialized in teaching reading and writing for children with modern methods", fr: "Specialisee dans l'enseignement de la lecture et l'ecriture avec des methodes modernes" },
    specialization: { ar: "القراءة والكتابة", en: "Reading & Writing", fr: "Lecture & Ecriture" },
  },
]

const colors = [
  "bg-primary/10 text-primary",
  "bg-secondary/20 text-secondary-foreground",
  "bg-primary/15 text-primary",
  "bg-secondary/15 text-secondary-foreground",
  "bg-primary/10 text-primary",
  "bg-secondary/20 text-secondary-foreground",
]

export default function TeachersPage() {
  const { t, locale } = useI18n()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
            {t("nav.teachers")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
            {t("teachers.title")}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-pretty">
            {t("teachers.desc")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teachers.map((teacher, idx) => (
              <div
                key={idx}
                className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-2xl ${colors[idx]} flex items-center justify-center text-2xl font-bold`}>
                    {teacher.name[locale].charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{teacher.name[locale]}</h3>
                    <p className="text-sm text-primary font-medium">{teacher.role[locale]}</p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {teacher.bio[locale]}
                </p>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {teacher.specialization[locale]}
                  </span>
                  <div className="flex items-center gap-0.5 ms-auto">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-4">
            {locale === "ar" ? "هل أنت معلم/ة وتريد الانضمام لفريقنا؟" : locale === "en" ? "Are you a teacher wanting to join our team?" : "Etes-vous un enseignant souhaitant rejoindre notre equipe?"}
          </h2>
          <p className="text-primary-foreground/70 mb-8">
            {locale === "ar" ? "نرحب بالمعلمين المجازين ذوي الخبرة. تواصل معنا الآن" : locale === "en" ? "We welcome certified experienced teachers. Contact us now" : "Nous accueillons les enseignants certifies experimentes"}
          </p>
          <a
            href="mailto:enamel311@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold transition-all hover:brightness-110 hover:shadow-xl"
          >
            {locale === "ar" ? "تواصل معنا" : locale === "en" ? "Contact Us" : "Contactez-nous"}
          </a>
        </div>
      </section>
    </>
  )
}
