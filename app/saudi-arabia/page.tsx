import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Check, ChevronLeft, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"
import SaudiLandingClient from "./saudi-landing-client"
import { LandingPageVideoStrip } from "@/components/LandingPageVideoStrip"
import { getSaudiWhatsAppUrl, saudiLandingConfig, type SaudiProgram } from "@/lib/saudi-landing-config"
import { getAreaLandingData, getAreaWhatsAppUrl, toAreaDisplayPlan, type AreaDisplayPlan } from "@/lib/country-content"
import { CountryPagesSection } from "@/components/layout/country-pages-section"

export const metadata: Metadata = {
  title: saudiLandingConfig.seo.title,
  description: saudiLandingConfig.seo.description,
  alternates: { canonical: saudiLandingConfig.seo.canonical },
  robots: { index: true, follow: true },
  openGraph: { title: saudiLandingConfig.seo.title, description: saudiLandingConfig.seo.description, url: saudiLandingConfig.seo.canonical, locale: "ar_SA", type: "website" },
  twitter: { card: "summary_large_image", title: saudiLandingConfig.seo.title, description: saudiLandingConfig.seo.description },
}


function PlanCard({ plan, contactUrl }: { plan: AreaDisplayPlan; contactUrl?: string }) {
  return <article data-saudi-program={plan.program} data-saudi-duration={plan.duration} className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
    {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
    <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن الكريم" : "تأسيس اللغة العربية"}</p><h3 className="mt-2 text-xl font-bold text-foreground">{plan.duration} دقيقة</h3></div><div className="rounded-full bg-secondary p-3 text-primary"><MessageCircle size={20} /></div></div>
    <div className="mt-7 flex items-end gap-2"><strong className="text-4xl font-bold tracking-tight text-primary">{plan.price}</strong><span className="pb-1 text-sm font-semibold text-muted-foreground">ريال شهرياً</span></div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} حصص شهرياً · {plan.weeklySessions} {plan.weeklySessions === 1 ? "حصة" : "حصص"} أسبوعياً</p>
    <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
    <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-sm text-foreground">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}</ul>
    <a className="saudi-plan-cta mt-7" href={contactUrl ?? getSaudiWhatsAppUrl(plan.name)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> جرب حصة مجانا</a>
  </article>
}

const planInfoByProgram = {
  quran: [
    ["تحفيظ قرآن أونلاين بخطة تناسب الطالب", "نساعد الطلاب والطالبات من الرياض وجدة ومكة والمدينة والدمام وبقية مدن السعودية على حفظ القرآن ومراجعته من خلال حصص فردية مرنة تناسب العمر والمستوى."],
    ["متابعة الحفظ والتجويد خطوة بخطوة", "تتضمن حصص تحفيظ القرآن متابعة الحفظ الجديد والمراجعة وتصحيح التلاوة والتجويد، مع اختيار مدة وعدد حصص يناسبان وقت الأسرة."],
    ["حصة تجريبية قبل اختيار الباقة", "ابدأ بحصة تجريبية مجانية ليتعرف المعلم على مستوى الطالب وهدفه، ثم نساعدك في اختيار الباقة المناسبة بالريال السعودي."],
  ],
  arabic: [
    ["تأسيس اللغة العربية أونلاين للأطفال والكبار", "برنامج تأسيس العربية مناسب للطلاب والطالبات في السعودية، ويبدأ من مستوى الطالب في القراءة والكتابة والنطق دون افتراض مستوى سابق."],
    ["قراءة وكتابة وإملاء بطريقة متدرجة", "نركز على بناء أساس قوي في القراءة والكتابة والإملاء والتعبير، مع متابعة فردية تناسب عمر الطالب واحتياجه."],
    ["برنامج مرن يناسب وقت الأسرة", "يمكن اختيار مدة الحصة وعدد الحصص الأسبوعية والتنسيق على موعد مناسب بتوقيت السعودية، مع إمكانية بدء التجربة قبل الاشتراك الشهري."],
  ],
} as const

const faqGroupsByProgram = {
  quran: [
    [["هل تحفيظ القرآن مناسب للمبتدئ؟", "نعم، نبدأ مع الطالب من المستوى المناسب له، سواء كان مبتدئاً أو لديه حفظ سابق، ثم نضع خطة للحفظ والمراجعة والتجويد."], ["هل الحصص فردية أم جماعية؟", "الحصص فردية أونلاين، حتى يحصل الطالب على متابعة مباشرة وتصحيح مستمر أثناء التلاوة والحفظ."]],
    [["هل يمكن اختيار معلم أو معلمة؟", "نعم، يمكنك توضيح تفضيلك عند التواصل عبر واتساب، وسننسق معك حسب البرنامج والتوفر."], ["هل تشمل الحصة الحفظ والمراجعة؟", "نعم، يحدد المعلم وقت الحصة بين الحفظ الجديد والمراجعة وتصحيح التلاوة والتجويد بحسب مستوى الطالب."]],
    [["هل الخدمة متاحة من الرياض وجدة وبقية المدن؟", "نعم، الحصص أونلاين ومتاحة من الرياض وجدة ومكة المكرمة والمدينة المنورة والدمام والخبر والأحساء وجميع مدن المملكة."], ["كيف أختار عدد الحصص المناسب؟", "نساعدك في الاختيار بعد معرفة عمر الطالب ومستواه وهدفه والوقت المتاح له، ويمكن البدء بحصة تجريبية مجانية."]],
  ],
  arabic: [
    [["هل تأسيس العربية مناسب لمن لا يقرأ جيداً؟", "نعم، يبدأ البرنامج من مستوى الطالب ويركز تدريجياً على الحروف والقراءة والكتابة والنطق."], ["ماذا يتعلم الطالب في برنامج العربي؟", "يتعلم القراءة والكتابة والإملاء والنطق والتعبير، مع متابعة تناسب عمره ومستواه واحتياجه."]],
    [["هل البرنامج مناسب للأطفال والكبار؟", "نعم، توجد متابعة للأطفال والشباب والفتيات والرجال والنساء، ويتم اختيار المحتوى حسب مستوى كل طالب."], ["هل يمكن تحديد وقت يناسب الأسرة؟", "نعم، ننسق موعد الحصة بتوقيت السعودية وفق الأوقات المتاحة للطالب والأسرة."]],
    [["هل الأسعار شهرية؟", "نعم، الأسعار المعروضة بالريال السعودي شهرية، وتختلف حسب مدة الحصة وعدد الحصص الأسبوعية."], ["كيف أحجز الحصة التجريبية؟", "اختر الباقة المناسبة واضغط جرب حصة مجانا، ثم أرسل بيانات الطالب والوقت المناسب عبر واتساب."]],
  ],
} as const

function PlanInfoCard({ title, text }: { title: string; text: string }) {
  return <div className="saudi-reveal my-10 rounded-2xl border border-border bg-secondary/50 p-6 text-center shadow-sm"><h3 className="text-xl font-bold">{title}</h3><p className="mx-auto mt-3 max-w-3xl leading-8 text-muted-foreground">{text}</p></div>
}

function FAQGroup({ items }: { items: readonly (readonly [string, string])[] }) {
  return <div className="saudi-reveal mt-8 grid gap-3 text-right sm:grid-cols-2">{items.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-5 shadow-sm"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}</div>
}

async function PlansSection({ program, title }: { program: SaudiProgram; title: string }) {
  const areaData = await getAreaLandingData("saudi-arabia")
  const databasePlans = areaData.packages.map(toAreaDisplayPlan).filter((plan) => plan.program === program)
  const plans = databasePlans.length ? databasePlans : (saudiLandingConfig.plans.filter((plan) => plan.program === program && plan.visible) as unknown as AreaDisplayPlan[])
  const info = planInfoByProgram[program]
  const databaseFaq = areaData.faq.filter((item) => item.question_key.includes(`-${program}-`)).map((item) => [item.question_ar, item.answer_ar] as const)
  const faqs = databaseFaq.length ? Array.from({ length: Math.ceil(databaseFaq.length / 2) }, (_, index) => databaseFaq.slice(index * 2, index * 2 + 2)) : faqGroupsByProgram[program]
  return <section className="mt-16" aria-labelledby={`${program}-plans`}><h3 id={`${program}-plans`} className="text-center text-2xl font-bold text-foreground">{title}</h3>{Array.from({ length: Math.ceil(plans.length / 4) }, (_, groupIndex) => <div key={`${program}-group-${groupIndex}`}><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{plans.slice(groupIndex * 4, groupIndex * 4 + 4).map((plan) => <PlanCard key={plan.id} plan={plan} contactUrl={getAreaWhatsAppUrl(areaData.links, plan.name, getSaudiWhatsAppUrl(plan.name))} />)}</div><PlanInfoCard title={info[groupIndex][0]} text={info[groupIndex][1]} /><FAQGroup items={faqs[groupIndex]} /></div>)}</section>
}

export default async function SaudiArabiaPage() {
  const trialUrl = getSaudiWhatsAppUrl("طل�� حصة تجريبية مجانية")
  const areaData = await getAreaLandingData("saudi-arabia")
  const databaseFaq = areaData.faq.map((item) => [item.question_ar, item.answer_ar] as const)
  const faqItems = databaseFaq.length ? databaseFaq : []
  const areaTrialUrl = getAreaWhatsAppUrl(areaData.links, "طلب حصة تجريبية مجانية", getSaudiWhatsAppUrl("طلب حصة تجريبية مجانية"))
  return <main dir="rtl" className="min-h-screen overflow-hidden bg-background">
    <header className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"><Link href="/" className="flex items-center gap-3"><Image src="/logo.png" alt="شعار أكاديمية الحافظ المتميز" width={44} height={44} className="size-11 rounded-lg bg-secondary object-contain" /><span className="font-bold">أكاديمية الحافظ المتميز</span></Link><div className="flex items-center gap-3"><span className="text-2xl" aria-label="السعودية" title="السعودية" role="img">🇸🇦</span><a className="saudi-secondary-cta bg-primary-foreground px-3 py-2 text-sm text-primary" href={areaTrialUrl} target="_blank" rel="noreferrer">جرب حصة مجانا</a></div></div></header>
    <section className="saudi-hero relative islamic-pattern text-center"><div className="saudi-flag-badge" aria-label="السعودية" title="خدمة مخصصة للطلاب في المملكة العربية السعودية"><span aria-hidden="true">🇸🇦</span></div><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28"><p className="saudi-eyebrow justify-center"><Sparkles size={16} /> أكاديمية الحافظ المتميز</p><h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">تحفيظ القرآن وتأسيس اللغة العربية أونلاين للعائلات في السعودية</h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">أول حصة تجريبية مجانية، مع برامج مرنة للأطفال والشباب والبالغين ومواعيد تناسب الأسرة في الرياض وجدة ومكة والمدينة والدمام وباقي مدن المملكة.</p><div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2 text-sm font-bold"><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">أول حصة تجريبية مجانية</span><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">خصم خاص للأخوة عند التسجيل معاً</span></div><p className="mx-auto mt-5 max-w-3xl text-pretty leading-8 text-muted-foreground">الدراسة أونلاين بالكامل للرجال والنساء والأطفال والشباب والفتيات من الرياض وجدة ومكة المكرمة والمدينة المنورة والدمام والخبر والأحساء وجميع مدن ومناطق السعودية، من دون الحاجة إلى الحضور لمقر.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a className="saudi-primary-cta" href={areaTrialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> جرب حصة مجانا</a><a className="saudi-secondary-cta" href="#plans">استعرض الباقات <ChevronLeft size={18} /></a></div></div></section>
    <LandingPageVideoStrip />
    <section className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4"><div className="saudi-proof"><ShieldCheck size={20} /><span>معلمون ومعلمات متخصصون</span></div><div className="saudi-proof"><Clock3 size={20} /><span>مواعيد مرنة بتوقيت السعودية</span></div><div className="saudi-proof"><MapPin size={20} /><span>حصص فردية أونلاين</span></div><div className="saudi-proof"><MessageCircle size={20} /><span>تواصل مباشر عبر واتساب</span></div></section>
    <SaudiLandingClient />
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24"><div className="saudi-reveal mx-auto max-w-3xl rounded-2xl border border-border bg-card p-7 text-center shadow-md"><p className="saudi-eyebrow justify-center">أول حصة تجريبية مجانية</p><p className="mt-2 font-bold text-primary">خصم خاص للأخوة عند التسجيل معاً</p><p className="mt-3 text-sm text-muted-foreground">ابدأ بحصة مجانية قبل اختيار الباقة المناسبة.</p><p className="saudi-eyebrow justify-center mt-6">ابدأ بخطوة واضحة</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">اختر البرنامج المناسب لك ولأسرتك</h2><p className="mt-5 leading-8 text-muted-foreground">نقدم برامج تحفيظ القرآن وتأسيس اللغة العربية أونلاين للرجال والنساء والأطفال والشباب والفتيات وجميع الأعمار. تبدأ الرحلة بحصة تجريبية مجانية نتعرف خلالها على مستوى الطالب واحتياجه، ثم نساعدك على اختيار مدة الحصة وعدد الحصص المناسب بتوقيت السعودية.</p></div><div className="mt-16 text-center"><p className="saudi-eyebrow justify-center">برامج تعليمية مرنة</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">اختر البرنامج والباقـة المناسبة</h2><p className="mt-4 leading-7 text-muted-foreground">أسعار واضحة بالريال السعودي، وحصة تجريبية مجانية قبل البدء.</p></div><div id="plans" className="scroll-mt-8"><PlansSection program="quran" title="تحفيظ القرآن الكريم" /><PlansSection program="arabic" title="تأسيس اللغة العربية" /></div></section>
    <section className="bg-secondary/40 px-5 py-16 sm:px-8"><div className="mx-auto max-w-4xl text-center"><p className="saudi-eyebrow justify-center">نخدم جميع مدن المملكة</p><h2 className="mt-4 text-3xl font-bold">تعليم أونلاين من أي مدينة</h2><p className="mx-auto mt-5 max-w-3xl leading-8 text-muted-foreground">نقدم الحصص أونلاين للطلاب والطالبات من الرياض وجدة ومكة المكرمة والمدينة المنورة والدمام والخبر والأحساء وجميع مدن المملكة، من دون الحاجة إلى الحضور لمقر.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><div className="mx-auto max-w-3xl text-center"><p className="saudi-eyebrow justify-center">لمن تناسب برامجنا؟</p><h2 className="mt-4 text-3xl font-bold">برنامج يناسب مختلف الأعمار والمستويات</h2><p className="mt-5 leading-8 text-muted-foreground">صُممت برامجنا لتناسب مختلف ��لأعمار والمستويات؛ للأطفال والفتيات والشباب والرجال والنساء. يمكنك البدء من المستوى ��لمبتدئ أو متابعة الحفظ والمراجعة والتجويد إذا كان لديك حفظ سابق. نساعد كل طالب على اختيار البرنامج والمدة المناسبة له، مع إمكانية اختيار معلم أو معلمة وفق ما يناسب الأسرة والطالب.</p></div><div className="mt-10 grid gap-5 md:grid-cols-2"><article className="rounded-2xl border border-border bg-card p-6"><h3 className="text-xl font-bold">ماذا يتعلم الطالب؟</h3><p className="mt-3 leading-7 text-muted-foreground"><strong>تحفيظ القرآن:</strong> يركز البرنامج على الحفظ الجديد، والمراجعة، وتصحيح التلاوة، والتجويد بحسب مستوى الطالب وهدفه.</p><p className="mt-3 leading-7 text-muted-foreground"><strong>تأسيس اللغة العربية:</strong> يساعد البرنامج على تحسين القراءة والكتابة والنطق وفهم أساسيات اللغة العربية، مع مراعاة عمر الطالب ومستواه واحتياجه التعليمي.</p></article><article className="rounded-2xl border border-border bg-card p-6"><h3 className="text-xl font-bold">لماذا تختار الأكاديمية؟</h3><ul className="mt-3 grid gap-2 leading-7 text-muted-foreground"><li>حصص فردية تناسب مستوى الطالب.</li><li>مواعيد مرنة بتوقيت السعودية.</li><li>برامج للأطفال والكبار وجميع الأعمار.</li><li>إمكانية اختيار معلم أو معلمة.</li><li>متابعة للحفظ والتقدم حسب البرنامج.</li><li>تواصل مباشر وسهل عبر واتساب.</li></ul></article></div></section>
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8"><div className="text-center"><p className="saudi-eyebrow justify-center">ابدأ بخطوات بسيطة</p><h2 className="mt-4 text-3xl font-bold">كيف تبدأ؟</h2></div><ol className="mx-auto mt-10 grid max-w-2xl gap-4">{["اختر البرنامج والباقـة المناسبة.", "اضغط على جرب حصة مجانا.", "أرسل بيانات الطالب والوقت المناسب عبر واتساب.", "ننسق معك موعد الحصة التجريبية."].map((step, index) => <li key={step} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{index + 1}</span><span className="font-semibold">{step}</span></li>)}</ol></section>
    <section className="px-5 py-20 text-center sm:px-8"><div className="mx-auto max-w-3xl rounded-2xl bg-primary px-6 py-12 text-primary-foreground shadow-xl"><h2 className="text-3xl font-bold sm:text-4xl">ابدأ الآن بحصة تجريبية مجانية</h2><p className="mt-4 text-primary-foreground/80">أرسل لنا بيانات الطالب والوقت المناسب، وسنساعدك في اختيار البرنامج الأفضل.</p><a className="saudi-secondary-cta mt-8 bg-primary-foreground text-primary" href={areaTrialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> جرب حصة مجانا</a></div></section>
    <footer className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr]"><div><div className="flex items-center gap-3"><Image src="/logo.png" alt="شعار أكاديمية الحافظ المتميز" width={48} height={48} className="size-12 rounded-lg bg-secondary object-contain" /><div><p className="font-bold">أكاديمية الحافظ المتميز</p><p className="mt-1 text-sm text-primary-foreground/70">تحفيظ القرآن وتأسيس اللغة العربية أونلاين في السعودية</p></div></div><p className="mt-4 max-w-md text-sm leading-7 text-primary-foreground/75">حصص فردية مرنة للقرآن الكريم واللغة العربية للطلاب والطالبات من جميع مدن السعودية.</p></div><nav aria-label="روابط صفحة السعودية" className="grid content-start gap-x-6 gap-y-3 text-sm text-primary-foreground/90 sm:grid-cols-2"><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/teachers">المعلمين والمعلمات</Link><Link href="/blog">المدونة</Link><Link href="/privacy-policy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link><Link href="/refund-policy">سياسة الاسترداد</Link></nav><CountryPagesSection /></div><div className="border-t border-primary-foreground/10 px-5 py-5 text-center text-xs text-primary-foreground/65 sm:px-8">© {new Date().getFullYear()} أكاديمية الحافظ المتميز. جميع الحقوق محفوظة.</div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: (faqItems.length ? faqItems : [...faqGroupsByProgram.quran.flat(1), ...faqGroupsByProgram.arabic.flat(1)]).map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }) }} />
  </main>
}
