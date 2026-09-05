"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  BookOpen, Users, Star, MessageSquare, Settings, LogOut, Package, Mail,
  Plus, Trash2, Edit3, Check, X, ChevronDown, Eye, EyeOff, LayoutDashboard,
  Menu, XIcon, Palette, FileText, Lock, Film, Gamepad2, Search, BarChart3,
  Languages, Save, Wand2, MapPin
} from "lucide-react"
import dynamic from "next/dynamic"
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary"
import { AdminLoadingSkeleton } from "@/components/admin/AdminLoadingSkeleton"
import { OrdersTab } from "@/components/admin/OrdersTab"
import { PaymentSettingsTab } from "@/components/admin/PaymentSettingsTab"
import { useI18n } from "@/lib/i18n"
import useSWR, { mutate as globalMutate } from "swr"
import { VideoForm } from "@/components/classroom-moments/VideoForm"
import { BlogManager } from "@/components/admin/BlogManager"
import { LibraryManager } from "@/components/admin/LibraryManager"
import { SaudiLandingTab } from "@/components/admin/SaudiLandingTab"
import { UaeLandingTab } from "@/components/admin/UaeLandingTab"
import { CountryLandingPagesTab } from "@/components/admin/CountryLandingPagesTab"
import { FAQManager } from "@/components/admin/faq-manager"

const fetcher = (url: string) => fetch(url).then(r => r.json())

