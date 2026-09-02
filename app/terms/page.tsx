"use client"

import { useI18n } from "@/lib/i18n"
import useSWR from "swr"
import ReactMarkdown from "react-markdown"

type PublicLegalPage = { title: string; content: string; updated_at: string }
const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((res) => res.json())

export default function TermsPage() {
  const { locale } = useI18n()
  const { data: dynamicPage } = useSWR<PublicLegalPage>(`/api/public/legal?slug=terms&locale=${locale}`, fetcher)

  const content = {
    ar: {
      title: "شروط الاستخدام",
      lastUpdate: "آخر تحديث: يناير 2026",
      sections: [
        { title: "القبول بالشروط", text: "باستخدام موقع أكاديمية الحافظ المتميز وخدماتها، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع." },
        { title: "الخدمات المقدمة", text: "توفر الأكاديمية خدمات تعليمية عبر الإنترنت تشمل تحفيظ القرآن الكريم وتعليم التجويد وتأسيس اللغة العربية من خلال حصص فردية مع معلمين مؤهلين." },
        { title: "الاشتراك والدفع", text: "يتم الاشتراك عن طريق اختيار الباقة المناسبة والتواصل معنا. الأسعار المعروضة بالدولار الأمريكي وقابلة للتغيير مع إشعار مسبق." },
        { title: "سياسة الإلغاء", text: "يمكن إلغاء الاشتراك في أي وقت. لا يتم استرداد المبالغ المدفوعة عن الحصص التي تم حضورها بالفعل. يتم استرداد المبلغ المتبقي عن الحصص التي لم تُعقد." },
        { title: "التزامات المستخدم", text: "يلتزم المستخدم بالحضور في الموعد المحدد، واحترام المعلم والتعامل بأدب، وتوفير بيئة تعليمية هادئة أثناء الحصة." },
        { title: "حقوق الملكية الفكرية", text: "جميع المحتويات والمواد التعليمية على الموقع هي ملكية حصرية لأكاديمية الحافظ المتميز ولا يجوز نسخها أو توزيعها دون إذن مسبق." },
        { title: "تحديد المسؤولية", text: "الأكاديمية غير مسؤولة عن أي أضرار ناتجة عن مشاكل تقنية أو انقطاع الإنترنت أثناء الحصص. نبذل قصارى جهدنا لتقديم أفضل خدمة ممكنة." },
        { title: "تعديل الشروط", text: "نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على الموقع." },
      ],
    },
    en: {
      title: "Terms of Use",
      lastUpdate: "Last updated: January 2026",
      sections: [
        { title: "Acceptance of Terms", text: "By using Al-Hafiz Al-Mutamayez Academy website and services, you agree to be bound by these terms and conditions. If you do not agree to any of these terms, please do not use the website." },
        { title: "Services Provided", text: "The academy provides online educational services including Quran memorization, Tajweed teaching, and Arabic language foundation through individual sessions with qualified teachers." },
        { title: "Subscription and Payment", text: "Subscription is done by choosing the appropriate package and contacting us. Prices are displayed in US Dollars and are subject to change with prior notice." },
        { title: "Cancellation Policy", text: "Subscription can be cancelled at any time. No refunds are given for sessions already attended. The remaining amount for unattended sessions will be refunded." },
        { title: "User Obligations", text: "Users are expected to attend sessions on time, respect teachers, and provide a quiet learning environment during sessions." },
        { title: "Intellectual Property", text: "All content and educational materials on the website are the exclusive property of Al-Hafiz Al-Mutamayez Academy and may not be copied or distributed without prior permission." },
        { title: "Limitation of Liability", text: "The academy is not responsible for any damages resulting from technical issues or internet disconnection during sessions." },
        { title: "Modification of Terms", text: "We reserve the right to modify these terms at any time. Users will be notified of any material changes via email or website notification." },
      ],
    },
    fr: {
      title: "Conditions d'utilisation",
      lastUpdate: "Derniere mise a jour: Janvier 2026",
      sections: [
        { title: "Acceptation des conditions", text: "En utilisant le site de l'Academie Al-Hafiz Al-Mutamayez, vous acceptez d'etre lie par ces conditions." },
        { title: "Services fournis", text: "L'academie fournit des services educatifs en ligne incluant la memorisation du Coran, l'enseignement du Tajweed et les fondations de la langue arabe." },
        { title: "Abonnement et paiement", text: "L'abonnement se fait en choisissant le forfait approprie. Les prix sont affiches en dollars americains." },
        { title: "Politique d'annulation", text: "L'abonnement peut etre annule a tout moment. Aucun remboursement pour les sessions deja suivies." },
        { title: "Obligations de l'utilisateur", text: "Les utilisateurs doivent assister aux sessions a l'heure et respecter les enseignants." },
        { title: "Propriete intellectuelle", text: "Tout le contenu du site est la propriete exclusive de l'Academie." },
        { title: "Limitation de responsabilite", text: "L'academie n'est pas responsable des dommages resultant de problemes techniques." },
        { title: "Modification des conditions", text: "Nous nous reservons le droit de modifier ces conditions a tout moment." },
      ],
    },
  }

  const c = content[locale]
  const displayTitle = dynamicPage?.title || c.title

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">{displayTitle}</h1>
          <p className="text-primary-foreground/60">{c.lastUpdate}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-card rounded-2xl p-6 lg:p-10 shadow-lg border border-border">
            <div className="flex flex-col gap-8">
              {dynamicPage?.content ? (
                <div className="prose prose-slate max-w-none dark:prose-invert"><ReactMarkdown>{dynamicPage.content}</ReactMarkdown></div>
              ) : c.sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-xl font-bold text-foreground mb-3">{idx + 1}. {section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
