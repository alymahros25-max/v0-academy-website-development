"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, MapPin } from "lucide-react"

const pages = [
  ["السعودية", "Saudi Arabia", "/saudi-arabia", "🇸🇦"],
  ["الإمارات", "United Arab Emirates", "/united-arab-emirates", "🇦🇪"],
  ["الولايات المتحدة", "United States", "/united-states", "🇺🇸"],
  ["كندا", "Canada", "/canada", "🇨🇦"],
  ["المملكة المتحدة", "United Kingdom", "/united-kingdom", "🇬🇧"],
] as const

export function CountryLandingPagesTab() {
  const [open, setOpen] = useState(true)
  return <section className="grid gap-6">
    <button type="button" aria-expanded={open} aria-controls="country-admin-list" onClick={() => setOpen((value) => !value)} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-right shadow-sm">
      <span><span className="text-sm font-semibold text-primary">إدارة المحتوى حسب الدولة</span><span className="mt-2 block text-2xl font-bold text-foreground">صفحاتنا حسب الدولة</span><span className="mt-2 block text-muted-foreground">اختر صفحة لإدارة بنيتها الحالية. يمكن توسيع كل قسم لاحقاً لإدارة العناوين والباقات والأسئلة والفيديوهات ورسالة واتساب.</span></span>
      <span aria-hidden="true" className={`text-2xl transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}>⌄</span>
    </button>
    <div id="country-admin-list" hidden={!open} className="grid gap-4 md:grid-cols-4">
      {pages.map(([label, english, href, flag]) => <article key={href} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="text-2xl" role="img" aria-label={label}>{flag}</span><div><h3 className="font-bold text-foreground">صفحة {label}</h3><p className="text-xs text-muted-foreground">{english}</p></div></div><MapPin className="size-5 text-primary" aria-hidden="true" /></div><div className="mt-5 flex gap-2"><Link href={href} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"><ExternalLink className="size-4" /> معاينة</Link><button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">إدارة المحتوى</button></div></article>)}
    </div>
  </section>
}