function AdminSectionToolbar({ section }: { section: string }) {
  const [preview, setPreview] = useState(false)
  const [stylesOpen, setStylesOpen] = useState(false)
  const [styles, setStyles] = useState({ color: "", font: "inherit", motion: "هادئ", order: "0" })
  const [status, setStatus] = useState("")

  const action = (name: string) => {
    window.dispatchEvent(new CustomEvent("admin:section-action", { detail: { section, action: name, styles } }))
    setStatus(name === "translate" ? "تم تشغيل الترجمة التلقائية للعنصر المحدد" : `تم تنفيذ: ${name}`)
  }

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm" aria-label={`أدوات قسم ${section}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-foreground">أدوات إدارة القسم</p>
          <p className="text-xs text-muted-foreground">{section} — الحفظ يحدّث بيانات الصفحة العامة بعد نجاح العملية</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => action("create")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"><Plus data-icon="inline-start" /> إنشاء جديد</button>
          <button type="button" onClick={() => action("save")} className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground"><Save data-icon="inline-start" /> حفظ</button>
          <button type="button" onClick={() => action("translate")} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground"><Languages data-icon="inline-start" /> ترجمة تلقائية</button>
          <button type="button" onClick={() => setPreview(!preview)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground">{preview ? <EyeOff data-icon="inline-start" /> : <Eye data-icon="inline-start" />} {preview ? "إخفاء المعاينة" : "معاينة"}</button>
          <button type="button" onClick={() => setStylesOpen(!stylesOpen)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground"><Wand2 data-icon="inline-start" /> تخصيص</button>
        </div>
      </div>
      {stylesOpen && <div className="mt-4 grid gap-3 rounded-xl bg-muted/40 p-3 sm:grid-cols-4">
        <label className="text-xs text-foreground">لون العنصر<input type="color" value={styles.color || "#1a4d2e"} onChange={e => setStyles({ ...styles, color: e.target.value })} className="mt-1 h-9 w-full rounded border border-border bg-background" /></label>
        <label className="text-xs text-foreground">الخط<select value={styles.font} onChange={e => setStyles({ ...styles, font: e.target.value })} className="mt-1 w-full rounded border border-border bg-background p-2 text-sm"><option value="inherit">افتراضي</option><option value="sans-serif">Sans</option><option value="serif">Serif</option></select></label>
        <label className="text-xs text-foreground">الحركة<select value={styles.motion} onChange={e => setStyles({ ...styles, motion: e.target.value })} className="mt-1 w-full rounded border border-border bg-background p-2 text-sm"><option>هادئ</option><option>تلاشي</option><option>انزلاق</option></select></label>
        <label className="text-xs text-foreground">الترتيب<input type="number" value={styles.order} onChange={e => setStyles({ ...styles, order: e.target.value })} className="mt-1 w-full rounded border border-border bg-background p-2 text-sm" /></label>
      </div>}
      {preview && <div className="mt-4 rounded-xl border-2 border-dashed border-primary/30 bg-background p-4 text-sm text-foreground" style={{ color: styles.color || undefined, fontFamily: styles.font }}><span className="font-bold">معاينة مباشرة:</span> سيتم عرض تغييرات {section} هنا قبل الحفظ.</div>}
      {status && <p className="mt-3 text-xs text-primary" role="status">{status}</p>}
    </section>
  )
}

type Tab = "faq" | "country-pages" | "saudi-landing" | "uae-landing" | "dashboard" | "packages" | "teachers" | "reviews" | "messages" | "settings" | "pages" | "seo-guide" | "cms" | "theme" | "pages-builder" | "users" | "classroom-videos" | "educational-games" | "gsc-dashboard" | "request-indexing" | "orders" | "payment-settings" | "blog" | "library"

export default function AdminDashboard() {
  const router = useRouter()
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/auth")
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated) router.push("/admin/login")
        else setAuthenticated(true)
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; key: string; icon: typeof LayoutDashboard; group: string }[] = [
    { id: "faq", label: "الأسئلة الشائعة", key: "admin.faq", icon: MessageSquare, group: "محتوى الموقع" },
    { id: "dashboard", label: t("admin.dashboard"), key: "admin.dashboard", icon: LayoutDashboard, group: "الرئيسية" },
    { id: "country-pages", label: "صفحاتنا حسب الدولة", key: "admin.countryPages", icon: MapPin, group: "محتوى الموقع" },
    { id: "saudi-landing", label: "صفحة الهبوط السعودية", key: "admin.saudiLanding", icon: MapPin, group: "محتوى الموقع" },
    { id: "uae-landing", label: "صفحة الهبوط الإماراتية", key: "admin.uaeLanding", icon: MapPin, group: "محتوى الموقع" },
    { id: "packages", label: t("admin.packages"), key: "admin.packages", icon: Package, group: "محتوى الموقع" },
    { id: "teachers", label: t("admin.teachers"), key: "admin.teachers", icon: Users, group: "محتوى الموقع" },
    { id: "reviews", label: t("admin.reviews"), key: "admin.reviews", icon: Star, group: "محتوى الموقع" },
    { id: "messages", label: t("admin.messages"), key: "admin.messages", icon: MessageSquare, group: "محتوى الموقع" },
    { id: "cms", label: "صفحات الموقع والمحتوى", key: "admin.cms", icon: BookOpen, group: "محتوى الموقع" },
    { id: "blog", label: t("admin.blog"), key: "admin.blog", icon: BookOpen, group: "محتوى الموقع" },
    { id: "library", label: "المكتبة الرقمية", key: "admin.library", icon: BookOpen, group: "محتوى الموقع" },
    { id: "classroom-videos", label: t("admin.classroomVideos"), key: "admin.classroomVideos", icon: Film, group: "الخدمات التعليمية" },
    { id: "educational-games", label: t("admin.educationalGames"), key: "admin.educationalGames", icon: Gamepad2, group: "الخدمات التعليمية" },
    { id: "pages-builder", label: t("admin.pagesBuilder"), key: "admin.pagesBuilder", icon: FileText, group: "أدوات الإدارة" },
    { id: "theme", label: "المظهر والمعاينة الحية", key: "admin.theme", icon: Palette, group: "أدوات الإدارة" },
    { id: "users", label: "المستخدمون والصلاحيات", key: "admin.users", icon: Lock, group: "أدوات الإدارة" },
    { id: "settings", label: "إعدادات لوحة التحكم", key: "admin.settings", icon: Settings, group: "أدوات الإدارة" },
  ]

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside aria-label="قائمة لوحة التحكم" className={`fixed inset-y-0 right-0 z-50 w-64 bg-primary text-primary-foreground transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-primary-foreground/10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{t("admin.title")}</p>
                <p className="text-[10px] text-primary-foreground/60">الحافظ المتميز</p>
              </div>
            </div>
            <button type="button" aria-label="إغلاق قائمة لوحة التحكم" onClick={() => setSidebarOpen(false)} className="lg:hidden text-primary-foreground/60">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 flex flex-col gap-1 [scrollbar-width:thin] [scrollbar-color:hsl(var(--primary-foreground)/.35)_transparent]">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                {(index === 0 || tabs[index - 1].group !== tab.group) && (
                  <p className="px-4 pt-4 pb-1 text-[10px] font-semibold tracking-wide text-primary-foreground/45">{tab.group}</p>
                )}
                <button
                  data-tab={tab.id}
                  onClick={() => { setActiveTab(tab.id as Tab); setSidebarOpen(false) }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-foreground/10 text-secondary"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-primary-foreground/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-primary-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              {t("account.logout")}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="فتح قائمة لوحة التحكم" onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">alymahros25@gmail.com</span>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              م
            </div>
          </div>
        </header>

      {/* Tab Content */}
      <div className="p-4 lg:p-6">
        {activeTab !== "dashboard" && <AdminSectionToolbar section={tabs.find(t => t.id === activeTab)?.label ?? "القسم الحالي"} />}
          <AdminErrorBoundary>
            {activeTab === "faq" && <FAQManager />}
            {activeTab === "dashboard" && <DashboardTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "country-pages" && <CountryLandingPagesTab />}
          </AdminErrorBoundary>

          <AdminErrorBoundary>
            {activeTab === "saudi-landing" && <SaudiLandingTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "uae-landing" && <UaeLandingTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "packages" && <PackagesTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "teachers" && <TeachersTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "reviews" && <ReviewsTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "messages" && <MessagesTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "pages" && <PagesTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "settings" && <SettingsTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "seo-guide" && <SEOGuideTab />}
          </AdminErrorBoundary>
          
          {/* Phase 2-3 New Content Management Routes */}
          <AdminErrorBoundary>
            {activeTab === "cms" && <CMSManagementTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "theme" && <ThemeCustomizerTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "pages-builder" && <PagesBuilderTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "users" && <UsersManagementTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "blog" && <BlogManager />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "library" && <LibraryManager />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "classroom-videos" && <ClassroomVideosTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "orders" && <OrdersTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "educational-games" && <EducationalGamesTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "gsc-dashboard" && <GSCDashboardTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "request-indexing" && <RequestIndexingTab />}
          </AdminErrorBoundary>
          <AdminErrorBoundary>
            {activeTab === "payment-settings" && <PaymentSettingsTab />}
          </AdminErrorBoundary>
        </div>
      </main>
    </div>
  )
}

// Dashboard Tab - Defensive Programming
function DashboardTab() {
  const { t } = useI18n()
  const { data: stats, isLoading, error } = useSWR("/api/admin/data?type=stats", fetcher, { 
    refreshInterval: 10000,
    revalidateOnFocus: false
  })

  const cards = [
    { label: "المعلمون النشطون", value: stats?.totalTeachers ?? 0, icon: Users, color: "bg-primary" },
    { label: "التقييمات النشطة", value: stats?.totalReviews ?? 0, icon: Star, color: "bg-secondary" },
    { label: "الرسائل", value: stats?.totalMessages ?? 0, icon: MessageSquare, color: "bg-accent" },
    { label: "الرسائل غير المقروءة", value: stats?.unreadMessages ?? 0, icon: Mail, color: "bg-muted-foreground" },
  ]

  if (isLoading) return <AdminLoadingSkeleton />
  if (error) return <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-950">{error.message}</div>

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${card.color} text-primary-foreground flex items-center justify-center`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-foreground mb-3">{t("admin.welcomeTitle")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          من هنا يمكنك إدارة جميع محتويات الموقع: الباقات والأسعار، المعلمين والمعلمات، آراء الطلاب، رسائل التواصل، وإعدادات الموقع العامة.
        </p>
      </div>
    </div>
  )
}

