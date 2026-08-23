import type { Metadata } from "next"
import Link from "next/link"
import { Check, ChevronLeft, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react"
import { LandingPageVideoStrip } from "@/components/LandingPageVideoStrip"
import { getUnitedStatesWhatsAppUrl, unitedStatesLandingConfig, type UnitedStatesPlan, type UnitedStatesProgram } from "@/lib/united-states-landing-config"
import { CountryPagesSection } from "@/components/layout/country-pages-section"

export const metadata: Metadata = {
  title: unitedStatesLandingConfig.seo.title,
  description: unitedStatesLandingConfig.seo.description,
  alternates: { canonical: unitedStatesLandingConfig.seo.canonical },
  openGraph: { title: unitedStatesLandingConfig.seo.title, description: unitedStatesLandingConfig.seo.description, url: unitedStatesLandingConfig.seo.canonical, locale: "ar_US", type: "website" },
  twitter: { card: "summary_large_image", title: unitedStatesLandingConfig.seo.title, description: unitedStatesLandingConfig.seo.description },
}

const faq = [
  ["هل الحصة التجريبية الأولى مجانية؟", "نعم، الحصة التجريبية الأولى مجانية، ونتعرف خلالها على مستوى الطالب واحتياجه والموعد الأنسب له قبل اختيار الباقة."],
  ["هل الحصص مناسبة للأطفال في أمريكا؟", "نعم، الحصص الفردية مناسبة للأطفال والشباب والطلاب، مع محتوى ومدة يتناسبان مع العمر والمستوى."],
  ["هل يبدأ طالب العربية من الحروف أم يمكن تقييم مستواه أولاً؟", "نبدأ بتقييم بسيط لمستوى الطالب، ثم نبني خطة مناسبة؛ يمكن البدء من الحروف أو الانتقال إلى مهارات القراءة والكتابة المتقدمة."],
  ["هل يناسب تأسيس العربية الأطفال والبالغين من الناطقين بالعربية؟", "نعم، البرنامج مناسب للأطفال والبالغين من الناطقين بالعربية، ويُكيّف المحتوى حسب العمر والهدف والمستوى."],
  ["هل تشمل حصة العربية القراءة والكتابة والنطق؟", "نعم، تشمل الحصة المهارات التي يحتاجها الطالب من القراءة والكتابة والإملاء والنطق والفهم، وفق خطة فردية."],
  ["هل يمكن اختيار معلم أو معلمة ووقت مناسب؟", "نعم، اذكر تفضيلك والوقت المناسب عند التواصل عبر واتساب، وسننسق حسب البرنامج والتوفر وتوقيت ولايتك."],
  ["هل تحفيظ القرآن مناسب للمبتدئ؟", "نعم، نبدأ مع الطالب من المستوى المناسب له، مع الحفظ الجديد والتسميع وتصحيح التلاوة والتجويد والمراجعة."],
  ["هل يوجد خصم للإخوة؟", "نعم، يوجد خصم خاص عند تسجيل الإخوة معاً، ويمكن معرفة التفاصيل عند التواصل."],
  ["هل الأسعار شهرية؟", "نعم، جميع الأسعار المعروضة بالدولار الأمريكي وشهرية، وتختلف حسب مدة الحصة وعدد الحصص."],
  ["هل يمكن تغيير الموعد بالتنسيق المسبق؟", "نعم، يمكن طلب تغيير الموعد بالتنسيق المسبق، ونبحث عن وقت مناسب متاح للطالب والمعلم."],
] as const

function PlanCard({ plan }: { plan: UnitedStatesPlan }) {
  return <article className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
    {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
    <p className="text-sm font-semibold text-muted-foreground">{plan.program === "quran" ? "تحفيظ القرآن للناطقين بالعربية" : "تأسيس العربية للناطقين بالعربية"}</p>
    <h3 className="mt-2 text-xl font-bold text-foreground">{plan.duration} دقيقة للحصة</h3>
    <div className="mt-6 flex items-end gap-2"><strong className="text-4xl font-bold text-primary">${plan.price}</strong><span className="pb-1 text-sm font-semibold text-muted-foreground">شهرياً</span></div>
    <p className="mt-2 text-sm text-muted-foreground">{plan.monthlySessions} حصص شهرياً، {plan.weeklySessions} {plan.weeklySessions === 1 ? "حصة" : "حصص"} أسبوعياً</p>
    <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
    <ul className="mt-5 grid gap-3 border-t border-border pt-5 text-sm text-foreground">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}</ul>
    <a className="saudi-plan-cta mt-7" href={getUnitedStatesWhatsAppUrl(plan)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> احجز هذه الباقة عبر واتساب</a>
  </article>
}

function Plans({ program, title, description }: { program: UnitedStatesProgram; title: string; description: string }) {
  const plans = unitedStatesLandingConfig.plans.filter((plan) => plan.program === program)
  return <section className="mt-16" aria-labelledby={`${program}-plans`}><h2 id={`${program}-plans`} className="text-center text-3xl font-bold text-foreground">{title}</h2><p className="mx-auto mt-4 max-w-3xl text-center leading-8 text-muted-foreground">{description}</p>{([30, 40, 60] as const).map((duration, index) => <div key={duration}><h3 className="mt-12 text-center text-xl font-bold text-primary">{duration} دقيقة للحصة</h3><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{plans.filter((plan) => plan.duration === duration).map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div><div className="saudi-reveal my-8 rounded-2xl border border-border bg-secondary/50 p-5 text-center font-semibold text-muted-foreground">{program === "arabic" && index === 2 ? "تأسيس متدرج يساعد الطالب على القراءة والفهم والتعبير بالعربية." : ["إيقاع مرن لبداية رحلة الحفظ.", "وقت أطول للتسميع والتصحيح والمراجعة.", "اختيار مناسب لمن يريد الجمع بين الحفظ والمراجعة."][index]}</div></div>)}</section>
}

export default function UnitedStatesPage() {
  const trialUrl = getUnitedStatesWhatsAppUrl("حصة تجريبية مجانية")
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }
  return <main dir="rtl" className="min-h-screen overflow-hidden bg-background">
    <header className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8"><Link href="/" className="font-bold">أكاديمية الحافظ المتميز</Link><div className="flex items-center gap-3"><span className="text-2xl" role="img" aria-label="الولايات المتحدة">🇺🇸</span><a className="saudi-secondary-cta bg-primary-foreground px-3 py-2 text-sm text-primary" href={trialUrl} target="_blank" rel="noreferrer">احجز حصتك التجريبية</a></div></div></header>
    <section className="saudi-hero relative islamic-pattern text-center"><div className="saudi-flag-badge" aria-label="خدمة للعائلات العربية في أمريكا"><span aria-hidden="true">🇺🇸</span></div><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28"><p className="saudi-eyebrow justify-center"><Sparkles size={16} /> Online Quran Classes for Arabic-Speaking Families in the USA</p><h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">تحفيظ القرآن وتأسيس العربية أونلاين للعائلات العربية في الولايات المتحدة</h1><p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">أول حصة تجريبية مجانية، مع حصص فردية للأطفال والشباب والبالغين ومواعيد مرنة تناسب الأسر العربية في أمريكا.</p><div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2 text-sm font-bold"><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">أول حصة تجريبية مجانية</span><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">خصم خاص للإخوة</span><span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">مواعيد مرنة</span></div><div className="mt-8 flex flex-wrap justify-center gap-3"><a className="saudi-primary-cta" href={trialUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> احجز حصتك التجريبية المجانية</a><a className="saudi-secondary-cta" href="#plans">استعرض الباقات <ChevronLeft size={18} /></a></div></div></section>
    <LandingPageVideoStrip />
    <section className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4"><div className="saudi-proof"><ShieldCheck size={20} /><span>معلمون ومعلمات</span></div><div className="saudi-proof"><Clock3 size={20} /><span>مواعيد تناسب توقيت أمريكا</span></div><div className="saudi-proof"><MapPin size={20} /><span>حصص فردية أونلاين</span></div><div className="saudi-proof"><MessageCircle size={20} /><span>تواصل مباشر عبر واتساب</span></div></section>
    <section id="plans" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24"><Plans program="quran" title="باقات تحفيظ القرآن للناطقين بالعربية" description="باقات شهرية بالدولار الأمريكي لحصص فردية في الحفظ والتسميع والتجويد والمراجعة." /><Plans program="arabic" title="باقات تأسيس اللغة العربية للناطقين بالعربية" description="مناسبة للأطفال والشباب والطلاب الذين يحتاجون إلى تأسيس القراءة والكتابة والنطق والفهم باللغة العربية، مع حصص فردية مباشرة أونلاين." /></section>
    <section className="bg-secondary/40 px-5 py-16 sm:px-8"><div className="mx-auto max-w-4xl text-center"><h2 className="text-3xl font-bold">تعليم أونلاين من أي مدينة في أمريكا</h2><p className="mt-5 leading-8 text-muted-foreground">نخدم العائلات العربية في نيويورك ونيوجيرسي وواشنطن وفيلادلفيا وبوسطن وديترويت وشيكاغو وهيوستن ودالاس وأورلاندو وأتلانتا ولوس أنجلوس وسان فرانسيسكو وفلوريدا، من دون الحاجة إلى فرع محلي.</p></div></section>
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><h2 className="text-center text-3xl font-bold">الأسئلة الشائعة</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{faq.map(([question, answer]) => <details key={question} className="rounded-xl border border-border bg-card p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}</div></section>
    <footer className="bg-primary px-5 py-10 text-primary-foreground"><div className="mx-auto max-w-6xl"><CountryPagesSection /><nav className="mt-4 flex flex-wrap gap-4 text-sm"><Link href="/">الرئيسية</Link><Link href="/saudi-arabia">تحفيظ القرآن واللغة العربية في السعودية</Link><Link href="/united-arab-emirates">تحفيظ القرآن واللغة العربية في الإمارات</Link></nav><div className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/games">الألعاب والمسابقات</Link><Link href="/library">المكتبة</Link><Link href="/teachers">المعلمون والمعلمات</Link><Link href="/blog">المدونة</Link><Link href="/privacy-policy">سياسة الخصوصية</Link><Link href="/terms">شروط الاستخدام</Link><Link href="/refund-policy">سياسة الاسترداد</Link></div></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>
}
