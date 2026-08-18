import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Check, ChevronLeft, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"
import SaudiLandingClient from "./saudi-landing-client"
import { LandingPageVideoStrip } from "@/components/LandingPageVideoStrip"
import { getSaudiWhatsAppUrl, saudiLandingConfig, type SaudiProgram } from "@/lib/saudi-landing-config"

export const metadata: Metadata = {
  title: saudiLandingConfig.seo.title,
  description: saudiLandingConfig.seo.description,
  alternates: { canonical: saudiLandingConfig.seo.canonical },
  robots: { index: true, follow: true },
  openGraph: { title: saudiLandingConfig.seo.title, description: saudiLandingConfig.seo.description, url: saudiLandingConfig.seo.canonical, locale: "ar_SA", type: "website" },
}

const faqs = [
  ["هل الحصص حضورية أم أونلاين؟", "نقدم الحصص أونلاين بالكامل، ولا تحتاج إلى الحضور لمقر."],
  ["هل البرامج للأطفال فقط؟", "لا، البرامج مناسبة للأطفال والفتيات والشباب والرجال والنساء وجميع الأعمار."],
  ["هل يمكن اختيار معلم أو معلمة؟", "نعم، يمكنك توضيح تفضيلك في رسالة واتساب وسننسق معك الأنسب."],
  ["هل أحتاج إلى معرفة مستوى الطالب مسبقاً؟", "لا، نساعدك على تحديد المستوى المناسب خلال التنسيق والحصة التجريبية."],
  ["هل الأسعار شهرية؟", "نعم، الأسعار المعروضة بالريال السعودي شهرية حسب عدد الحصص ومدة الحصة."],
  ["هل يمكنني اختيار وقت الحصة؟", "نعم، ننسق معك موعداً مرناً مناسباً بتوقيت السعودية."],
  ["هل الخدمة متاحة من جميع مدن السعودية؟", "نعم، الخدمة أونلاين ومتاحة من جميع مدن ومناطق المملكة."],
  ["كيف أحجز الحصة التجريبية؟", "اضغط على جرب حصة مجانا وأرسل بيانات الطالب والوقت المناسب عبر واتساب."],
]

