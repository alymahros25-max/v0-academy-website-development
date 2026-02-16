"use client"

import { useI18n } from "@/lib/i18n"
import { Star, Quote } from "lucide-react"

const reviews = [
  { name: { ar: "أم محمد", en: "Um Muhammad", fr: "Oum Mohammed" }, country: { ar: "السعودية", en: "Saudi Arabia", fr: "Arabie Saoudite" }, text: { ar: "أكاديمية رائعة! ابني حفظ 5 أجزاء في أقل من سنة بفضل المعلم المتميز والمتابعة المستمرة. أنصح الجميع بها.", en: "Amazing academy! My son memorized 5 Juz in less than a year thanks to the excellent teacher and continuous follow-up. I recommend it to everyone.", fr: "Academie incroyable! Mon fils a memorise 5 Juz en moins d'un an grace a l'excellent enseignant." }, rating: 5 },
  { name: { ar: "أبو أحمد", en: "Abu Ahmed", fr: "Abou Ahmed" }, country: { ar: "ألمانيا", en: "Germany", fr: "Allemagne" }, text: { ar: "نحن في أوروبا كنا نبحث عن أكاديمية موثوقة لتعليم أطفالنا القرآن. وجدنا في أكاديمية الحافظ المتميز كل ما نحتاجه.", en: "Living in Europe, we were looking for a reliable academy to teach our children the Quran. We found everything we need at Al-Hafiz Academy.", fr: "Vivant en Europe, nous cherchions une academie fiable. Nous avons tout trouve ici." }, rating: 5 },
  { name: { ar: "أم سارة", en: "Um Sarah", fr: "Oum Sarah" }, country: { ar: "أمريكا", en: "USA", fr: "Etats-Unis" }, text: { ar: "ابنتي تحسنت كثيراً في القراءة والكتابة العربية بعد الاشتراك في باقة تأسيس العربي. المعلمة صبورة وطريقتها ممتازة.", en: "My daughter improved greatly in Arabic reading and writing after subscribing to the Arabic foundation package.", fr: "Ma fille s'est beaucoup amelioree en lecture et ecriture arabe." }, rating: 5 },
  { name: { ar: "أبو عمر", en: "Abu Omar", fr: "Abou Omar" }, country: { ar: "كندا", en: "Canada", fr: "Canada" }, text: { ar: "الأسعار ممتازة مقارنة بالجودة العالية. المعلمين متميزين والمتابعة مستمرة. أنصح بها بشدة.", en: "Prices are excellent compared to the high quality. Teachers are outstanding and follow-up is continuous.", fr: "Les prix sont excellents par rapport a la qualite. Les enseignants sont remarquables." }, rating: 5 },
  { name: { ar: "أم يوسف", en: "Um Yusuf", fr: "Oum Yousuf" }, country: { ar: "بريطانيا", en: "UK", fr: "Royaume-Uni" }, text: { ar: "ابني يحب حصص القرآن جداً! المعلم يتعامل معه بطريقة رائعة ويشجعه باستمرار. شكراً لكم.", en: "My son loves Quran sessions so much! The teacher deals with him wonderfully and encourages him constantly.", fr: "Mon fils adore les sessions de Coran! L'enseignant est formidable." }, rating: 5 },
  { name: { ar: "أم خديجة", en: "Um Khadija", fr: "Oum Khadija" }, country: { ar: "فرنسا", en: "France", fr: "France" }, text: { ar: "التعليم عن بعد سهل جداً مع الأكاديمية. المعلمة تستخدم وسائل تعليمية ممتازة. بنتي أصبحت تقرأ بطلاقة.", en: "Online learning is very easy with the academy. The teacher uses excellent educational tools. My daughter now reads fluently.", fr: "L'apprentissage en ligne est tres facile. Ma fille lit maintenant couramment." }, rating: 5 },
  { name: { ar: "أبو ياسين", en: "Abu Yasin", fr: "Abou Yassin" }, country: { ar: "تركيا", en: "Turkey", fr: "Turquie" }, text: { ar: "أفضل أكاديمية تعاملت معها. المرونة في المواعيد ممتازة والمعلمين على أعلى مستوى.", en: "Best academy I have dealt with. Schedule flexibility is excellent and teachers are top level.", fr: "La meilleure academie. La flexibilite des horaires est excellente." }, rating: 5 },
  { name: { ar: "أم أمينة", en: "Um Amina", fr: "Oum Amina" }, country: { ar: "ماليزيا", en: "Malaysia", fr: "Malaisie" }, text: { ar: "بنتي كانت لا تعرف الحروف العربية والآن تقرأ القرآن بفضل الله ثم بفضل المعلمة المتميزة.", en: "My daughter didn't know Arabic letters and now reads Quran by the grace of Allah and the excellent teacher.", fr: "Ma fille ne connaissait pas les lettres arabes et maintenant elle lit le Coran." }, rating: 5 },
  { name: { ar: "أبو عبدالرحمن", en: "Abu Abdulrahman", fr: "Abou Abderrahman" }, country: { ar: "مصر", en: "Egypt", fr: "Egypte" }, text: { ar: "تجربة ممتازة! الاشتراك سهل والمعلمين محترفين. ابني يتقدم بشكل ملحوظ كل شهر.", en: "Excellent experience! Subscription is easy and teachers are professional. My son progresses noticeably every month.", fr: "Experience excellente! L'abonnement est facile et les enseignants sont professionnels." }, rating: 5 },
]

export default function ReviewsPage() {
  const { t, locale } = useI18n()

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
            {t("reviews.title")}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-pretty">
            {t("reviews.desc")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all">
                <Quote className="w-8 h-8 text-secondary/40 mb-4" />
                <p className="text-foreground leading-relaxed mb-6 text-sm">{review.text[locale]}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary text-sm">{review.name[locale].charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{review.name[locale]}</p>
                    <p className="text-xs text-muted-foreground">{review.country[locale]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
