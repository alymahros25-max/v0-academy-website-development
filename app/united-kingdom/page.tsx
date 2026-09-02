import type { Metadata } from "next"
import Link from "next/link"
import { Check, ChevronLeft, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"
import { LandingPageVideoStrip } from "@/components/LandingPageVideoStrip"
import { CountryPagesSection } from "@/components/layout/country-pages-section"
import { getUnitedKingdomWhatsAppUrl, unitedKingdomLandingConfig, type UnitedKingdomPlan, type UnitedKingdomProgram } from "@/lib/united-kingdom-landing-config"
import { getAreaLandingData, getAreaWhatsAppUrl, toAreaDisplayPlan, type AreaDisplayPlan } from "@/lib/country-content"

export const metadata: Metadata = {
  title: unitedKingdomLandingConfig.seo.title,
  description: unitedKingdomLandingConfig.seo.description,
  alternates: { canonical: unitedKingdomLandingConfig.seo.canonical },
  openGraph: { title: unitedKingdomLandingConfig.seo.title, description: unitedKingdomLandingConfig.seo.description, url: unitedKingdomLandingConfig.seo.canonical, locale: "ar_GB", type: "website" },
  twitter: { card: "summary_large_image", title: unitedKingdomLandingConfig.seo.title, description: unitedKingdomLandingConfig.seo.description },
}

const faq = [
  ["هل تناسب الحصص الأطفال المقيمين في المملكة المتحدة؟", "نعم، الحصص الفردية تناسب الأطفال والشباب والبالغين من الناطقين بالعربية، مع خطة ومدة تناسب مستوى الطالب."],
  ["كيف نختار الموعد المناسب مع فرق التوقيت؟", "ننسق مع الأسرة لاختيار وقت مناسب بتوقيت المملكة المتحدة، مع مراعاة توافر المعلم والطالب."],
  ["هل أول حصة تجريبية مجانية؟", "نعم، أول حصة تجريبية مجانية للتعرف على مستوى الطالب واحتياجه قبل اختيار الباقة."],
  ["هل يوجد خصم للأخوة؟", "نعم، يوجد خصم خاص للأخوة، ويمكن معرفة التفاصيل عند التواصل عبر واتساب."],
  ["هل يمكن اختيار معلم أو معلمة؟", "يمكنك ذكر تفضيلك عند الحجز، وسننسق حسب البرنامج والتوفر."],
  ["هل يبدأ الطالب من الصفر في تحفيظ القرآن؟", "نعم، نبدأ من المستوى المناسب للطالب مع الحفظ والتسميع وتصحيح التلاوة والمراجعة."],
  ["هل يبدأ الطالب من الحروف في تأسيس اللغة العربية؟", "نعم، يمكن البدء من الحروف أو تقييم المستوى أولاً ثم إعداد خطة مناسبة."],
  ["هل تشمل حصة العربية القراءة والكتابة والنطق؟", "نعم، تشمل المهارات التي يحتاجها الطالب من القراءة والكتابة والنطق والفهم بالعربية."],
  ["هل يمكن تقييم مستوى الطالب قبل اختيار الباقة؟", "نعم، تساعد الحصة التجريبية والتواصل الأولي في تحديد المستوى والهدف والمدة المناسبة."],
  ["هل الأسعار شهرية وبالجنيه الإسترليني؟", "نعم، الأسعار المعروضة شهرية وبالجنيه الإسترليني (£)، وتختلف حسب مدة الحصة وعددها."],
  ["كيف يتم الحجز والتواصل عبر WhatsApp؟", "اضغط على زر الحجز، وأرسل البيانات المطلوبة عبر واتساب لننسق الحصة التجريبية أو الباقة."],
] as const

function PlanCard({ plan, contactUrl }: { plan: AreaDisplayPlan; contactUrl?: string }) {
  return <article className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
    {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
    <p className="text-sm font-semibold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن للناطقين بالعربية" : "تأسيس العربية للناطقين بالعربية"}</p>
    <h3 className="mt-2 text-xl font-bold text-foreground">{plan.duration} دقيقة للحصة</h3>
    <div className="mt-6 flex items-end gap-2"><strong className="text-4xl font-bold text-primary">£{plan.price}</strong><span className="pb-1 text-sm font-semibold text-muted-foreground">شهرياً</span></div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} حصص شهرياً، {plan.weeklySessions} {plan.weeklySessions === 1 ? "حصة" : "حصص"} أسبوعياً</p>
    <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
    <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-sm text-foreground">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}</ul>
    <a className="saudi-plan-cta mt-7" href={contactUrl ?? getUnitedKingdomWhatsAppUrl(plan.name)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> احجز هذه الباقة عبر واتساب</a>
  </article>
}

async function Plans({ program, title, description }: { program: UnitedKingdomProgram; title: string; description: string }) {
  const areaData = await getAreaLandingData("united-kingdom")
  const databasePlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === program)
  const plans = databasePlans.length ? databasePlans : (unitedKingdomLandingConfig.plans.filter((plan) => plan.program === program) as unknown as AreaDisplayPlan[])
  return <section className="mt-16"><h2 className="text-center text-3xl font-bold text-foreground">{title}</h2><p className="mx-auto mt-4 max-w-3xl text-center leading-8 text-muted-foreground">{description}</p>{([30, 40, 60] as const).map((duration, index) => <div key={duration}><h3 className="mt-12 text-center text-xl font-bold text-primary">{duration} دقيقة للحصة</h3><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{plans.filter((plan) => plan.duration === duration).map((plan) => <PlanCard key={plan.id} plan={plan} contactUrl={getAreaWhatsAppUrl(areaData.links, plan.name, getUnitedKingdomWhatsAppUrl(plan.name))} />)}</div>{program === "quran" && <p className="saudi-reveal my-8 rounded-2xl border border-border bg-secondary/50 p-5 text-center font-semibold text-muted-foreground">{["إيقاع مرن لبداية رحلة الحفظ.", "وقت أطول للتسميع والتصحيح والمراجعة.", "اختيار مناسب لمن يريد الجمع بين الحفظ والمراجعة."][index]}</p>}</div>)}</section>
}

