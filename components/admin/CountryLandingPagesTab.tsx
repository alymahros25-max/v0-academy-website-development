"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, ExternalLink, Loader2, MapPin, Save } from "lucide-react"

type Area = {
  id: number
  slug: string
  area_type: "global" | "country"
  country_code: string | null
  name_ar: string
  name_en: string | null
  currency_code: string | null
  currency_symbol: string | null
  is_active: boolean
}

type AreaRecord = {
  id: number
  area_id: number
  is_active: boolean
  sort_order: number
  [key: string]: unknown
}

type AreaResponse = {
  areas: Area[]
  content: AreaRecord[]
  packages: AreaRecord[]
  faq: AreaRecord[]
  links: AreaRecord[]
}

type Resource = "content" | "packages" | "faq" | "links"

const fallbackAreas: Area[] = [
  { id: 0, slug: "global", area_type: "global", country_code: null, name_ar: "الموقع الرئيسي", name_en: "Main site", currency_code: "USD", currency_symbol: "$", is_active: true },
  { id: 0, slug: "saudi-arabia", area_type: "country", country_code: "SA", name_ar: "السعودية", name_en: "Saudi Arabia", currency_code: "SAR", currency_symbol: "ر.س", is_active: true },
  { id: 0, slug: "united-arab-emirates", area_type: "country", country_code: "AE", name_ar: "الإمارات", name_en: "United Arab Emirates", currency_code: "AED", currency_symbol: "د.إ", is_active: true },
  { id: 0, slug: "united-states", area_type: "country", country_code: "US", name_ar: "الولايات المتحدة", name_en: "United States", currency_code: "USD", currency_symbol: "$", is_active: true },
  { id: 0, slug: "canada", area_type: "country", country_code: "CA", name_ar: "كندا", name_en: "Canada", currency_code: "CAD", currency_symbol: "C$", is_active: true },
  { id: 0, slug: "united-kingdom", area_type: "country", country_code: "GB", name_ar: "المملكة المتحدة", name_en: "United Kingdom", currency_code: "GBP", currency_symbol: "£", is_active: true },
  { id: 0, slug: "australia", area_type: "country", country_code: "AU", name_ar: "أستراليا", name_en: "Australia", currency_code: "AUD", currency_symbol: "A$", is_active: true },
  { id: 0, slug: "germany", area_type: "country", country_code: "DE", name_ar: "ألمانيا", name_en: "Germany", currency_code: "EUR", currency_symbol: "€", is_active: true },
]

const labels: Record<Resource, string> = { content: "المحتوى", packages: "الباقات", faq: "الأسئلة", links: "الروابط" }

function recordTitle(resource: Resource, record: AreaRecord) {
  if (resource === "faq") return String(record.question_ar ?? "سؤال بدون عنوان")
  if (resource === "packages") return String(record.name_ar ?? record.package_key ?? "باقة بدون عنوان")
  if (resource === "content") return String(record.content_key ?? "محتوى")
  return String(record.label_ar ?? record.link_key ?? "رابط")
}

function textValue(record: AreaRecord, key: string) {
  return typeof record[key] === "string" ? String(record[key]) : ""
}

function AreaRecordEditor({ resource, record, onSave }: { resource: Resource; record: AreaRecord; onSave: (resource: Resource, id: number, changes: Record<string, unknown>) => Promise<void> }) {
  const [question, setQuestion] = useState(textValue(record, "question_ar"))
  const [answer, setAnswer] = useState(textValue(record, "answer_ar"))
  const [name, setName] = useState(textValue(record, "name_ar"))
  const [price, setPrice] = useState(String(record.price ?? ""))
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const changes = resource === "faq"
        ? { question_ar: question, answer_ar: answer }
        : resource === "packages"
          ? { name_ar: name, price: Number(price) }
          : resource === "content"
            ? { content_ar: question }
            : { label_ar: question, href: answer }
      await onSave(resource, record.id, changes)
    } finally {
      setSaving(false)
    }
  }

  return <div className="mt-3 grid gap-2 rounded-xl bg-muted/30 p-3">
    {(resource === "faq" || resource === "content" || resource === "links") && <input value={question} onChange={(event) => setQuestion(event.target.value)} aria-label={resource === "faq" ? "السؤال" : "العنوان"} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />}
    {resource === "packages" && <input value={name} onChange={(event) => setName(event.target.value)} aria-label="اسم الباقة" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />}
    {resource === "packages" && <input value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="0" step="0.01" aria-label="السعر" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />}
    {(resource === "faq" || resource === "links") && <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} aria-label={resource === "faq" ? "الإجابة" : "الرابط"} className="min-h-20 rounded-lg border border-border bg-background px-3 py-2 text-sm" />}
    {resource === "content" && <textarea value={question} onChange={(event) => setQuestion(event.target.value)} aria-label="المحتوى" className="min-h-20 rounded-lg border border-border bg-background px-3 py-2 text-sm" />}
    <button type="button" onClick={save} disabled={saving} className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Save className="size-4" />{saving ? "جارٍ الحفظ" : "حفظ التعديل"}</button>
  </div>
}