// Packages Tab
function PackagesTab() {
  const { data: packages, isLoading, error } = useSWR("/api/admin/data?type=packages", fetcher, { 
    revalidateOnFocus: false,
    dedupingInterval: 60000 
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, unknown>>({})
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [newPackage, setNewPackage] = useState({ type: "quran", name: "", sessions: 4, price: 15, duration: 30, popular: false, features: "" })

  const handleCreate = async () => {
    try {
      setMessage("جاري إضافة الباقة...")
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "packages", data: {
          type: newPackage.type,
          name: { ar: newPackage.name || `باقة ${newPackage.sessions} حصص` },
          sessions: newPackage.sessions,
          price: newPackage.price,
          popular: newPackage.popular,
          active: true,
          features: { ar: newPackage.features.split(",").map((item) => item.trim()).filter(Boolean) },
        } }),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(result.error || "تعذر إضافة الباقة")
      setMessage("تمت إضافة الباقة بنجاح")
      setShowForm(false)
      setNewPackage({ type: "quran", name: "", sessions: 4, price: 15, duration: 30, popular: false, features: "" })
      globalMutate("/api/admin/data?type=packages")
    } catch (err) {
      console.error("Create package error:", err)
      setMessage(`فشل الحفظ: ${err instanceof Error ? err.message : "تحقق من الاتصال"}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الباقة؟")) return
    try {
      const res = await fetch(`/api/admin/data?type=packages&id=${id}`, { method: "DELETE" })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(result.error || "تحقق من الاتصال")
      setMessage("تم حذف الباقة بنجاح")
      globalMutate("/api/admin/data?type=packages")
    } catch (err) {
      console.error("Delete error:", err)
      setMessage("خطأ في الحذف")
    }
  }

  const handleSave = async (id: string) => {
    try {
      setMessage("جاري الحفظ...")
      
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "packages", id, data: {
          ...editData,
          active: editData.active ?? true,
          features: editData.features ?? { ar: [] },
        } }),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(result.error || "تعذر حفظ الباقة")
      setMessage("تم الحفظ بنجاح")
      setEditingId(null)
      globalMutate("/api/admin/data?type=packages")
    } catch (err) {
      console.error("[v0] Package save error:", err)
      setMessage(err instanceof Error ? err.message : "خطأ في الحفظ")
    }
  }

  if (isLoading) return <AdminLoadingSkeleton />
  if (error) return <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-950">خطأ في تحميل البيانات</div>
  const packageRows = Array.isArray(packages) ? packages : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">إدارة الباقات</h2>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
          <Plus className="w-4 h-4" /> إضافة باقة
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 text-primary text-sm" role="status">{message}</div>
      )}

      {showForm && (
        <div className="mb-6 bg-card rounded-2xl border border-border p-5 space-y-4">
          <h3 className="font-bold text-foreground">باقة جديدة</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input aria-label="اسم الباقة" placeholder="اسم واضح للباقة" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            <select aria-label="نوع الباقة" value={newPackage.type} onChange={(e) => setNewPackage({ ...newPackage, type: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
              <option value="quran">قرآن كريم</option><option value="arabic">لغة عربية</option>
            </select>
            <input aria-label="عدد الحصص" type="number" min="1" value={newPackage.sessions} onChange={(e) => setNewPackage({ ...newPackage, sessions: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            <input aria-label="السعر" type="number" min="0" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            <input aria-label="مدة الحصة بالدقائق" type="number" min="1" value={newPackage.duration} onChange={(e) => setNewPackage({ ...newPackage, duration: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
          </div>
          <input aria-label="مميزات الباقة" placeholder="المميزات مفصولة بفواصل" value={newPackage.features} onChange={(e) => setNewPackage({ ...newPackage, features: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
          <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={newPackage.popular} onChange={(e) => setNewPackage({ ...newPackage, popular: e.target.checked })} /> الباقة الأكثر شمولاً</label>
          <div className="flex gap-2"><button type="button" onClick={handleCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">حفظ الباقة</button><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">إلغاء</button></div>
          <div className="max-w-sm rounded-2xl border-2 border-secondary bg-background p-5 shadow-sm" aria-label="معاينة الباقة">
            <p className="text-xs text-muted-foreground">معاينة مباشرة</p><p className="mt-2 font-bold text-foreground">{newPackage.type === "quran" ? "قرآن كريم" : "لغة عربية"} — {newPackage.sessions} حصص</p><p className="text-2xl font-extrabold text-primary">${newPackage.price}</p><p className="text-sm text-muted-foreground">{newPackage.features || "أضف مميزات الباقة"}</p>
          </div>
        </div>
      )}


      <div className="grid gap-4">
        {packageRows.length === 0 && <p className="p-4 text-muted-foreground">لا توجد باقات حالياً. استخدم زر إضافة باقة.</p>}
        {packageRows.map((pkg: { id?: string; type?: string; sessions?: number; price?: number; popular?: boolean } | null) => {
          if (!pkg?.id) return null
          return (
            <div key={pkg.id} className="bg-card rounded-2xl border border-border p-5">
              {editingId === pkg.id ? (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">عدد الحصص</label>
                      <input
                        type="number"
                        value={(editData.sessions as number) ?? pkg.sessions}
                        onChange={(e) => setEditData({...editData, sessions: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">السعر ($)</label>
                      <input
                        type="number"
                        value={(editData.price as number) ?? pkg.price}
                        onChange={(e) => setEditData({...editData, price: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">الأكثر طلباً:</label>
                    <button
                      onClick={() => setEditData({...editData, popular: !(editData.popular ?? pkg.popular)})}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${(editData.popular ?? pkg.popular) ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {(editData.popular ?? pkg.popular) ? "نعم" : "لا"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => pkg.id && handleSave(pkg.id)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">
                      <Check className="w-4 h-4" /> حفظ
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">
                      <X className="w-4 h-4" /> إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {pkg?.type === "quran" ? "قرآن" : "عربي"} - {pkg?.sessions} حصص
                        {pkg?.popular && <span className="ms-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">الأكثر طلباً</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">${pkg?.price} شهرياً</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { pkg.id && setEditingId(pkg.id); pkg && setEditData(pkg) }}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => pkg.id && handleDelete(pkg.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Teachers Tab
function TeachersTab() {
  const { data: teachers, isLoading, error } = useSWR("/api/admin/data?type=teachers", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onError: (err) => console.error("[v0] Teachers fetch error:", err),
    dedupingInterval: 60000
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, unknown>>({})
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [newTeacher, setNewTeacher] = useState({
    name: { ar: "", en: "" },
    specialty: { ar: "", en: "" },
    experience: ""
  })

  const handleAdd = async () => {
    try {
      setMessage("جاري الإضافة...")
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "teachers", data: newTeacher }),
      })
      if (res.ok) {
        setMessage("تم إضافة المعلم بنجاح")
        setShowForm(false)
        setNewTeacher({ name: { ar: "", en: "" }, specialty: { ar: "", en: "" }, experience: "" })
        globalMutate("/api/admin/data?type=teachers")
      }
    } catch (err) {
      console.error("Add error:", err)
      setMessage("خطأ في الإضافة")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف المعلم؟")) return
    try {
      const res = await fetch(`/api/admin/data?type=teachers&id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setMessage("تم حذف المعلم بنجاح")
        globalMutate("/api/admin/data?type=teachers")
      }
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleSave = async (id: string) => {
    try {
      setMessage("جاري الحفظ...")
      
      const res = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "teachers", id, data: editData }),
      })
      if (res.ok) {
        setMessage("تم الحفظ بنجاح")
        setEditingId(null)
        globalMutate("/api/admin/data?type=teachers")
      } else {
        setMessage("خطأ في الحفظ")
      }
    } catch (err) {
      console.error("Save error:", err)
      setMessage("خطأ في الحفظ")
    }
  }

  const teacherRecords = Array.isArray(teachers) ? teachers : Array.isArray(teachers?.teachers) ? teachers.teachers : []

  if (isLoading) return <AdminLoadingSkeleton />
  if (error) return <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-950">خطأ في تحميل البيانات</div>
  if (teacherRecords.length === 0) return <div className="p-4 text-muted-foreground">لا يوجد معلمين ومعلمات</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">إدارة المعلمين والمعلمات</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          إضافة معلم
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">
          {message}
        </div>
      )}

      {editingId && (
        <div className="bg-card rounded-2xl border border-primary/30 p-5 mb-6 space-y-4">
          <h3 className="font-bold text-foreground">تعديل بيانات المعلم</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input aria-label="اسم المعلم بالعربية" value={String((editData.name as Record<string, string> | undefined)?.ar ?? "")} onChange={(e) => setEditData({ ...editData, name: { ...((editData.name as Record<string, string>) || {}), ar: e.target.value } })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="الاسم بالعربية" />
            <input aria-label="تخصص المعلم بالعربية" value={String((editData.specialty as Record<string, string> | undefined)?.ar ?? "")} onChange={(e) => setEditData({ ...editData, specialty: { ...((editData.specialty as Record<string, string>) || {}), ar: e.target.value } })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="التخصص" />
            <input aria-label="سنوات الخبرة" value={String(editData.experience ?? "")} onChange={(e) => setEditData({ ...editData, experience: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="سنوات الخبرة" />
            <input aria-label="رابط صورة المعلم" value={String(editData.image ?? "")} onChange={(e) => setEditData({ ...editData, image: e.target.value })} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" placeholder="رابط الصورة" />
          </div>
          <div className="flex gap-2"><button type="button" onClick={() => editingId && handleSave(editingId)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">حفظ التعديل</button><button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">إلغاء</button></div>
        </div>
      )}

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-bold text-foreground mb-4">معلم جديد</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">الاسم (عربي)</label>
              <input
                value={newTeacher?.name?.ar ?? ''}
                onChange={(e) => setNewTeacher({...newTeacher, name: {...newTeacher?.name || {}, ar: e.target.value}})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                placeholder="الاسم بالعربية"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">الاسم (إنجليزي)</label>
              <input
                value={newTeacher?.name?.en ?? ''}
                onChange={(e) => setNewTeacher({...newTeacher, name: {...newTeacher?.name || {}, en: e.target.value}})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                placeholder="Name in English"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">التخصص (عربي)</label>
              <input
                value={newTeacher?.specialty?.ar ?? ''}
                onChange={(e) => setNewTeacher({...newTeacher, specialty: {...newTeacher?.specialty || {}, ar: e.target.value}})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                placeholder="التخصص"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">سنوات الخبرة</label>
              <input
                type="number"
                value={newTeacher?.experience ?? ''}
                onChange={(e) => setNewTeacher({...newTeacher, experience: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                placeholder="10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAdd} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">
              <Check className="w-4 h-4" /> حفظ
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">
              <X className="w-4 h-4" /> إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {teacherRecords.map((teacher: { id?: string; name?: Record<string, string>; specialty?: Record<string, string>; experience?: string; active?: boolean } | null) => {
          if (!teacher?.id) return null
          return (
            <div key={teacher.id} className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{teacher?.name?.ar || 'بدون اسم'}</p>
                  <p className="text-sm text-muted-foreground">{teacher?.specialty?.ar || 'بدون تخصص'} - {teacher?.experience || '0'} سنة خبرة</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="تعديل بيانات المعلم"
                  onClick={() => { if (teacher?.id) { setEditingId(teacher.id); setEditData(teacher as Record<string, unknown>) } }}
                  className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => teacher?.id && handleDelete(teacher.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Reviews Tab - Defensive Programming
function ReviewsTab() {
  const { data: reviews, isLoading, error, mutate } = useSWR("/api/admin/data?type=reviews", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  })

  const handleToggle = useCallback(async (id: string, active: boolean) => {
    try {
      await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reviews", id, data: { active: !active } }),
      })
      mutate()
    } catch (err) {
      console.error("[v0] Toggle error:", err)
    }
  }, [mutate])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرأي؟")) return
    try {
      await fetch(`/api/admin/data?type=reviews&id=${id}`, { method: "DELETE" })
      mutate()
    } catch (err) {
      console.error("[v0] Delete error:", err)
    }
  }, [mutate])

  if (isLoading) return <AdminLoadingSkeleton />
  if (error) return <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-950">خطأ في تحميل البيانات</div>
  if (!Array.isArray(reviews) || reviews?.length === 0) return <div className="p-4 text-muted-foreground">لا توجد آراء</div>

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-6">آراء الطلاب</h2>
      <div className="grid gap-4">
        {reviews?.map((review: any) => (
          review?.id ? (
            <div key={review.id} className={`bg-card rounded-2xl border p-5 ${review?.active ? "border-border" : "border-destructive/30 opacity-60"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground">{review?.name ?? "بدون اسم"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < (review?.rating ?? 0) ? "text-secondary fill-secondary" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(review.id, review?.active ?? false)}
                    className={`p-2 rounded-lg transition-colors ${review?.active ? "hover:bg-muted text-primary" : "hover:bg-primary/10 text-muted-foreground"}`}
                    title={review?.active ? "إخفاء" : "إظهار"}
                  >
                    {review?.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review?.text?.ar ?? review?.text ?? "بدون نص"}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  )
}

// Messages Tab - Defensive Programming
function MessagesTab() {
  const { data: messages, isLoading, error, mutate } = useSWR("/api/admin/data?type=messages", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  })

  const handleRead = useCallback(async (id: string) => {
    try {
      await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "messages", id, data: { read: true } }),
      })
      mutate()
      globalMutate("/api/admin/data?type=stats")
    } catch (err) {
      console.error("[v0] Read error:", err)
    }
  }, [mutate])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف الرسالة؟")) return
    try {
      await fetch(`/api/admin/data?type=messages&id=${id}`, { method: "DELETE" })
      mutate()
      globalMutate("/api/admin/data?type=stats")
    } catch (err) {
      console.error("[v0] Delete error:", err)
    }
  }, [mutate])

  if (isLoading) return <AdminLoadingSkeleton />
  if (error) return <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-950">خطأ في تحميل البيانات</div>

  if (!Array.isArray(messages) || messages?.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">لا توجد رسائل بعد</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-6">رسائل التواصل</h2>
      <div className="grid gap-4">
        {messages?.map((msg: any) => (
          msg?.id ? (
            <div key={msg.id} className={`bg-card rounded-2xl border p-5 ${msg?.read ? "border-border" : "border-primary/30 bg-primary/5"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground flex items-center gap-2">
                    {msg?.name ?? "بدون اسم"}
                    {!msg?.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </p>
                  <p className="text-xs text-muted-foreground">{msg?.email ?? "-"} | {msg?.phone ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">{msg?.createdAt ? new Date(msg.createdAt).toLocaleDateString("ar-EG") : "-"}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!msg?.read && (
                    <button onClick={() => handleRead(msg.id)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="تحديد كمقروء">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-xl p-3">{msg?.message ?? "بدون محتوى"}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  )
}

// Settings Tab
function SettingsTab() {
  const { data: settings, isLoading } = useSWR("/api/admin/data?type=settings", fetcher)
  const [formData, setFormData] = useState<Record<string, unknown> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings && !formData) setFormData(settings)
  }, [settings, formData])

  const handleSave = async () => {
    if (!formData) return
    setSaving(true)
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "settings", data: formData }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    globalMutate("/api/admin/data?type=settings")
  }

  if (isLoading || !formData) return <LoadingState />

  const s = formData as Record<string, string | Record<string, string>>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">إعدادات الموقع</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : saved ? "تم الحفظ" : "حفظ التغييرات"}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Contact info */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">بيانات الاتصال</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">البريد الإلكتروني</label>
              <input
                value={s.email as string}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">واتساب</label>
              <input
                value={s.whatsapp as string}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">تيليجرام</label>
              <input
                value={s.telegram as string}
                onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
            </div>
          </div>
        </div>

        {/* Site Names */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">اسم الموقع</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {["ar", "en", "fr"].map((lang) => (
              <div key={lang}>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {lang === "ar" ? "عربي" : lang === "en" ? "إنجليزي" : "فرنسي"}
                </label>
                <input
                  value={(s.siteName as Record<string, string>)?.[lang] || ""}
                  onChange={(e) => setFormData({...formData, siteName: {...(s.siteName as Record<string, string>), [lang]: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hero titles */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">عنوان الصفحة الرئيسية</h3>
          <div className="grid gap-4">
            {["ar", "en", "fr"].map((lang) => (
              <div key={lang}>
                <label className="text-xs text-muted-foreground mb-1 block">
                  العنوان ({lang === "ar" ? "عربي" : lang === "en" ? "إنجليزي" : "فرنسي"})
                </label>
                <input
                  value={(s.heroTitle as Record<string, string>)?.[lang] || ""}
                  onChange={(e) => setFormData({...formData, heroTitle: {...(s.heroTitle as Record<string, string>), [lang]: e.target.value}})}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Pages Tab - للتحكم في جميع صفحات الموقع
function PagesTab() {
  const pages = [
    { name: "الصفحة الرئيسية", path: "/", description: "الصفحة الرئيسية للموقع" },
    { name: "من نحن", path: "/about", description: "معلومات عن الأكاديمية" },
    { name: "القرآن الكريم", path: "/quran", description: "باقات تحفيظ القرآن" },
    { name: "تأسيس العربي", path: "/arabic", description: "باقات تأسيس اللغة العربية" },
    { name: "المعلمين والمعلمات", path: "/teachers", description: "قائمة المعلمين المجازين" },
    { name: "آراء الطلاب", path: "/reviews", description: "تقييمات وآراء الطلاب" },
    { name: "الألعاب والمسابقات", path: "/games", description: "ألعاب تعليمية" },
    { name: "الأسئلة الشائعة", path: "/faq", description: "50 سؤال شامل" },
    { name: "المدونة", path: "/blog", description: "مقالات وإرشادات" },
    { name: "اتصل بنا", path: "/contact", description: "نموذج التواصل" },
    { name: "حسابي", path: "/account", description: "تسجيل الحساب" },
    { name: "الخصوصية", path: "/privacy", description: "سياسة الخصوصية" },
    { name: "الشروط والأحكام", path: "/terms", description: "شروط الاستخدام" },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">إدارة الصفحات</h2>
        <p className="text-sm text-muted-foreground mb-6">اضغط على أي صفحة لفتحها وتحريرها</p>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {pages.map((page, idx) => (
            <a
              key={idx}
              href={page.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
            >
              <p className="font-medium text-foreground flex items-center justify-between">
                {page.name}
                <span className="text-xs text-primary">→</span>
              </p>
              <p className="text-xs text-muted-foreground">{page.description}</p>
              <p className="text-[10px] text-muted-foreground/50 font-mono">{page.path}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// SEO Guide Tab
function SEOGuideTab() {
  const siteUrl = "https://quran-elhafez.com"
  
  const steps = [
    {
      title: "1. التحقق من ملفات SEO الأساسية",
      items: [
        { label: "✓ Sitemap", desc: "متوفر على /sitemap.xml" },
        { label: "✓ Robots.txt", desc: "متوفر على /robots.txt" },
        { label: "✓ Meta Tags", desc: "محسّنة في جميع الصفحات" },
      ]
    },
    {
      title: "2. إنشاء Google Search Console",
      items: [
        { label: "الخطوة 1", desc: "اذهب إلى https://search.google.com/search-console" },
        { label: "الخطوة 2", desc: "اختر 'Property' > 'Add property'" },
        { label: "الخطوة 3", desc: "أدخل URL الموقع" },
      ]
    },
    {
      title: "3. إرسال Sitemap إلى Google",
      items: [
        { label: "الخطوة 1", desc: "في Search Console، اذهب إلى Sitemaps" },
        { label: "الخطوة 2", desc: `أدخل: ${siteUrl}/sitemap.xml` },
        { label: "الخطوة 3", desc: "اضغط 'Submit'" },
      ]
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <h2 className="text-2xl font-bold text-foreground mb-2">نشر الموقع على Google</h2>
        <p className="text-sm text-muted-foreground">دليل شامل لتسجيل وتفهرس الموقع</p>
      </div>

      {steps.map((step, idx) => (
        <div key={idx} className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold text-lg text-foreground mb-4">{step.title}</h3>
          <div className="space-y-3">
            {step.items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Phase 3: CMS Management Tab
function CMSManagementTab() {
  const sections = [
    { label: "لقطات من الحصص", desc: "إدارة فيديوهات يوتيوب الترويجية", tab: "classroom-videos" },
    { label: "الباقات والأسعار", desc: "تحديث أسعار قرآن والعربي", tab: "packages" },
    { label: "المعلمين والمعلمات", desc: "إضافة وتعديل بيانات المعلمين", tab: "teachers" },
    { label: "آراء الطلاب", desc: "إدارة شهادات وتقييمات الطلاب", tab: "reviews" },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">إدارة المحتوى</h2>
        <p className="text-sm text-muted-foreground">اختر القسم الذي تريد تحريره</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <button
            key={s.tab}
            onClick={() => {
              const btn = document.querySelector(`button[data-tab="${s.tab}"]`) as HTMLButtonElement
              btn?.click()
            }}
            className="bg-card border border-border rounded-2xl p-5 text-right hover:border-primary hover:shadow-sm transition-all group"
          >
            <p className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </button>
        ))}
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
        <p className="text-sm font-bold text-foreground mb-2">ملاحظة</p>
        <p className="text-sm text-muted-foreground">انقر على أي قسم من الأعلى أو استخدم الشريط الجانبي للتنقل مباشرة بين الأقسام.</p>
      </div>
    </div>
  )
}

// Theme Customizer Tab - real color/font editor
function ThemeCustomizerTab() {
  const primaryColors = [
    { name: "أخضر داكن (الحالي)", value: "#1a4d2e" },
    { name: "أزرق داكن", value: "#1e3a5f" },
    { name: "بنفسجي داكن", value: "#2d1b69" },
    { name: "بني داكن", value: "#5c3317" },
    { name: "رمادي أردوازي", value: "#2c3e50" },
  ]
  const accentColors = [
    { name: "ذهبي (الحالي)", value: "#d4af37" },
    { name: "برتقالي", value: "#e67e22" },
    { name: "فضي", value: "#bdc3c7" },
    { name: "نحاسي", value: "#b87333" },
  ]
  const [msg, setMsg] = useState("")
  const handleApply = () => {
    setMsg("التعديل يتطلب تحديث ملف globals.css — تواصل مع المطور لتطبيق اللون الجديد.")
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">المظهر والألوان</h2>
        <p className="text-sm text-muted-foreground">الألوان المتاحة للأكاديمية</p>
      </div>
      {msg && <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">{msg}</div>}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
        <div>
          <p className="font-bold text-foreground mb-3">اللون الأساسي (Primary)</p>
          <div className="flex flex-wrap gap-3">
            {primaryColors.map(c => (
              <button key={c.value} onClick={handleApply} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-primary transition text-sm">
                <span className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c.value }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold text-foreground mb-3">اللون الثانوي (Accent/Secondary)</p>
          <div className="flex flex-wrap gap-3">
            {accentColors.map(c => (
              <button key={c.value} onClick={handleApply} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-primary transition text-sm">
                <span className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c.value }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="font-bold text-foreground mb-3">الألوان الحالية للموقع</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Primary", bg: "#1a4d2e", text: "#fff" },
            { label: "Secondary", bg: "#d4af37", text: "#000" },
            { label: "Background", bg: "#ffffff", text: "#000" },
            { label: "Foreground", bg: "#000000", text: "#fff" },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-4 text-center text-sm font-bold border border-border" style={{ backgroundColor: c.bg, color: c.text }}>
              {c.label}
              <div className="text-xs font-normal mt-1 opacity-75">{c.bg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Pages Builder Tab - list of all site pages with quick links
function PagesBuilderTab() {
  const pages = [
    { label: "الصفحة الرئيسية", path: "/", desc: "Hero، المميزات، الباقات، الشهادات" },
    { label: "قرآن الكريم", path: "/quran", desc: "الباقات والأسعار وطريقة التسجيل" },
    { label: "تأسيس العربي", path: "/arabic", desc: "باقات تعليم اللغة العربية" },
    { label: "من نحن", path: "/about", desc: "قصة الأكاديمية وقيمها" },
    { label: "المعلمين والمعلمات", path: "/teachers", desc: "نبذة عن فريق المعلمين" },
    { label: "آراء الطلاب", path: "/reviews", desc: "شهادات وتقييمات الطلاب" },
      { label: "لقطات من الحصص", path: "/classroom-moments", desc: "فيديوهات ترويجية" },
    { label: "الألعاب والمسابقات", path: "/games", desc: "ألعاب تعليمية تفاعلية" },
    { label: "الأسئلة الشائعة", path: "/faq", desc: "50 سؤال وجواب" },
    { label: "المدونة", path: "/blog", desc: "مقالات تعليمية SEO" },
    { label: "اتصل بنا", path: "/contact", desc: "نموذج التواصل" },
    { label: "حسابي", path: "/account", desc: "تسجيل دخول وإنشاء حساب" },
    { label: "الخصوصية", path: "/privacy", desc: "سياسة الخصوصية" },
    { label: "شروط الاستخدام", path: "/terms", desc: "الشروط والأحكام" },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">صفحات الموقع</h2>
        <p className="text-sm text-muted-foreground">{pages.length} صفحة مُنشأة — اضغط للمعاينة</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pages.map(p => (
          <a
            key={p.path}
            href={p.path}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{p.label}</p>
              <span className="text-xs text-muted-foreground font-mono">{p.path}</span>
            </div>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

// Users Management Tab - admin account info
function UsersManagementTab() {
  const [showPass, setShowPass] = useState(false)
  const [newPass, setNewPass] = useState("")
  const [msg, setMsg] = useState("")

  const handleChangePass = async () => {
    if (newPass.length < 6) { setMsg("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return }
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: newPass }),
    })
    if (res.ok) { setMsg("تم تحديث كلمة المرور بنجاح"); setNewPass("") }
    else { setMsg("خطأ — تحقق من صلاحياتك") }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">إدارة الحساب</h2>
        <p className="text-sm text-muted-foreground">بيانات المشرف وإعدادات الأمان</p>
      </div>
      {msg && <div className={`p-3 rounded-lg text-sm ${msg.startsWith("تم") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>{msg}</div>}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">م</div>
          <div>
            <p className="font-bold text-foreground text-lg">المشرف الرئيسي</p>
            <p className="text-sm text-muted-foreground">alymahros25@gmail.com</p>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Super Admin</span>
          </div>
        </div>
        <div className="border-t border-border pt-5">
          <p className="font-bold text-foreground mb-3">تغيير كلمة المرور</p>
          <div className="flex gap-3 max-w-sm">
            <div className="relative flex-1">
              <input
                type={showPass ? "text" : "password"}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="كلمة المرور الجديدة"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleChangePass}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition"
            >
              حفظ
            </button>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="font-bold text-foreground mb-3">معلومات الدخول</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">رابط لوحة التحكم</span>
            <a href="/admin" className="text-primary font-medium">/admin</a>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">البريد الإلكتروني</span>
            <span className="font-medium">alymahros25@gmail.com</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">الدور</span>
            <span className="font-medium">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Classroom Videos Management Tab
function ClassroomVideosTab() {
  const [showForm, setShowForm] = useState(false)
  // Fetch ALL videos (published + drafts) so the admin sees everything
  // API returns { data: [...] } so we extract the array
  const { data: apiResponse, isLoading, error } = useSWR("/api/cms/classroom-videos", fetcher, { 
    revalidateOnFocus: true,
    dedupingInterval: 5000
  })
  const videos = Array.isArray(apiResponse?.data) ? apiResponse.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">فيديوهات من الحصص</h2>
          <p className="text-sm text-muted-foreground">إدارة فيديوهات الحصص والمحتوى الترويجي</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'إغلاق النموذج' : 'إضافة فيديو جديد'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card rounded-lg border border-border p-6">
          <VideoForm onSuccess={() => {
            setShowForm(false)
            globalMutate("/api/cms/classroom-videos")
          }} />
        </div>
      )}

      {/* Videos List */}
      <div className="bg-card rounded-lg border border-border p-6">
        {isLoading ? (
          <AdminLoadingSkeleton />
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>خطأ في تحميل الفيديوهات</p>
          </div>
        ) : !Array.isArray(videos) || videos?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">لم يتم إضافة أي فيديوهات حتى الآن</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              أضف أول فيديو الآن
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video: any) => (
              <ClassroomVideoItem key={video.id} video={video} onUpdate={() => globalMutate("/api/cms/classroom-videos")} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Classroom Video Item Component
function ClassroomVideoItem({ video, onUpdate }: { video: any; onUpdate: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/cms/classroom-videos?id=${video.id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        onUpdate()
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
      {video.thumbnail_url && (
        <Image
          src={video.thumbnail_url}
          alt={video.title_ar}
          width={80}
          height={80}
          className="w-20 h-20 rounded object-cover"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-foreground mb-1">{video.title_ar}</h3>
        <p className="text-sm text-muted-foreground mb-2">{video.description_ar}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {video.category && <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{video.category}</span>}
          {video.teacher_name_ar && <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">👨‍🏫 {video.teacher_name_ar}</span>}
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-700 transition disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

// Educational Games Tab — links to the existing /games page and shows its contents
function EducationalGamesTab() {
  const games = [
    {
      name_ar: "لعبة مطابقة الحروف",
      name_en: "Letter Matching Game",
      name_fr: "Jeu d'association de lettres",
      description_ar: "تعلم الحروف العربية من خلال مطابقتها بالصور والأصوات",
      path: "/games#letter-matching",
      status: "منشور",
    },
    {
      name_ar: "مسابقة قرآنية",
      name_en: "Quran Quiz",
      name_fr: "Quiz coranique",
      description_ar: "اختبر معلوماتك القرآنية وتنافس مع الأصدقاء",
      path: "/games#quran-quiz",
      status: "منشور",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">الألعاب التعليمية</h2>
          <p className="text-sm text-muted-foreground">إدارة الألعاب التعليمية المتوفرة على الموقع</p>
        </div>
        <a
          href="/games"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition text-sm font-medium"
        >
          <Gamepad2 className="w-4 h-4" />
          عرض صفحة الألعاب
        </a>
      </div>

      {/* Games List */}
      <div className="grid gap-4">
        {games.map((game, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">{game.name_ar}</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{game.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{game.description_ar}</p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-0.5 rounded">{game.name_en}</span>
                <span className="bg-muted px-2 py-0.5 rounded">{game.name_fr}</span>
              </div>
            </div>
            <a
              href={game.path}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-muted transition"
            >
              عرض
            </a>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-foreground font-medium mb-1">ملاحظة</p>
        <p className="text-xs text-muted-foreground">
          الألعاب الحالية مدمجة في الموقع. لإضافة ألعاب جديدة أو تعديل النصوص، تواصل مع فريق التطوير أو عدّل ملف الألعاب مباشرة من مستودع الكود.
        </p>
        <a
          href="/games"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
        >
          فتح صفحة الألعاب الكاملة
          <span aria-hidden="true">←</span>
        </a>
      </div>
    </div>
  )
}

// GSC Dashboard Tab
function GSCDashboardTab() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/gsc/status')
        const data = await res.json()
        if (data.success) {
          setStats(data.data)
          setLastUpdated(new Date(data.lastUpdated).toLocaleString('ar-SA'))
        } else {
          setError(data.error || 'خطأ في جلب البيانات')
        }
      } catch (err) {
        setError('فشل الاتصال بـ Google Search Console')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 3600000) // Update every hour
    return () => clearInterval(interval)
  }, [])

  if (loading) return <LoadingState />
  if (error) return <div className="p-4 rounded-lg bg-destructive/10 text-destructive">{error}</div>

  const cards = [
    { label: 'إجمالي الصفحات', value: stats?.totalPages || 0, icon: BarChart3, color: 'bg-blue-500' },
    { label: 'الصفحات المفهرسة', value: stats?.indexed || 0, icon: Check, color: 'bg-green-500' },
    { label: 'الصفحات غير المفهرسة', value: stats?.notIndexed || 0, icon: X, color: 'bg-red-500' },
    { label: 'متوسط الموضع', value: stats?.avgPosition || 'N/A', icon: Search, color: 'bg-amber-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">حالة فهرسة Google</h2>
          <p className="text-sm text-muted-foreground mt-1">آخر تحديث: {lastUpdated}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          تحديث
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <div className={`w-8 h-8 rounded-lg ${card.color} text-white flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold text-foreground mb-4">إحصائيات التفاعل</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">إجمالي النقرات</p>
            <p className="text-3xl font-bold text-foreground">{stats?.clicks || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">إجمالي الانطباعات</p>
            <p className="text-3xl font-bold text-foreground">{stats?.impressions || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-foreground font-medium mb-2">نصيحة</p>
        <p className="text-xs text-muted-foreground">
          استخدم علامة "طلب فهرسة" أعلاه لطلب فهرسة الصفحات الجديدة أو المحدثة في Google بشكل فوري.
        </p>
      </div>
    </div>
  )
}

// Request Indexing Tab
function RequestIndexingTab() {
  const [urls, setUrls] = useState<string[]>([''])
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [message, setMessage] = useState('')

  const addUrl = () => setUrls([...urls, ''])
  const removeUrl = (idx: number) => setUrls(urls.filter((_, i) => i !== idx))
  const updateUrl = (idx: number, value: string) => {
    const newUrls = [...urls]
    newUrls[idx] = value
    setUrls(newUrls)
  }

  const submitIndexing = async () => {
    const validUrls = urls.filter(u => u.trim())
    if (validUrls.length === 0) {
      setMessage('الرجاء إدخال رابط واحد على الأقل')
      return
    }

    setSubmitting(true)
    setResults([])
    setMessage('جاري إرسال طلبات الفهرسة...')

    try {
      const resultsList: any[] = []
      for (const url of validUrls) {
        const res = await fetch('/api/gsc/request-indexing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, type: 'URL_UPDATED' }),
        })
        const data = await res.json()
        resultsList.push({ url, success: res.ok, status: data })
      }
      setResults(resultsList)
      setMessage('تم إرسال جميع الطلبات بنجاح')
    } catch (err) {
      setMessage('حدث خطأ أثناء الإرسال')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">طلب فهرسة الصفحات</h2>
        <p className="text-sm text-muted-foreground">أدخل روابط الصفحات المراد فهرستها في Google بشكل فوري</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">الروابط</label>
          <div className="space-y-2">
            {urls.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateUrl(idx, e.target.value)}
                  placeholder="https://quran-elhafez.com/page"
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
                {urls.length > 1 && (
                  <button
                    onClick={() => removeUrl(idx)}
                    className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addUrl}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80"
          >
            <Plus className="w-4 h-4" />
            إضافة رابط آخر
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            results.some(r => r.success)
              ? 'bg-green-500/10 text-green-600'
              : 'bg-amber-500/10 text-amber-600'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={submitIndexing}
          disabled={submitting || urls.every(u => !u.trim())}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? 'جاري الإرسال...' : 'إرسال طلبات الفهرسة'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-foreground">النتائج</h3>
          {results.map((result, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-sm font-medium text-foreground">{result.url}</p>
              <p className={`text-xs mt-1 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? 'تم الإرسال بنجاح' : 'فشل الإرسال'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Loading State
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">جاري التحميل...</p>
    </div>
  )
}
