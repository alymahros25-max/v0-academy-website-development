import type { Metadata } from "next"
import Link from "next/link"
import { Check, ChevronLeft, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"
import { LandingPageVideoStrip } from "@/components/LandingPageVideoStrip"
import { CountryPagesSection } from "@/components/layout/country-pages-section"
import { canadaLandingConfig, getCanadaWhatsAppUrl, type CanadaPlan, type CanadaProgram } from "@/lib/canada-landing-config"

export const metadata: Metadata = {
  title: canadaLandingConfig.seo.title,
  description: canadaLandingConfig.seo.description,
  alternates: { canonical: canadaLandingConfig.seo.canonical },
  openGraph: { title: canadaLandingConfig.seo.title, description: canadaLandingConfig.seo.description, url: canadaLandingConfig.seo.canonical, locale: "ar_CA", type: "website" },
  twitter: { card: "summary_large_image", title: canadaLandingConfig.seo.title, description: canadaLandingConfig.seo.description },
}

const faq = [
  ["هل تناسب الحصص الأطفال المقيمين في كندا؟", "نعم، الحصص الفردية مناسبة للأطفال والشباب والبالغين، مع مدة ومحتوى يناسبان العمر والمستوى."],
  ["كيف نختار الموعد المناسب مع فرق التوقيت؟", "اذكر المدينة والوقت المفضل عبر واتساب، وسننسق موعداً مناسباً حسب التوفر وتوقيت أونتاريو أو كيبيك أو مدينتك."],
  ["هل الحصة التجريبية الأولى مجانية؟", "نعم، أول حصة تجريبية مجانية للتعرف على مستوى الطالب واحتياجه قبل اختيار الباقة."],
  ["هل يوجد خصم للأخوة؟", "نعم، يوجد خصم خاص عند تسجيل الإخوة معاً، وتُعرف التفاصيل عند التواصل."],
  ["هل يمكن اختيار معلم أو معلمة؟", "يمكنك ذكر تفضيلك عند الحجز، وسننسق حسب البرنامج والمعلمين والمعلمات المتاحين."],
  ["هل يبدأ الطالب من الصفر في تأسيس العربية؟", "نعم، نقيّم المستوى أولاً ويمكن البدء من الحروف والقراءة والكتابة أو الانتقال إلى المستوى المناسب."],
  ["هل يمكن تقييم مستوى الطالب قبل اختيار الباقة؟", "نعم، تساعد الحصة التجريبية والتواصل الأولي على تحديد المستوى والمدة والإيقاع الأنسب."],
  ["كيف يتم التواصل والحجز عبر واتساب؟", "اضغط زر الحجز، واكتب اسم الطالب وعمره وهدفه والمدينة والوقت المناسب، وسنرد عليك بالتفاصيل."],
] as const

function PlanCard({ plan }: { plan: CanadaPlan }) {
  return <article className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
    {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
    <p className="text-sm font-semibold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن للناطقين بالعربية" : "تأسيس العربية للناطقين بالعربية"}</p>
    <h3 className="mt-2 text-xl font-bold text-foreground">{plan.duration} دقيقة للحصة</h3>
    <div className="mt-6 flex items-end gap-2"><strong className="text-4xl font-bold text-primary">CA${plan.price}</strong><span className="pb-1 text-sm font-semibold text-muted-foreground">شهرياً</span></div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} حصص شهرياً، {plan.weeklySessions} {plan.weeklySessions === 1 ? "حصة" : "حصص"} أسبوعياً</p>
    <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
    <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-sm text-foreground">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}</ul>
    <a className="saudi-plan-cta mt-7" href={getCanadaWhatsAppUrl(plan)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> احجز هذه الباقة عبر واتساب</a>
  </article>
}

function Plans({ program, title, description }: { program: CanadaProgram; title: string; description: string }) {
  const plans = canadaLandingConfig.plans.filter((plan) => plan.program === program)
  return <section className="mt-16" aria-labelledby={`${program}-plans`}><h2 id={`${program}-plans`} className="text-center text-3xl font-bold text-foreground">{title}</h2><p className="mx-auto mt-4 max-w-3xl text-center leading-8 text-muted-foreground">{description}</p>{([30, 40, 60] as const).map((duration, index) => <div key={duration}><h3 className="mt-12 text-center text-xl font-bold text-primary">{duration} دقيقة للحصة</h3><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{plans.filter((plan) => plan.duration === duration).map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div><p className="saudi-reveal my-8 rounded-2xl border border-border bg-secondary/50 p-5 text-center font-semibold text-muted-foreground">{["بداية مرنة تناسب الأسرة والطالب.", "وقت إضافي للتسميع والتصحيح والتدريب.", "خيار عملي لمن يريد الجمع بين التعلم والمراجعة."][index]}</p></div>)}</section>
}

export default function CanadaPage() {
  const trialUrl = getCanadaWhatsAppUrl("حصة تجريبية مجانية")
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  return <main dir="rtl" className="min-h-screen overflow-hidden bg-background">
    <header className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"><Link href="/" className="font-bold">أكاديمية الحافظ المتميز</Link><div className="flex items-center gap-3"><span className="text-2xl" role="img" aria-label="كندا">🇨🇦</span><a className="saudi-secondary-cta bg-primary-foreground px-3 py-2 text-sm text-primary" href={trialUrl} target="_blank" rel="noreferrer">احجز حصتك التجريبية المجانية</a></div></div></header>
    <section className="saudi-hero relative islamic-pattern text-center"><div className="saudi-flag-badge" aria-label="خدمة للعائلات العربية في كندا"><span aria-hidden="true">🇨🇦</span></div><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28"><p className="saudi-eyebrow justify-center"><Sparkles size={16} /> Online Quran & Arabic Classes for Families in Canada</p><h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">تحفيظ القرآن وتأسيس اللغة العربية أونلاين للناطقين بالعربية في كندا</h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">حصص فردية مباشرة للأطفال والشباب والبالغين، بمواعيد تناسب تورونتو ومونتريال وفانكوفر وسائر المدن الكندية.</p><div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2 text-sm font-bold"><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">أول حصة تجريبية مجانية</span><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">خصم خاص للأخوة</span><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">أسعار بالدولار الكندي</span></div><div className="mt-8 flex flex-wrap justify-center gap-3"><a className="saudi-primary-cta" href={trialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> احجز حصتك التجريبية المجانية</a><a className="saudi-secondary-cta" href="#plans">استعرض الباقات <ChevronLeft size={18} /></a></div></div></section>
    <LandingPageVideoStrip />
    <section className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4"><div className="saudi-proof"><ShieldCheck size={20} /><span>حصص فردية عن بُعد</span></div><div className="saudi-proof"><Clock3 size={20} /><span>مواعيد تناسب توقيت كندا</span></div><div className="saudi-proof"><MapPin size={20} /><span>من أونتاريو إلى بريتيش كولومبيا</span></div><div className="saudi-proof"><MessageCircle size={20} /><span>تواصل مباشر عبر واتساب</span></div></section>
    <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8"><h2 className="text-center text-3xl font-bold">لماذا تختار أكاديمية القرآن الحافظ في كندا؟</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl border border-border bg-card p-5"><h3 className="font-bold">تعلم فردي</h3><p className="mt-2 leading-7 text-muted-foreground">حصص مباشرة تركّز على احتياج الطالب دون تشتيت.</p></div><div className="rounded-2xl border border-border bg-card p-5"><h3 className="font-bold">موعد مناسب</h3><p className="mt-2 leading-7 text-muted-foreground">تنسيق عملي مع فرق التوقيت داخل كندا.</p></div><div className="rounded-2xl border border-border bg-card p-5"><h3 className="font-bold">لكل الأعمار</h3><p className="mt-2 leading-7 text-muted-foreground">للأطفال والشباب والنساء والرجال.</p></div><div className="rounded-2xl border border-border bg-card p-5"><h3 className="font-bold">متابعة متدرجة</h3><p className="mt-2 leading-7 text-muted-foreground">خطة تناسب المستوى وتبني التقدم خطوة خطوة.</p></div></div></section>
    <section id="plans" className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-20"><Plans program="quran" title="باقات تحفيظ القرآن للناطقين بالعربية" description="باقات شهرية بالدولار الكندي لحصص فردية في الحفظ والتسميع والتجويد والمراجعة." /><Plans program="arabic" title="باقات تأسيس اللغة العربية للناطقين بالعربية" description="حصص فردية للقراءة والكتابة والنطق والفهم، مع تصحيح التلاوة عند توفره ضمن البرنامج." /></section>
    <section className="bg-secondary/40 px-5 py-16 sm:px-8"><div className="mx-auto max-w-4xl text-center"><h2 className="text-3xl font-bold">تعليم أونلاين للعائلات العربية في كندا</h2><p className="mt-5 leading-8 text-muted-foreground">نخدم الأسر في أونتاريو وكيبيك، من تورونتو وميسيساغا وبرامبتون وأوتاوا إلى مونتريال وفانكوفر وكالغاري وإدمونتون ووينيبيغ وهاملتون.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><h2 className="text-center text-3xl font-bold">الأسئلة الشائعة</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{faq.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}</div></section>
    <footer className="bg-primary px-5 py-10 text-primary-foreground"><div className="mx-auto max-w-6xl"><CountryPagesSection /><div className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/teachers">المعلمين والمعلمات</Link><Link href="/blog">المدونة</Link><Link href="/privacy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link><Link href="/refund-policy">سياسة الاسترداد</Link></div><p className="mt-8 border-t border-primary-foreground/10 pt-6 text-sm text-primary-foreground/80">© {new Date().getFullYear()} أكاديمية الحافظ المتميز. تحفيظ القرآن وتأسيس اللغة العربية أونلاين في كندا.</p></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>
}