export function CountryLandingPagesTab() {
  const [data, setData] = useState<AreaResponse>({ areas: [], content: [], packages: [], faq: [], links: [] })
  const [selectedSlug, setSelectedSlug] = useState("global")
  const [resource, setResource] = useState<Resource>("packages")
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/areas", { credentials: "include", cache: "no-store" })
      const body = await response.json() as AreaResponse & { error?: string }
      if (!response.ok) throw new Error(body.error || "تعذر تحميل بيانات المناطق")
      setData(body)
      setError("")
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تعذر تحميل بيانات المناطق")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const areas = data.areas.length ? data.areas : fallbackAreas
  const selectedArea = areas.find((area) => area.slug === selectedSlug) ?? areas[0]
  const records = selectedArea && selectedArea.id > 0 ? data[resource].filter((record) => record.area_id === selectedArea.id) : []
  const counts = useMemo(() => selectedArea ? {
    content: data.content.filter((record) => record.area_id === selectedArea.id).length,
    packages: data.packages.filter((record) => record.area_id === selectedArea.id).length,
    faq: data.faq.filter((record) => record.area_id === selectedArea.id).length,
    links: data.links.filter((record) => record.area_id === selectedArea.id).length,
  } : { content: 0, packages: 0, faq: 0, links: 0 }, [data, selectedArea])

  async function updateRecord(recordResource: Resource, id: number, changes: Record<string, unknown>) {
    const response = await fetch("/api/admin/areas", { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource: recordResource, id, changes }) })
    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { error?: string }
      throw new Error(body.error || "تعذر حفظ التعديل")
    }
    await load()
  }

  async function toggleRecord(record: AreaRecord) {
    await updateRecord(resource, record.id, { is_active: !record.is_active })
  }

  return <section className="grid gap-6">
    <button type="button" aria-expanded={open} aria-controls="country-admin-list" onClick={() => setOpen((value) => !value)} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-right shadow-sm">
      <span><span className="text-sm font-semibold text-primary">إدارة المحتوى حسب الكيان</span><span className="mt-2 block text-2xl font-bold text-foreground">صفحات الموقع والمناطق</span><span className="mt-2 block text-muted-foreground">كل دولة والموقع الرئيسي له سجل مستقل للباقات والأسئلة والمحتوى والروابط، ولا يمكن للواجهة اختيار بيانات كيان آخر.</span></span>
      <span aria-hidden="true" className={`text-2xl transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}>⌄</span>
    </button>
    <div id="country-admin-list" hidden={!open} className="grid gap-4">
      {loading && <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> جارٍ تحميل الكيانات من Supabase</div>}
      {error && <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      <div className="grid gap-4 md:grid-cols-4">
        {areas.map((area) => <article key={area.slug} className={`rounded-2xl border bg-card p-5 shadow-sm ${selectedArea?.slug === area.slug ? "border-primary" : "border-border"}`}>
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="text-2xl" role="img" aria-label={area.name_ar}>{area.area_type === "global" ? "🌐" : "📍"}</span><div><h3 className="font-bold text-foreground">{area.name_ar}</h3><p className="text-xs text-muted-foreground">{area.name_en}</p></div></div><MapPin className="size-5 text-primary" aria-hidden="true" /></div>
          <p className="mt-3 text-xs text-muted-foreground">{area.currency_code} {area.currency_symbol ?? ""} · {area.area_type === "global" ? "بيانات الموقع الرئيسي" : "كيان دولة مستقل"}</p>
          <div className="mt-4 grid grid-cols-4 gap-1 text-center text-[11px] text-muted-foreground">{(["content", "packages", "faq", "links"] as Resource[]).map((key) => <span key={key} className="rounded bg-muted px-1 py-1">{labels[key]}<strong className="block text-foreground">{area.id > 0 ? ({ content: data.content, packages: data.packages, faq: data.faq, links: data.links }[key].filter((record) => record.area_id === area.id).length) : 0}</strong></span>)}</div>
          <div className="mt-5 flex gap-2"><Link href={`/${area.slug === "global" ? "" : area.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"><ExternalLink className="size-4" /> معاينة</Link><button type="button" onClick={() => { setSelectedSlug(area.slug); setResource("packages") }} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">إدارة</button></div>
        </article>)}
      </div>
      {selectedArea && <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-primary">الكيان المحدد</p><h3 className="text-2xl font-bold text-foreground">{selectedArea.name_ar}</h3><p className="text-sm text-muted-foreground">{selectedArea.slug} · {counts.packages} باقة · {counts.faq} سؤال</p></div><button type="button" onClick={() => void load()} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"><Check className="mr-1 inline size-4" /> تحديث</button></div><div className="mt-5 flex flex-wrap gap-2">{(Object.keys(labels) as Resource[]).map((key) => <button key={key} type="button" onClick={() => setResource(key)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${resource === key ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}>{labels[key]} ({counts[key]})</button>)}</div><div className="mt-5 grid gap-3">{records.length ? records.map((record) => <div key={record.id} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-foreground">{recordTitle(resource, record)}</p><p className="mt-1 text-xs text-muted-foreground">ID: {record.id} · {record.is_active ? "نشط ويظهر للعامة" : "معطل"}</p></div><button type="button" onClick={() => void toggleRecord(record)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">{record.is_active ? "تعطيل" : "تفعيل"}</button></div><AreaRecordEditor resource={resource} record={record} onSave={updateRecord} /></div>) : <p className="rounded-xl bg-muted/30 p-5 text-sm text-muted-foreground">لا توجد سجلات لهذا القسم في الكيان المحدد.</p>}</div></div>}
    </div>
  </section>
}
