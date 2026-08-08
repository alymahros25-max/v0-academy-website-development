import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "المكتبة قيد الإعداد | أكاديمية الحافظ المتميز",
  description: "المكتبة التعليمية الجديدة قيد الإعداد وستتوفر قريباً.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function LibraryPlaceholderPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-32 text-foreground" dir="rtl">
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <span className="text-2xl" aria-hidden="true">ك</span>
        </div>
        <p className="text-sm font-semibold text-secondary">المكتبة التعليمية</p>
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          المكتبة الجديدة قيد الإعداد
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
          نعمل على تجهيز مكتبة جديدة لعرض الكتب التعليمية من Google Drive بطريقة منظمة وسهلة الاستخدام. ستتوفر الكتب قريباً.
        </p>
        <a
          href="/"
          className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          العودة إلى الصفحة الرئيسية
        </a>
      </section>
    </main>
  )
}
