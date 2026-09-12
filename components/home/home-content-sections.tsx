"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Languages } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { generateFAQSchema } from "@/lib/schema-markup"

const content = {
  ar: {
    programsLabel: "برامج تعليمية واضحة",
    programsTitle: "اختر البرنامج المناسب لهدفك",
    programsIntro: "مساران أساسيان يساعدان الطالب على البدء من مستواه والتقدم بخطوات عملية.",
    programs: [
      ["القرآن الكريم والتجويد", "تعلّم التلاوة الصحيحة، وحفظ القرآن ومراجعته، وتطبيق أحكام التجويد تدريجيًا وفق مستوى الطالب ووقته.", "/quran", "تفاصيل برنامج القرآن الكريم والتجويد"],
      ["تأسيس اللغة العربية", "تأسيس الأطفال والمبتدئين في الحروف والحركات، ثم القراءة والكتابة والإملاء والتعبير بطريقة مبسطة تناسب العمر والمستوى.", "/arabic", "تفاصيل برنامج تأسيس اللغة العربية"],
    ],
    benefitsLabel: "تعلم يناسب احتياجك",
    benefitsTitle: "لماذا تبدأ معنا؟",
    benefits: [
      ["خطة تناسب مستوى الطالب", "تبدأ الدراسة بفهم المستوى والهدف، ثم تُبنى الأولويات وفق احتياج الطالب."],
      ["حصص فردية أونلاين", "وقت مباشر للتدريب والتصحيح والتكرار وطرح الأسئلة دون محتوى عام لا يناسب المستوى."],
      ["مواعيد تراعي اختلاف الدول", "يمكن مناقشة الموعد المناسب مع مراعاة اختلاف المناطق الزمنية وجدول الأسرة."],
      ["متابعة تساعد على الاستمرار", "تساعد المراجعة المنتظمة وملاحظة الصعوبات على معرفة ما تم إنجازه وما يحتاج إلى تدريب."],
    ],
    startLabel: "بداية واضحة",
    startTitle: "كيف تبدأ؟",
    steps: [
      ["احجز الحصة التجريبية", "أخبرنا بالبرنامج المطلوب، ومستوى الطالب التقريبي، والوقت المناسب."],
      ["تعرّف على مستوى الطالب", "يراجع المعلم مهارات الطالب وهدفه والجوانب التي تحتاج إلى تطوير."],
      ["ابدأ خطتك التعليمية", "بعد مناقشة الاحتياج، اختر البرنامج والموعد المناسب وابدأ المتابعة."],
    ],
    faqLabel: "إجابات قبل البدء",
    faqTitle: "أسئلة شائعة",
    faqs: [
      ["هل الدروس مناسبة للمبتدئين؟", "نعم. يمكن للمبتدئ أن يبدأ من الأساسيات، كما يمكن للطالب المتقدم التركيز على الحفظ أو المراجعة أو تحسين التلاوة."],
      ["هل الدروس مناسبة للأطفال والكبار؟", "يمكن تكييف طريقة الشرح والتدريب بحسب عمر الطالب ومستواه وهدفه التعليمي."],
      ["ماذا يحدث في الحصة التجريبية؟", "يتعرف المعلم على هدف الطالب ومستواه، ويراجع الجوانب التي تحتاج إلى تدريب، ثم يناقش طريقة البدء."],
      ["هل الحصص فردية أم جماعية؟", "البرامج المعروضة تعتمد على الحصص الفردية حتى يحصل الطالب على توجيه مباشر ووقت مناسب للتدريب."],
    ],
    allFaq: "عرض جميع الأسئلة الشائعة",
  },
  en: {
    programsLabel: "Clear learning programs",
    programsTitle: "Choose the program for your goal",
    programsIntro: "Two core programs help learners start from their level and progress through practical steps.",
    programs: [
      ["Quran and Tajweed", "Learn correct recitation, memorization, revision, and Tajweed gradually according to the learner’s level and schedule.", "/quran", "Explore the Quran program"],
      ["Arabic Foundation", "Build a foundation in letters, vowels, reading, writing, spelling, and expression through age-appropriate lessons.", "/arabic", "Explore the Arabic program"],
    ],
    benefitsLabel: "Learning around the learner",
    benefitsTitle: "Why start with us?",
    benefits: [
      ["A plan for the learner’s level", "Start with the learner’s level and goal, then set priorities around their needs."],
      ["One-to-one online lessons", "Get direct time for practice, correction, repetition, and questions."],
      ["Schedules across time zones", "Discuss a suitable lesson time while considering the family’s schedule and location."],
      ["Consistent follow-up", "Regular review helps identify progress and the skills that need more practice."],
    ],
    startLabel: "A clear beginning",
    startTitle: "How do you start?",
    steps: [
      ["Book a trial lesson", "Tell us the program, the learner’s level, and a suitable time."],
      ["Understand the learner’s level", "The teacher reviews the learner’s skills, goal, and development needs."],
      ["Start the learning plan", "Discuss the needs, choose a program and schedule, and begin regular lessons."],
    ],
    faqLabel: "Answers before you begin",
    faqTitle: "Frequently asked questions",
    faqs: [
      ["Are lessons suitable for beginners?", "Yes. Beginners can start with the basics, while advanced learners can focus on memorization, revision, or recitation."],
      ["Are lessons suitable for children and adults?", "Lessons can be adapted to the learner’s age, level, and educational goal."],
      ["What happens in a trial lesson?", "The teacher reviews the learner’s goal and level, identifies practice needs, and discusses how to begin."],
      ["Are lessons one-to-one or group-based?", "The listed programs use one-to-one lessons for direct guidance and practice time."],
    ],
    allFaq: "View all frequently asked questions",
  },
} as const

