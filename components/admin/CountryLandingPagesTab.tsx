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
  themes: AreaRecord[]
  cities: AreaRecord[]
  timezones: AreaRecord[]
}

type Resource = "themes" | "cities" | "timezones" | "content" | "packages" | "faq" | "links"

const emptyResponse: AreaResponse = { areas: [], content: [], packages: [], faq: [], links: [], themes: [], cities: [], timezones: [] }

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

const labels: Record<Resource, string> = {
  themes: "الهوية",
  cities: "المدن",
  timezones: "التوقيت",
  content: "المحتوى",
  packages: "الباقات",
  faq: "الأسئلة",
  links: "الروابط",
}

function recordTitle(resource: Resource, record: AreaRecord) {
  if (resource === "themes") return String(record.theme_name_ar ?? "هوية بدون عنوان")
  if (resource === "cities") return String(record.name_ar ?? record.city_key ?? "مدينة")
  if (resource === "timezones") return String(record.label_ar ?? record.timezone_name ?? "منطقة زمنية")
  if (resource === "faq") return String(record.question_ar ?? "سؤال بدون عنوان")
  if (resource === "packages") return String(record.name_ar ?? record.package_key ?? "باقة بدون عنوان")
  if (resource === "content") return String(record.content_key ?? "محتوى")
  return String(record.label_ar ?? record.link_key ?? "رابط")
}

function stringValue(record: AreaRecord, key: string) {
  return typeof record[key] === "string" ? String(record[key]) : ""
}

function EditorInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "number" | "color" }) {
  return <label className="grid gap-1 text-sm"><span className="font-semibold text-foreground">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} className={`${type === "color" ? "h-11" : ""} rounded-lg border border-border bg-background px-3 py-2 text-sm`} /></label>
}