export default async function UnitedKingdomPage() {
  const areaData = await getAreaLandingData("united-kingdom")
  const databaseFaq = areaData.faq.map((item) => [item.question_ar, item.answer_ar] as const)
  const faqItems = databaseFaq.length ? databaseFaq : faq
  const trialUrl = getAreaWhatsAppUrl(areaData.links, "حصة تجريبية مجانية", getUnitedKingdomWhatsAppUrl("حصة تجريبية مجانية"))
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  return <main dir="rtl" className="min-h-screen overflow-hidden bg-background">
    <header className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"><Link href="/" className="font-bold">أكاديمية الحافظ المتميز</Link><div className="flex items-center gap-3"><span className="text-2xl" role="img" aria-label="المملكة المتحدة">🇬🇧</span><a className="saudi-secondary-cta bg-primary-foreground px-3 py-2 text-sm text-primary" href={trialUrl} target="_blank" rel="noreferrer">احجز أول حصة تجريبية مجاناً</a></div></div></header>
    <section className="saudi-hero relative islamic-pattern text-center"><div className="saudi-flag-badge" aria-label="خدمة للعائلات العربية في المملكة المتحدة"><span aria-hidden="true">🇬🇧</span></div><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28"><p className="saudi-eyebrow justify-center"><Sparkles size={16} /> Online Quran Classes for Arabic-Speaking Families in the UK</p><h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">تحفيظ القرآن وتأسيس اللغة العربية أونلاين للعائلات العربية في المملكة المتحدة</h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">أول حصة تجريبية مجانية، مع برامج فردية للأطفال والشباب والبالغين في لندن وبرمنغهام ومانشستر وليستر وإدنبرة وكارديف وباقي المدن.</p><div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2 text-sm font-bold"><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">أول حصة تجريبية مجانية</span><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">خصم خاص للأخوة</span><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">مواعيد مرنة تناسب المملكة المتحدة</span></div><div className="mt-8 flex flex-wrap justify-center gap-3"><a className="saudi-primary-cta" href={trialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> احجز أول حصة تجريبية مجاناً</a><a className="saudi-secondary-cta" href="#plans">استعرض الباقات <ChevronLeft size={18} /></a></div></div></section>
    <LandingPageVideoStrip />
    <section className="mx-auto max-w-6xl px-5 py-14 text-center sm:px-8"><h2 className="text-3xl font-bold text-foreground">تعليم القرآن والعربية للعائلات العربية في بريطانيا</h2><p className="mx-auto mt-5 max-w-3xl leading-8 text-muted-foreground">حصص فردية عن بُعد للأطفال والشباب والبالغين، مع متابعة تناسب مستوى كل طالب ومواعيد مرنة تلائم الأسر في لندن والمدن البريطانية المختلفة.</p></section>
    <section className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4"><div className="saudi-proof"><ShieldCheck size={20} /><span>حصص فردية مباشرة</span></div><div className="saudi-proof"><Clock3 size={20} /><span>مواعيد مرنة داخل المملكة المتحدة</span></div><div className="saudi-proof"><MapPin size={20} /><span>معلمون ومعلمات حسب المتاح</span></div><div className="saudi-proof"><MessageCircle size={20} /><span>تواصل مباشر عبر واتساب</span></div></section>
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24"><Plans program="quran" title="باقات تحفيظ القرآن للناطقين بالعربية" description="باقات شهرية بالجنيه الإسترليني لحصص فردية في الحفظ والتسميع والتجويد وتصحيح التلاوة والمراجعة." /><Plans program="arabic" title="باقات تأسيس اللغة العربية للناطقين بالعربية" description="تأسيس القراءة والكتابة والنطق والفهم بالعربية للأطفال والشباب والبالغين، مع خطة فردية مباشرة أونلاين." /></section>
    <section className="bg-secondary/40 px-5 py-16 sm:px-8"><div className="mx-auto max-w-4xl text-center"><h2 className="text-3xl font-bold text-foreground">نخدم الأسر العربية في كل مدن المملكة المتحدة</h2><p className="mt-5 leading-8 text-muted-foreground">من لندن وبرمنغهام ومانشستر وليدز وغلاسكو وإدنبرة وليستر وبرادفورد وشيفيلد وليفربول وكارديف، يمكن للطالب التعلم عن بُعد بموعد يناسب أسرته.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><h2 className="text-center text-3xl font-bold text-foreground">الأسئلة الشائعة</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{faqItems.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}</div></section>
    <footer className="bg-primary px-5 py-10 text-primary-foreground"><div className="mx-auto max-w-6xl"><CountryPagesSection /><nav className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/teachers">المعلمون والمعلمات</Link><Link href="/blog">المدونة</Link><Link href="/privacy-policy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link><Link href="/refund-policy">سياسة الاسترداد</Link></nav><p className="mt-8 text-sm text-primary-foreground/80">تحفيظ القرآن وتأسيس اللغة العربية أونلاين في المملكة المتحدة © {new Date().getFullYear()} أكاديمية الحافظ المتميز</p></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>
}