export function HomeContentSections() {
  const { locale, dir } = useI18n()
  const isArabic = locale === "ar"
  const copy = content[isArabic ? "ar" : "en"]
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight
  const faqSchema = generateFAQSchema(copy.faqs.map(([question, answer]) => ({ question, answer })))

  return (
    <>
      <section className="content-auto bg-background px-4 py-16 lg:py-24" aria-labelledby="home-programs-title">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">{copy.programsLabel}</p>
            <h2 id="home-programs-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">{copy.programsTitle}</h2>
            <p className="mt-4 text-pretty text-lg leading-8 text-muted-foreground">{copy.programsIntro}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {copy.programs.map(([title, description, href, link]) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg lg:p-9">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gold-pale text-navy-primary">
                  {title.includes("عربي") || title.includes("Arabic") ? <Languages className="size-7" aria-hidden="true" /> : <BookOpen className="size-7" aria-hidden="true" />}
                </div>
                <h3 className="mt-6 text-2xl font-extrabold text-navy-primary">{title}</h3>
                <p className="mt-4 leading-8 text-muted-foreground">{description}</p>
                <Link href={href} className="mt-6 inline-flex items-center gap-2 font-bold text-navy-primary hover:underline" aria-label={link}>
                  {link}
                  <Arrow className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto bg-navy-pale/25 px-4 py-16 lg:py-24" aria-labelledby="home-benefits-title">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">{copy.benefitsLabel}</p>
            <h2 id="home-benefits-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">{copy.benefitsTitle}</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.benefits.map(([title, description]) => (
              <article key={title} className="rounded-3xl border border-navy-light/30 bg-card p-6 shadow-sm">
                <CheckCircle2 className="size-7 text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-extrabold text-navy-primary">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto bg-background px-4 py-16 lg:py-24" aria-labelledby="home-start-title">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">{copy.startLabel}</p>
            <h2 id="home-start-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">{copy.startTitle}</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {copy.steps.map(([title, description], index) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-7 text-center shadow-sm">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">{index + 1}</div>
                <h3 className="mt-5 text-xl font-extrabold text-navy-primary">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto bg-muted/30 px-4 py-16 lg:py-24" aria-labelledby="home-faq-title">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="saudi-eyebrow justify-center">{copy.faqLabel}</p>
            <h2 id="home-faq-title" className="mt-3 text-3xl font-extrabold text-navy-primary md:text-4xl">{copy.faqTitle}</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {copy.faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-border bg-card p-5 shadow-sm">
                <summary className="cursor-pointer list-none pe-6 font-extrabold text-navy-primary marker:hidden [&::-webkit-details-marker]:hidden">{question}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="inline-flex items-center gap-2 font-bold text-navy-primary hover:underline">
              {copy.allFaq}
              <Arrow className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