function PlanCard({ plan }: { plan: (typeof saudiLandingConfig.plans)[number] }) {
  return <article data-saudi-program={plan.program} data-saudi-duration={plan.duration} className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
    {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
    <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن الكريم" : "تأسيس اللغة العربية"}</p><h3 className="mt-2 text-xl font-bold text-foreground">{plan.duration} دقيقة</h3></div><div className="rounded-full bg-secondary p-3 text-primary"><MessageCircle size={20} /></div></div>
    <div className="mt-7 flex items-end gap-2"><strong className="text-4xl font-bold tracking-tight text-primary">{plan.price}</strong><span className="pb-1 text-sm font-semibold text-muted-foreground">ريال شهرياً</span></div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} حصص شهرياً · {plan.weeklySessions} {plan.weeklySessions === 1 ? "حصة" : "حصص"} أسبوعياً</p>
    <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
    <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-sm text-foreground">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}</ul>
    <a className="saudi-plan-cta mt-7" href={getSaudiWhatsAppUrl(plan.name)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> جرب حصة مجانا</a>
  </article>
}

const planQuestions = ["هل تفضل حصة قصيرة ومنتظمة؟", "هل يناسبك برنامج بحصتين أسبوعياً؟", "هل تحتاج إلى وقت أطول للحصة؟", "هل تريد زيادة عدد الحصص خلال الشهر؟", "هل تبحث عن برنامج مناسب لطفلك؟", "هل ترغب في متابعة الحفظ والمراجعة؟", "هل يناسبك اختيار معلم أو معلمة؟", "هل تريد البدء بحصة تجريبية مجانية؟"]
const planInfo = [
  ["تعلم يناسب وقتك ومستواك", "يمكنك اختيار عدد الحصص ومدة الحصة بما يناسب وقتك. سواء كنت تبحث عن بداية هادئة أو متابعة منتظمة للحفظ والمراجعة، نساعدك على اختيار المسار الأقرب إلى هدفك."],
  ["برامج للأطفال والكبار", "البرامج متاحة للأطفال والفتيات والشباب والرجال والنساء، مع مراعاة عمر الطالب ومستواه واحتياجه. يمكنك طلب معلم أو معلمة عند التواصل معنا."],
  ["حصص أونلاين من جميع مدن السعودية", "نقدم الحصص أونلاين للطلاب والطالبات من الرياض وجدة ومكة المكرمة والمدينة المنورة والدمام والخبر والأحساء وجميع مدن ومناطق المملكة، من دون الحاجة إلى الحضور لمقر."],
  ["ابدأ بخطوة بسيطة", "اختر الباقة المناسبة، واضغط على «جرب حصة مجانا»، ثم أرسل بيانات الطالب والوقت المناسب للحصة التجريبية عبر واتساب. سنساعدك في استكمال الخطوات وتنسيق الموعد."],
]

function PlanInfoCard({ title, text }: { title: string; text: string }) {
  return <div className="saudi-reveal my-10 rounded-2xl border border-border bg-secondary/50 p-6 text-center shadow-sm"><h3 className="text-xl font-bold">{title}</h3><p className="mx-auto mt-3 max-w-3xl leading-8 text-muted-foreground">{text}</p></div>
}

function PlanQuestion({ question }: { question: string }) {
  return <div className="saudi-plan-question saudi-reveal flex flex-wrap items-center justify-center gap-3 py-5 text-center"><span className="text-sm font-semibold text-muted-foreground">{question}</span><span className="text-xs text-primary">اختر الباقة التي تناسبك</span></div>
}

function PlansSection({ program, title }: { program: SaudiProgram; title: string }) {
  const plans = saudiLandingConfig.plans.filter((plan) => plan.program === program && plan.visible)
  return <section className="mt-16" aria-labelledby={`${program}-plans`}><h3 id={`${program}-plans`} className="text-center text-2xl font-bold text-foreground">{title}</h3><div className="mt-8 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">{plans.map((plan, index) => <div key={plan.id} className="contents"><PlanCard plan={plan} /><PlanQuestion question={planQuestions[index % planQuestions.length]} />{(index + 1) % 4 === 0 && planInfo[Math.floor(index / 4)] ? <div className="col-span-full"><PlanInfoCard title={planInfo[Math.floor(index / 4)][0]} text={planInfo[Math.floor(index / 4)][1]} /></div> : null}</div>)}</div></section>
}

export default function SaudiArabiaPage() {
  const trialUrl = getSaudiWhatsAppUrl("طلب حصة تجريبية مجانية")
  return <main dir="rtl" className="min-h-screen overflow-hidden bg-background">
    <header className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"><Link href="/" className="flex items-center gap-3"><Image src="/logo.png" alt="شعار أكاديمية الحافظ المتميز" width={44} height={44} className="size-11 rounded-lg bg-secondary object-contain" priority /><span className="font-bold">أكاديمية الحافظ المتميز</span></Link><a className="saudi-secondary-cta bg-primary-foreground px-3 py-2 text-sm text-primary" href={trialUrl} target="_blank" rel="noreferrer">جرب حصة مجانا</a></div></header>
    <section className="saudi-hero islamic-pattern text-center"><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28"><p className="saudi-eyebrow justify-center"><Sparkles size={16} /> أكاديمية الحافظ المتميز</p><h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">تحفيظ القرآن وتأسيس اللغة العربية أونلاين في السعودية</h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">حصص مرنة لجميع الأعمار من أي مدينة داخل المملكة</p><p className="mx-auto mt-5 max-w-3xl text-pretty leading-8 text-muted-foreground">الدراسة أونلاين بالكامل للرجال والنساء والأطفال والشباب والفتيات من الرياض وجدة ومكة المكرمة والمدينة المنورة والدمام والخبر والأحساء وجميع مدن ومناطق السعودية، من دون الحاجة إلى الحضور لمقر.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a className="saudi-primary-cta" href={trialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> جرب حصة مجانا</a><a className="saudi-secondary-cta" href="#plans">استعرض الباقات <ChevronLeft size={18} /></a></div></div></section>
    <LandingPageVideoStrip />
    <section className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4"><div className="saudi-proof"><ShieldCheck size={20} /><span>معلمون ومعلمات متخصصون</span></div><div className="saudi-proof"><Clock3 size={20} /><span>مواعيد مرنة بتوقيت السعودية</span></div><div className="saudi-proof"><MapPin size={20} /><span>حصص فردية أونلاين</span></div><div className="saudi-proof"><MessageCircle size={20} /><span>تواصل مباشر عبر واتساب</span></div></section>
    <SaudiLandingClient />
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24"><div className="saudi-reveal mx-auto max-w-3xl rounded-2xl border border-border bg-card p-7 text-center shadow-md"><p className="saudi-eyebrow justify-center">ابدأ بخطوة واضحة</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">اختر البرنامج المناسب لك ولأسرتك</h2><p className="mt-5 leading-8 text-muted-foreground">نقدم برامج تحفيظ القرآن وتأسيس اللغة العربية أونلاين للرجال والنساء والأطفال والشباب والفتيات وجميع الأعمار. تبدأ الرحلة بحصة تجريبية مجانية نتعرف خلالها على مستوى الطالب واحتياجه، ثم نساعدك على اختيار مدة الحصة وعدد الحصص المناسب بتوقيت السعودية.</p></div><div className="mt-16 text-center"><p className="saudi-eyebrow justify-center">برامج تعليمية مرنة</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">اختر البرنامج والباقـة المناسبة</h2><p className="mt-4 leading-7 text-muted-foreground">أسعار واضحة بالريال السعودي، وحصة تجريبية مجانية قبل البدء.</p></div><div id="plans" className="scroll-mt-8"><PlansSection program="quran" title="تحفيظ القرآن الكريم" /><PlansSection program="arabic" title="تأسيس اللغة العربية" /></div></section>
    <section className="bg-secondary/40 px-5 py-16 sm:px-8"><div className="mx-auto max-w-4xl text-center"><p className="saudi-eyebrow justify-center">نخدم جميع مدن المملكة</p><h2 className="mt-4 text-3xl font-bold">تعليم أونلاين من أي مدينة</h2><p className="mx-auto mt-5 max-w-3xl leading-8 text-muted-foreground">نقدم الحصص أونلاين للطلاب والطالبات من الرياض وجدة ومكة المكرمة والمدينة المنورة والدمام والخبر والأحساء وجميع مدن المملكة، من دون الحاجة إلى الحضور لمقر.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><div className="mx-auto max-w-3xl text-center"><p className="saudi-eyebrow justify-center">لمن تناسب برامجنا؟</p><h2 className="mt-4 text-3xl font-bold">برنامج يناسب مختلف الأعمار والمستويات</h2><p className="mt-5 leading-8 text-muted-foreground">صُممت برامجنا لتناسب مختلف الأعمار والمستويات؛ للأطفال والفتيات والشباب والرجال والنساء. يمكنك البدء من المستوى المبتدئ أو متابعة الحفظ والمراجعة والتجويد إذا كان لديك حفظ سابق. نساعد كل طالب على اختيار البرنامج والمدة المناسبة له، مع إمكانية اختيار معلم أو معلمة وفق ما يناسب الأسرة والطالب.</p></div><div className="mt-10 grid gap-5 md:grid-cols-2"><article className="rounded-2xl border border-border bg-card p-6"><h3 className="text-xl font-bold">ماذا يتعلم الطالب؟</h3><p className="mt-3 leading-7 text-muted-foreground"><strong>تحفيظ القرآن:</strong> يركز البرنامج على الحفظ الجديد، والمراجعة، وتصحيح التلاوة، والتجويد بحسب مستوى الطالب وهدفه.</p><p className="mt-3 leading-7 text-muted-foreground"><strong>تأسيس اللغة العربية:</strong> يساعد البرنامج على تحسين القراءة والكتابة والنطق وفهم أساسيات اللغة العربية، مع مراعاة عمر الطالب ومستواه واحتياجه التعليمي.</p></article><article className="rounded-2xl border border-border bg-card p-6"><h3 className="text-xl font-bold">لماذا تختار الأكاديمية؟</h3><ul className="mt-3 grid gap-2 leading-7 text-muted-foreground"><li>حصص فردية تناسب مستوى الطالب.</li><li>مواعيد مرنة بتوقيت السعودية.</li><li>برامج للأطفال والكبار وجميع الأعمار.</li><li>إمكانية اختيار معلم أو معلمة.</li><li>متابعة للحفظ والتقدم حسب البرنامج.</li><li>تواصل مباشر وسهل عبر واتساب.</li></ul></article></div></section>
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8"><div className="text-center"><p className="saudi-eyebrow justify-center">ابدأ بخطوات بسيطة</p><h2 className="mt-4 text-3xl font-bold">كيف تبدأ؟</h2></div><ol className="mx-auto mt-10 grid max-w-2xl gap-4">{["اختر البرنامج والباقـة المناسبة.", "اضغط على جرب حصة مجانا.", "أرسل بيانات الطالب والوقت المناسب عبر واتساب.", "ننسق معك موعد الحصة التجريبية."].map((step, index) => <li key={step} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{index + 1}</span><span className="font-semibold">{step}</span></li>)}</ol></section>
    <section className="bg-secondary/40 px-5 py-16 sm:px-8"><div className="mx-auto max-w-3xl text-center"><p className="saudi-eyebrow justify-center">الأسئلة الشائعة</p><h2 className="mt-4 text-3xl font-bold">كل ما تحتاج إلى معرفته</h2><div className="mt-8 grid gap-4 text-right">{faqs.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}</div></div></section>
    <section className="px-5 py-20 text-center sm:px-8"><div className="mx-auto max-w-3xl rounded-2xl bg-primary px-6 py-12 text-primary-foreground shadow-xl"><h2 className="text-3xl font-bold sm:text-4xl">ابدأ الآن بحصة تجريبية مجانية</h2><p className="mt-4 text-primary-foreground/80">أرسل لنا بيانات الطالب والوقت المناسب، وسنساعدك في اختيار البرنامج الأفضل.</p><a className="saudi-secondary-cta mt-8 bg-primary-foreground text-primary" href={trialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> جرب حصة مجانا</a></div></section>
    <footer className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-2"><div><div className="flex items-center gap-3"><Image src="/logo.png" alt="شعار أكاديمية الحافظ المتميز" width={48} height={48} className="size-12 rounded-lg bg-secondary object-contain" /><div><p className="font-bold">أكاديمية الحافظ المتميز</p><p className="mt-1 text-sm text-primary-foreground/70">تعليم القرآن واللغة العربية أونلاين</p></div></div><p className="mt-4 max-w-md text-sm leading-7 text-primary-foreground/75">حصص فردية مرنة للقرآن الكريم واللغة العربية للطلاب والطالبات من جميع مدن السعودية.</p></div><nav aria-label="روابط صفحة السعودية" className="grid content-start gap-3 text-sm text-primary-foreground/85 sm:grid-cols-2"><Link href="/">الرئيسية</Link><Link href="/quran">أسعار تحفيظ القرآن</Link><Link href="/arabic">أسعار اللغة العربية</Link><Link href="/classroom-moments">فيديوهات من حصصنا</Link><Link href="/contact">تواصل معنا</Link><Link href="/saudi-arabia">تحفيظ القرآن واللغة العربية في السعودية</Link></nav></div><div className="border-t border-primary-foreground/10 px-5 py-5 text-center text-xs text-primary-foreground/65 sm:px-8">© {new Date().getFullYear()} أكاديمية الحافظ المتميز. جميع الحقوق محفوظة.</div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }) }} />
  </main>
}
