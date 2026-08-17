import type { Metadata } from "next"
import Link from "next/link"
import { Check, ChevronLeft, MessageCircle, ShieldCheck, Sparkles, Clock3 } from "lucide-react"
import SaudiLandingClient from "./saudi-landing-client"

export const metadata: Metadata = {
  title: "تحفيظ القرآن واللغة العربية أونلاين في السعودية | جرب حصة مجانية",
  description: "باقات تحفيظ القرآن وتأسيس اللغة العربية أونلاين للأطفال والشباب والكبار والنساء والرجال في السعودية، بأسعار بالريال وحصة تجريبية مجانية.",
  alternates: { canonical: "https://quran-elhafez.com/saudi-arabia" },
  openGraph: {
    title: "تحفيظ القرآن واللغة العربية أونلاين في السعودية | جرب حصة مجانية",
    description: "حصص مرنة لجميع الأعمار من أي مدينة داخل المملكة مع حصة تجريبية مجانية.",
    url: "https://quran-elhafez.com/saudi-arabia",
    locale: "ar_SA",
    type: "website",
  },
}

const whatsapp = "966500000000"
const plans = {
  quran: [
    { name: "الباقة الأساسية", sessions: 4, price: 150, popular: false },
    { name: "الباقة المتقدمة", sessions: 8, price: 280, popular: true },
    { name: "الباقة المكثفة", sessions: 12, price: 400, popular: false },
  ],
  arabic: [
    { name: "الباقة الأساسية", sessions: 4, price: 200, popular: false },
    { name: "الباقة المتقدمة", sessions: 8, price: 360, popular: true },
    { name: "الباقة المكثفة", sessions: 12, price: 500, popular: false },
  ],
}

function whatsappUrl(plan: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(`السلام عليكم، أرغب في تجربة حصة مجانا.\nالباقة: ${plan}\nاسم الطالب: \nالعمر والمستوى: \nالمدينة: \nالوقت المناسب:`)}`
}

function PlanCard({ plan, type }: { plan: (typeof plans.quran)[number]; type: string }) {
  return (
    <article className={`saudi-plan-card ${plan.popular ? "saudi-plan-card-featured" : ""}`}>
      {plan.popular && <span className="saudi-popular-badge"><Sparkles size={14} /> الأكثر طلباً</span>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{type}</p>
          <h3 className="mt-2 text-xl font-bold text-foreground">{plan.name}</h3>
        </div>
        <div className="rounded-full bg-secondary p-3 text-primary"><MessageCircle size={20} /></div>
      </div>
      <div className="mt-7 flex items-end gap-2">
        <strong className="text-4xl font-bold tracking-tight text-primary">{plan.price}</strong>
        <span className="pb-1 text-sm font-semibold text-muted-foreground">ريال / شهرياً</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{plan.sessions} حصص فردية أونلاين</p>
      <ul className="mt-6 grid gap-3 border-t border-border pt-5 text-sm text-foreground">
        {(type === "تحفيظ القرآن" ? ["معلمون مجازون", "حفظ وتجويد ومراجعة", "إشراف ومتابعة", "مرونة في اختيار الوقت"] : ["قراءة وكتابة بطرق حديثة", "معلمون متخصصون", "إملاء وتعبير", "إشراف ومتابعة"]).map((feature) => <li key={feature} className="flex items-center gap-2"><Check size={17} className="text-accent" />{feature}</li>)}
      </ul>
      <a className="saudi-plan-cta mt-7" href={whatsappUrl(`${type} — ${plan.name} (${plan.sessions} حصص)`)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> جرب حصة مجانا</a>
    </article>
  )
}

export default function SaudiArabiaPage() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-background">
      <section className="saudi-hero islamic-pattern">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="saudi-eyebrow"><Sparkles size={16} /> أكاديمية الحافظ المتميز في السعودية</p>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">تحفيظ القرآن وتأسيس اللغة العربية أونلاين في السعودية</h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">حصص مرنة لجميع الأعمار من أي مدينة داخل المملكة</p>
            <p className="mt-5 max-w-2xl text-pretty leading-8 text-muted-foreground">هل تبحث عن تحفيظ القرآن الكريم أو تأسيس اللغة العربية أونلاين لك أو لأحد أفراد أسرتك؟ تقدم أكاديمية الحافظ المتميز حصصاً عن بعد للرجال والنساء والأطفال والشباب والفتيات، من الرياض وجدة ومكة المكرمة والمدينة المنورة والدمام والخبر وجميع مدن ومناطق السعودية.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a className="saudi-primary-cta" href={whatsappUrl("طلب حصة تجريبية مجانية")} target="_blank" rel="noreferrer"><MessageCircle size={19} /> احجز حصة مجانية</a><a className="saudi-secondary-cta" href="#plans">استعرض الباقات <ChevronLeft size={18} /></a></div>
          </div>
          <div className="mt-14 grid max-w-3xl gap-3 sm:grid-cols-3"><div className="saudi-proof"><ShieldCheck size={20} /><span>معلمون ومعلمات متخصصون</span></div><div className="saudi-proof"><Clock3 size={20} /><span>مواعيد تناسبك</span></div><div className="saudi-proof"><MessageCircle size={20} /><span>تواصل مباشر عبر واتساب</span></div></div>
        </div>
      </section>
      <SaudiLandingClient />
      <section id="plans" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center"><p className="saudi-eyebrow justify-center">باقات مرنة بالريال السعودي</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">اختر البرنامج المناسب وابدأ من حصة مجانية</h2><p className="mt-4 leading-7 text-muted-foreground">الدراسة أونلاين بالكامل، ويمكن اختيار الباقة المناسبة حسب عمر الطالب ومستواه وعدد الحصص والوقت المناسب.</p></div>
        <div className="mt-12"><h3 className="mb-6 text-2xl font-bold">تحفيظ القرآن الكريم</h3><div className="grid gap-6 lg:grid-cols-3">{plans.quran.map((plan) => <PlanCard key={plan.name} plan={plan} type="تحفيظ القرآن" />)}</div></div>
        <div className="mt-16"><h3 className="mb-6 text-2xl font-bold">تأسيس اللغة العربية</h3><div className="grid gap-6 lg:grid-cols-3">{plans.arabic.map((plan) => <PlanCard key={plan.name} plan={plan} type="تأسيس اللغة العربية" />)}</div></div>
      </section>
      <footer className="border-t border-border bg-card"><div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><p className="font-bold">أكاديمية الحافظ المتميز</p><p className="mt-1 text-sm text-muted-foreground">تعليم القرآن واللغة العربية أونلاين</p></div><nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><Link href="/">الرئيسية</Link><Link href="/quran">تحفيظ القرآن</Link><Link href="/arabic">اللغة العربية</Link><Link href="/contact">تواصل معنا</Link></nav></div></footer>
    </main>
  )
}
