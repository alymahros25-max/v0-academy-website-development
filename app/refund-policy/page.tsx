import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { getLegalPage } from '@/lib/legal-service'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'سياسة الاسترداد | أكاديمية الحافظ المتميز',
    description: 'سياسة واضحة وشفافة لاسترجاع الأموال من الدورات المدفوعة والجلسات المباشرة',
    openGraph: {
      title: 'سياسة الاسترداد',
      description: 'سياسة الاسترجاع الكاملة والشروط والأحكام',
      type: 'website',
    },
  }
}

export default async function RefundPolicyPage() {
  // Default to Arabic - can be extended with locale detection
  let page = await getLegalPage('refund-policy', 'ar')

  // Fallback content if database is not configured
  if (!page) {
    page = {
      id: 'fallback-refund-ar',
      page_slug: 'refund-policy',
      locale: 'ar',
      title: 'سياسة الاسترداد',
      content: `# سياسة الاسترداد والاسترجاع

أهلا وسهلا بك في أكاديمية الحافظ المتميز. نحن ملتزمون بتوفير أفضل خدمة تعليمية لك. تعرف على سياسة الاسترداد الخاصة بنا.

## 1. البرامج التعليمية الرقمية المدفوعة (الفيديوهات التعليمية المسجلة رقمياً)

- **مدة الاسترداد الرقمي**: 7 أيام من تاريخ الشراء فقط
- **شرط الاسترجاع**: يمكنك استرجاع المبلغ فقط إذا شاهدت أقل من 10% من محتوى البرنامج التعليمي الرقمي
- **بعد 7 أيام**: لا يمكن استرجاع المبلغ بأي حال من الأحوال
- **معالجة الاسترجاع الرقمي**: يتم معالجة الاسترجاع الرقمي تلقائياً إلى طريقة الدفع الأصلية في 5-10 أيام عمل

## 2. الجلسات المباشرة (Live Sessions)

- **مدة الاسترداد**: قبل 24 ساعة من موعد الجلسة فقط
- **بدون عذر**: إذا ألغيت الجلسة أو تغيبت في آخر لحظة، لا استرجاع
- **الجلسة المكتملة**: لا يمكن استرجاع المبلغ بعد بدء الجلسة
- **إعادة جدولة**: يمكنك طلب تأجيل الجلسة بدلاً من الاسترجاع

## 3. المحتوى الرقمي المجاني (المكتبة الرقمية والألعاب التعليمية الإلكترونية)

- **بدون رسوم**: جميع محتويات المكتبة الرقمية والألعاب التعليمية الإلكترونية مجانية تماماً - وصول فوري
- **حقوق الملكية**: محمية بموجب القانون ولا يمكن تحميلها أو نسخها
- **الاستخدام الرقمي**: للاستخدام داخل الموقع والتطبيق فقط عبر الإنترنت
- **بدون استرجاع**: لا توجد رسوم لاسترجاعها لأنها محتوى رقمي مجاني

## 4. رسوم البوابة والمعالجة

- **غير مسترجعة**: رسوم معالجة البطاقة التي تفرضها البنوك غير مسترجعة
- **الخصم**: سيتم خصم هذه الرسوم من مبلغ الاسترجاع الموافق عليه
- **شفافة**: سنخبرك بالمبلغ النهائي قبل معالجة الاسترجاع

## 5. طلب الاسترجاع

- **التواصل**: أرسل بريداً إلى enamel311@gmail.com مع تفاصيل الطلب
- **الموافقة**: سنراجع الطلب ونرسل لك الموافقة خلال 48 ساعة
- **المعالجة**: بعد الموافقة، سيصل المبلغ في 5-10 أيام عمل

## 6. استثناءات

قد لا نوافق على الاسترجاع في الحالات التالية:
- شاهدت أكثر من 10% من محتوى الدورة
- تجاوزت مدة الـ 7 أيام
- ألغيت جلسة مباشرة بعد 24 ساعة من موعدها
- الطلب يحتوي على معلومات مشبوهة

## 7. التواصل معنا

للأسئلة والاستفسارات:
- البريد: enamel311@gmail.com
- واتساب: تواصل عبر الزر أسفل الصفحة
- تليجرام: @academy_quraan`,
      updated_at: new Date().toISOString(),
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">{page.title}</h1>
          <p className="text-muted-foreground mt-2">
            سياسة واضحة وشفافة لحقوقك كمستخدم
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="text-foreground leading-relaxed mb-4" {...props} />,
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-foreground" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground" {...props} />
              ),
              li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
              a: ({ node, href, ...props }) => (
                <Link href={href || '#'} className="text-primary hover:underline" {...props} />
              ),
            }}
          >
            {page.content}
          </ReactMarkdown>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/terms"
            className="p-4 rounded-lg border hover:border-primary transition-all hover:bg-primary/5"
          >
            <h3 className="font-bold">الشروط والأحكام</h3>
            <p className="text-sm text-muted-foreground mt-1">اقرأ شروط الاستخدام</p>
          </Link>
          <Link
            href="/privacy"
            className="p-4 rounded-lg border hover:border-primary transition-all hover:bg-primary/5"
          >
            <h3 className="font-bold">سياسة الخصوصية</h3>
            <p className="text-sm text-muted-foreground mt-1">كيف نحافظ على بيانات</p>
          </Link>
          <a
            href="https://bit.ly/4aJfOl6"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg border hover:border-primary transition-all hover:bg-primary/5"
          >
            <h3 className="font-bold">تواصل معنا</h3>
            <p className="text-sm text-muted-foreground mt-1">لديك سؤال؟ نحن هنا</p>
          </a>
        </div>
      </div>
    </main>
  )
}
