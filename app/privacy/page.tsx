"use client"

import { useI18n } from "@/lib/i18n"

export default function PrivacyPage() {
  const { locale } = useI18n()

  const content = {
    ar: {
      title: "سياسة الخصوصية",
      lastUpdate: "آخر تحديث: يناير 2026",
      sections: [
        { title: "مقدمة", text: "نحن في أكاديمية الحافظ المتميز نلتزم بحماية خصوصية مستخدمينا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتكم الشخصية عند استخدام موقعنا الإلكتروني وخدماتنا التعليمية." },
        { title: "المعلومات التي نجمعها", text: "نجمع المعلومات التي تقدمونها طوعاً مثل: الاسم، البريد الإلكتروني، رقم الهاتف، وأي معلومات أخرى تقدمونها عبر نماذج الاتصال أو التسجيل. كما نجمع بيانات الاستخدام تلقائياً مثل عنوان IP ونوع المتصفح." },
        { title: "كيف نستخدم معلوماتكم", text: "نستخدم المعلومات لتقديم خدماتنا التعليمية، التواصل معكم بخصوص الحصص والاشتراكات، تحسين خدماتنا، وإرسال إشعارات مهمة تتعلق بحساباتكم." },
        { title: "حماية المعلومات", text: "نتخذ إجراءات أمنية مناسبة لحماية معلوماتكم الشخصية من الوصول غير المصرح به أو التعديل أو الكشف أو الإتلاف." },
        { title: "مشاركة المعلومات", text: "لا نبيع أو نتاجر أو ننقل معلوماتكم الشخصية لأطراف خارجية. قد نشارك المعلومات مع مقدمي الخدمات الموثوقين الذين يساعدوننا في تشغيل الموقع وتقديم الخدمة." },
        { title: "حقوقكم", text: "يحق لكم طلب الوصول إلى بياناتكم الشخصية أو تصحيحها أو حذفها. يمكنكم التواصل معنا عبر البريد الإلكتروني لممارسة هذه الحقوق." },
        { title: "تواصل معنا", text: "إذا كان لديكم أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: enamel311@gmail.com" },
      ],
    },
    en: {
      title: "Privacy Policy",
      lastUpdate: "Last updated: January 2026",
      sections: [
        { title: "Introduction", text: "At Al-Hafiz Al-Mutamayez Academy, we are committed to protecting the privacy of our users. This policy explains how we collect, use, and protect your personal information when using our website and educational services." },
        { title: "Information We Collect", text: "We collect information you voluntarily provide such as: name, email, phone number, and any other information you submit through contact or registration forms. We also automatically collect usage data such as IP address and browser type." },
        { title: "How We Use Your Information", text: "We use information to provide our educational services, communicate with you about sessions and subscriptions, improve our services, and send important notifications about your accounts." },
        { title: "Information Protection", text: "We take appropriate security measures to protect your personal information from unauthorized access, modification, disclosure, or destruction." },
        { title: "Information Sharing", text: "We do not sell, trade, or transfer your personal information to external parties. We may share information with trusted service providers who help us operate the website." },
        { title: "Your Rights", text: "You have the right to request access to, correction of, or deletion of your personal data. You can contact us via email to exercise these rights." },
        { title: "Contact Us", text: "If you have any questions about our privacy policy, please contact us at: enamel311@gmail.com" },
      ],
    },
    fr: {
      title: "Politique de confidentialite",
      lastUpdate: "Derniere mise a jour: Janvier 2026",
      sections: [
        { title: "Introduction", text: "A l'Academie Al-Hafiz Al-Mutamayez, nous nous engageons a proteger la vie privee de nos utilisateurs. Cette politique explique comment nous collectons, utilisons et protegeons vos informations personnelles." },
        { title: "Informations collectees", text: "Nous collectons les informations que vous fournissez volontairement: nom, email, numero de telephone. Nous collectons egalement automatiquement des donnees d'utilisation." },
        { title: "Utilisation des informations", text: "Nous utilisons les informations pour fournir nos services educatifs, communiquer avec vous et ameliorer nos services." },
        { title: "Protection des informations", text: "Nous prenons des mesures de securite appropriees pour proteger vos informations personnelles." },
        { title: "Partage des informations", text: "Nous ne vendons pas vos informations personnelles a des tiers." },
        { title: "Vos droits", text: "Vous avez le droit de demander l'acces, la correction ou la suppression de vos donnees personnelles." },
        { title: "Contactez-nous", text: "Pour toute question, contactez-nous a: enamel311@gmail.com" },
      ],
    },
  }

  const c = content[locale]

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">{c.title}</h1>
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
              {c.sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
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