function AreaRecordEditor({ resource, record, onSave }: { resource: Resource; record: AreaRecord; onSave: (resource: Resource, id: number, changes: Record<string, unknown>) => Promise<void> }) {
  const [values, setValues] = useState<Record<string, string | boolean>>(() => Object.fromEntries(Object.entries(record).map(([key, value]) => [key, typeof value === "boolean" ? value : value == null ? "" : String(value)])))
  const [saving, setSaving] = useState(false)
  const setValue = (key: string, value: string | boolean) => setValues((current) => ({ ...current, [key]: value }))

  async function save() {
    setSaving(true)
    try {
      const changes = resource === "faq"
        ? { question_ar: values.question_ar, answer_ar: values.answer_ar }
        : resource === "packages"
          ? { name_ar: values.name_ar, price: Number(values.price) }
          : resource === "content"
            ? { content_ar: values.content_ar }
            : resource === "links"
              ? { label_ar: values.label_ar, href: values.href }
              : resource === "themes"
                ? { theme_name_ar: values.theme_name_ar, theme_name_en: values.theme_name_en, primary_color: values.primary_color, secondary_color: values.secondary_color, accent_color: values.accent_color, background_color: values.background_color, text_color: values.text_color, quran_fact_title_ar: values.quran_fact_title_ar, quran_fact_body_ar: values.quran_fact_body_ar, quran_fact_reference_ar: values.quran_fact_reference_ar }
                : resource === "cities"
                  ? { name_ar: values.name_ar, name_en: values.name_en, region_name: values.region_name }
                  : { timezone_name: values.timezone_name, label_ar: values.label_ar, label_en: values.label_en, is_primary: Boolean(values.is_primary) }
      await onSave(resource, record.id, changes)
    } finally {
      setSaving(false)
    }
  }

  return <div className="mt-3 grid gap-3 rounded-xl bg-muted/30 p-3">
    {resource === "themes" && <div className="grid gap-3 sm:grid-cols-2"><EditorInput label="اسم الهوية بالعربية (للاستخدام الإداري)" value={String(values.theme_name_ar ?? "")} onChange={(value) => setValue("theme_name_ar", value)} /><EditorInput label="اسم الهوية بالإنجليزية (للاستخدام الإداري)" value={String(values.theme_name_en ?? "")} onChange={(value) => setValue("theme_name_en", value)} /><label className="grid gap-1 text-sm sm:col-span-2"><span className="font-semibold text-foreground">عنوان المعلومة القرآنية</span><input value={String(values.quran_fact_title_ar ?? "")} onChange={(event) => setValue("quran_fact_title_ar", event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label><label className="grid gap-1 text-sm sm:col-span-2"><span className="font-semibold text-foreground">نص المعلومة القرآنية</span><textarea value={String(values.quran_fact_body_ar ?? "")} onChange={(event) => setValue("quran_fact_body_ar", event.target.value)} className="min-h-24 rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label><EditorInput label="مرجع السورة والآية" value={String(values.quran_fact_reference_ar ?? "")} onChange={(value) => setValue("quran_fact_reference_ar", value)} />{(["primary_color", "secondary_color", "accent_color", "background_color", "text_color"] as const).map((key) => <EditorInput key={key} type="color" label={{ primary_color: "اللون الأساسي", secondary_color: "اللون الثانوي", accent_color: "لون التمييز", background_color: "لون الخلفية", text_color: "لون النص" }[key]} value={String(values[key] || "#000000")} onChange={(value) => setValue(key, value)} />)}</div>}
    {resource === "cities" && <div className="grid gap-3 sm:grid-cols-3"><EditorInput label="اسم المدينة بالعربية" value={String(values.name_ar ?? "")} onChange={(value) => setValue("name_ar", value)} /><EditorInput label="اسم المدينة بالإنجليزية" value={String(values.name_en ?? "")} onChange={(value) => setValue("name_en", value)} /><EditorInput label="المنطقة أو المقاطعة" value={String(values.region_name ?? "")} onChange={(value) => setValue("region_name", value)} /></div>}
    {resource === "timezones" && <div className="grid gap-3 sm:grid-cols-3"><EditorInput label="IANA Timezone" value={String(values.timezone_name ?? "")} onChange={(value) => setValue("timezone_name", value)} /><EditorInput label="الاسم بالعربية" value={String(values.label_ar ?? "")} onChange={(value) => setValue("label_ar", value)} /><EditorInput label="الاسم بالإنجليزية" value={String(values.label_en ?? "")} onChange={(value) => setValue("label_en", value)} /><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(values.is_primary)} onChange={(event) => setValue("is_primary", event.target.checked)} /> المنطقة الزمنية الأساسية</label></div>}
    {resource === "faq" && <><EditorInput label="السؤال" value={String(values.question_ar ?? "")} onChange={(value) => setValue("question_ar", value)} /><label className="grid gap-1 text-sm"><span className="font-semibold">الإجابة</span><textarea value={String(values.answer_ar ?? "")} onChange={(event) => setValue("answer_ar", event.target.value)} className="min-h-20 rounded-lg border border-border bg-background px-3 py-2" /></label></>}
    {resource === "packages" && <div className="grid gap-3 sm:grid-cols-2"><EditorInput label="اسم الباقة" value={String(values.name_ar ?? "")} onChange={(value) => setValue("name_ar", value)} /><EditorInput type="number" label="السعر" value={String(values.price ?? "")} onChange={(value) => setValue("price", value)} /></div>}
    {resource === "content" && <label className="grid gap-1 text-sm"><span className="font-semibold">المحتوى</span><textarea value={String(values.content_ar ?? "")} onChange={(event) => setValue("content_ar", event.target.value)} className="min-h-20 rounded-lg border border-border bg-background px-3 py-2" /></label>}
    {resource === "links" && <div className="grid gap-3 sm:grid-cols-2"><EditorInput label="العنوان" value={String(values.label_ar ?? "")} onChange={(value) => setValue("label_ar", value)} /><EditorInput label="الرابط" value={String(values.href ?? "")} onChange={(value) => setValue("href", value)} /></div>}
    <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Save className="size-4" />{saving ? "جارٍ الحفظ" : "حفظ التعديل"}</button>
  </div>
}

export function CountryLandingPagesTab() {
  const [data, setData] = useState<AreaResponse>(emptyResponse)
  const [selectedSlug, setSelectedSlug] = useState("global")
  const [resource, setResource] = useState<Resource>("themes")
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/areas", { credentials: "include", cache: "no-store" })
      const body = await response.json() as Partial<AreaResponse> & { error?: string }
      if (!response.ok) throw new Error(body.error || "تعذر تحميل بيانات المناطق")
      setData({ ...emptyResponse, ...body, areas: body.areas ?? [] })
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
  const counts = useMemo(() => selectedArea ? Object.fromEntries((Object.keys(labels) as Resource[]).map((key) => [key, data[key].filter((record) => record.area_id === selectedArea.id).length])) as Record<Resource, number> : Object.fromEntries((Object.keys(labels) as Resource[]).map((key) => [key, 0])) as Record<Resource, number>, [data, selectedArea])

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
    <button type="button" aria-expanded={open} aria-controls="country-admin-list" onClick={() => setOpen((value) => !value)} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 text-right shadow-sm"><span><span className="text-sm font-semibold text-primary">إدارة المحتوى حسب الكيان</span><span className="mt-2 block text-2xl font-bold text-foreground">صفحات الموقع والمناطق</span><span className="mt-2 block text-muted-foreground">كل دولة لها هوية ومدن ومناطق زمنية وسجلات مستقلة، بالإضافة إلى الباقات والأسئلة والمحتوى والروابط.</span></span><span aria-hidden="true" className={`text-2xl transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}>⌄</span></button>
    <div id="country-admin-list" hidden={!open} className="grid gap-4">
      {loading && <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> جارٍ تحميل الكيانات من Supabase</div>}
      {error && <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      <div className="grid gap-4 md:grid-cols-4">
        {areas.map((area) => <article key={area.slug} className={`rounded-2xl border bg-card p-5 shadow-sm ${selectedArea?.slug === area.slug ? "border-primary" : "border-border"}`}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="text-2xl" role="img" aria-label={area.name_ar}>{area.area_type === "global" ? "🌐" : "📍"}</span><div><h3 className="font-bold text-foreground">{area.name_ar}</h3><p className="text-xs text-muted-foreground">{area.name_en}</p></div></div><MapPin className="size-5 text-primary" aria-hidden="true" /></div><p className="mt-3 text-xs text-muted-foreground">{area.currency_code} {area.currency_symbol ?? ""} · {area.area_type === "global" ? "بيانات الموقع الرئيسي" : "كيان دولة مستقل"}</p><div className="mt-4 grid grid-cols-3 gap-1 text-center text-[11px] text-muted-foreground"><span className="rounded bg-muted px-1 py-1">الهوية<strong className="block text-foreground">{counts.themes}</strong></span><span className="rounded bg-muted px-1 py-1">المدن<strong className="block text-foreground">{counts.cities}</strong></span><span className="rounded bg-muted px-1 py-1">التوقيت<strong className="block text-foreground">{counts.timezones}</strong></span></div><div className="mt-5 flex gap-2"><Link href={`/${area.slug === "global" ? "" : area.slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"><ExternalLink className="size-4" /> معاينة</Link><button type="button" onClick={() => { setSelectedSlug(area.slug); setResource("themes") }} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">إدارة</button></div></article>)}
      </div>
      {selectedArea && <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-primary">الكيان المحدد</p><h3 className="text-2xl font-bold text-foreground">{selectedArea.name_ar}</h3><p className="text-sm text-muted-foreground">{selectedArea.slug} · {counts.cities} مدينة · {counts.timezones} منطقة زمنية</p></div><button type="button" onClick={() => void load()} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"><Check className="mr-1 inline size-4" /> تحديث</button></div><div className="mt-5 flex flex-wrap gap-2">{(Object.keys(labels) as Resource[]).map((key) => <button key={key} type="button" onClick={() => setResource(key)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${resource === key ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}>{labels[key]} ({counts[key]})</button>)}</div><div className="mt-5 grid gap-3">{records.length ? records.map((record) => <div key={record.id} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-foreground">{recordTitle(resource, record)}</p><p className="mt-1 text-xs text-muted-foreground">ID: {record.id} · {record.is_active ? "نشط ويظهر للعامة" : "معطل"}</p></div><button type="button" onClick={() => void toggleRecord(record)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">{record.is_active ? "تعطيل" : "تفعيل"}</button></div><AreaRecordEditor resource={resource} record={record} onSave={updateRecord} /></div>) : <p className="rounded-xl bg-muted/30 p-5 text-sm text-muted-foreground">لا توجد سجلات لهذا القسم في الكيان المحدد.</p>}</div></div>}
    </div>
  </section>
}
