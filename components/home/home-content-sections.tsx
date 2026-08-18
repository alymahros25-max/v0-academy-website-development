import Link from "next/link"
import { ArrowLeft, BookOpen, GraduationCap, Languages, Users } from "lucide-react"
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll"
import { generateFAQSchema } from "@/lib/schema-markup"

const audiences = [
  { title: "الأطفال", description: "بداية صحيحة ومتابعة هادئة تناسب عمر الطفل ومستواه.", icon: GraduationCap },
  { title: "الفتيات والشباب", description: "برامج مرنة للحفظ والمراجعة وتحسين التلاوة.", icon: BookOpen },
  { title: "النساء والرجال", description: "تعلم يناسب الوقت والهدف، من المبتدئ إلى المتقدم.", icon: Users },
  { title: "المبتدئون", description: "خطوات واضحة لبناء أساس قوي في القرآن أو العربية.", icon: Languages },
  { title: "متابعة الحفظ والمراجعة", description: "حصص تساعدك على تثبيت الحفظ وتصحيح التلاوة والتجويد.", icon: BookOpen },
  { title: "متعلمو اللغة العربية", description: "تحسين القراءة والكتابة والنطق وفهم أساسيات اللغة.", icon: Languages },
]

const faqs = [
  ["هل الحصص أونلاين أم حضورية؟", "الحصص أونلاين بالكامل، ويمكن حضورها من المنزل عبر الهاتف أو الكمبيوتر."],
  ["هل البرامج للأطفال فقط؟", "لا، البرامج متاحة للأطفال والشباب والفتيات والنساء والرجال، ويتم اختيار المسار حسب عمر الطالب ومستواه واحتياجه."],
  ["هل يمكن البدء من المستوى المبتدئ؟", "نعم، يمكن البدء من المستوى المبتدئ، وتساعدنا الحصة التجريبية على معرفة المستوى واختيار البرنامج المناسب."],
  ["هل يمكن متابعة الحفظ والمراجعة؟", "نعم، يمكن اختيار برنامج يركز على الحفظ الجديد أو المراجعة أو تصحيح التلاوة والتجويد وفق احتياج الطالب."],
  ["هل يمكن اختيار معلم أو معلمة؟", "يمكن طلب معلم أو معلمة، ويتم التنسيق حسب البرنامج والتوفر."],
  ["هل يمكن اختيار وقت الحصة؟", "نعم، أرسل الوقت المناسب لك عبر واتساب، وسنساعدك في تنسيق الموعد."],
  ["كيف أحجز حصة تجريبية؟", "اضغط على «جرب حصة مجانا» وأرسل بيانات الطالب والوقت المناسب، ثم ننسق معك موعد الحصة."],
  ["هل توجد باقات شهرية؟", "نعم، تختلف الباقات حسب البرنامج ومدة الحصة وعدد الحصص، ويمكن معرفة التفاصيل من قسم البرامج والأسعار أو عبر التواصل معنا."],
]

const faqSchema = generateFAQSchema(faqs.map(([question, answer]) => ({ question, answer })))

export function HomeIntroSection() {
  return (
    <section className="bg-card px-4 py-16 lg:py-24" aria-labelledby="home-intro-title">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">تعلم بمرونة</p>
        <h2 id="home-intro-title" className="text-balance text-3xl font-extrabold text-foreground md:text-4xl">تعلم القرآن واللغة العربية أونلاين من أي مكان</h2>
        <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground">نساعد الأطفال والشباب والنساء والرجال على تعلم القرآن الكريم واللغة العربية من خلال حصص أونلاين مرنة تناسب مستوى كل طالب ووقته. ابدأ بحصة تجريبية مجانية، وتعرّف على البرنامج الأنسب لك أو لأحد أفراد أسرتك.</p>
        <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-7 py-3 font-bold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5">جرب حصة مجانا <ArrowLeft className="size-5" aria-hidden="true" /></Link>
      </div>
    </section>
  )
}

export function HomeAudienceSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 lg:py-24" aria-labelledby="home-audience-title">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center"><h2 id="home-audience-title" className="text-balance text-3xl font-extrabold text-foreground md:text-4xl">برامج تناسب مختلف الأعمار والمستويات</h2><p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">سواء كنت تبحث عن بداية صحيحة لطفلك، أو ترغب في متابعة حفظك ومراجعتك، أو تريد تحسين القراءة واللغة العربية، نساعدك على اختيار المسار المناسب. البرامج متاحة للأطفال والفتيات والشباب والنساء والرجال، مع مراعاة عمر الطالب ومستواه وهدفه.</p></div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{audiences.map(({ title, description, icon: Icon }, index) => <RevealOnScroll key={title} delay={index * 60}><article className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"><div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-6" aria-hidden="true" /></div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 leading-7 text-muted-foreground">{description}</p></article></RevealOnScroll>)}</div>
      </div>
    </section>
  )
}

export function HomeHowToStartSection() {
  const steps = ["اختر البرنامج المناسب لك.", "اضغط على «جرب حصة مجانا».", "أرسل بيانات الطالب والوقت المناسب.", "ننسق معك موعد الحصة التجريبية."]
  return <section className="bg-card px-4 py-16 lg:py-24" aria-labelledby="home-start-title"><div className="mx-auto max-w-6xl"><div className="text-center"><h2 id="home-start-title" className="text-3xl font-extrabold text-foreground md:text-4xl">كيف تبدأ؟</h2><p className="mt-4 text-lg text-muted-foreground">أربع خطوات بسيطة للبدء في التعلم.</p></div><div className="mt-12 grid gap-6 md:grid-cols-4">{steps.map((step, index) => <RevealOnScroll key={step} delay={index * 80}><div className="relative text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-primary-foreground">{index + 1}</div><p className="mt-4 leading-7 text-foreground">{step}</p></div></RevealOnScroll>)}</div></div></section>
}

export function HomeFAQSection() {
  return <section className="bg-muted/30 px-4 py-16 lg:py-24" aria-labelledby="home-faq-title"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /><div className="mx-auto max-w-4xl"><div className="text-center"><h2 id="home-faq-title" className="text-3xl font-extrabold text-foreground md:text-4xl">الأسئلة الشائعة</h2><p className="mt-4 text-lg text-muted-foreground">إجابات واضحة حول البرامج والحصص وطريقة البدء.</p></div><div className="mt-10 grid gap-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"><summary className="cursor-pointer list-none font-bold text-foreground marker:hidden [&::-webkit-details-marker]:hidden"><span className="flex items-center justify-between gap-4">{question}<span className="text-2xl font-normal text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span></span></summary><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{answer}</p></details>)}</div></div></section>
}
