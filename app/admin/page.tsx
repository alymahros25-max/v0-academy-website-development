"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen, Users, Star, MessageSquare, Settings, LogOut, Package, Mail,
  Plus, Trash2, Edit3, Check, X, ChevronDown, Eye, EyeOff, LayoutDashboard,
  Menu, XIcon
} from "lucide-react"
import useSWR, { mutate as globalMutate } from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Tab = "dashboard" | "packages" | "teachers" | "reviews" | "messages" | "settings" | "pages" | "seo-guide" | "zapier"

export default function AdminDashboard() {
  const router = useRouter()
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

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "الرئيسية", icon: LayoutDashboard },
    { id: "packages", label: "الباقات", icon: Package },
    { id: "teachers", label: "المعلمين", icon: Users },
    { id: "reviews", label: "آراء الطلاب", icon: Star },
    { id: "messages", label: "الرسائل", icon: MessageSquare },
    { id: "pages", label: "الصفحات", icon: BookOpen },
    { id: "zapier", label: "Zapier (مقالات)", icon: Mail },
    { id: "settings", label: "الإعدادات", icon: Settings },
    { id: "seo-guide", label: "نشر Google", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-primary text-primary-foreground transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-primary-foreground/10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">لوحة التحكم</p>
                <p className="text-[10px] text-primary-foreground/60">الحافظ المتميز</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-primary-foreground/60">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-foreground/10 text-secondary"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-primary-foreground/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-primary-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
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
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "packages" && <PackagesTab />}
          {activeTab === "teachers" && <TeachersTab />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "pages" && <PagesTab />}
          {activeTab === "zapier" && <ZapierTab />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "seo-guide" && <SEOGuideTab />}
        </div>
      </main>
    </div>
  )
}

// Dashboard Tab
function DashboardTab() {
  const { data: stats } = useSWR("/api/admin/data?type=stats", fetcher, { refreshInterval: 10000 })

  const cards = [
    { label: "رسائل جديدة", value: stats?.unreadMessages ?? 0, icon: Mail, color: "bg-blue-500" },
    { label: "المعلمين النشطين", value: stats?.totalTeachers ?? 0, icon: Users, color: "bg-emerald-500" },
    { label: "آراء الطلاب", value: stats?.totalReviews ?? 0, icon: Star, color: "bg-amber-500" },
    { label: "إجمالي الرسائل", value: stats?.totalMessages ?? 0, icon: MessageSquare, color: "bg-purple-500" },
  ]

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center`}>
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
        <h2 className="font-bold text-foreground mb-3">مرحباً بك في لوحة التحكم</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          من هنا يمكنك إدارة جميع محتويات الموقع: الباقات والأسعار، المعلمين، آراء الطلاب، رسائل التواصل، وإعدادات الموقع العامة.
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

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الباقة؟")) return
    try {
      const res = await fetch(`/api/admin/data?type=packages&id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setMessage("تم حذف الباقة بنجاح")
        globalMutate("/api/admin/data?type=packages")
      }
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
        body: JSON.stringify({ type: "packages", id, data: editData }),
      })
      if (res.ok) {
        setMessage("تم الحفظ بنجاح")
        setEditingId(null)
        globalMutate("/api/admin/data?type=packages")
      } else {
        setMessage("خطأ في الحفظ")
      }
    } catch (err) {
      console.error("Save error:", err)
      setMessage("خطأ في الحفظ")
    }
  }

  if (isLoading) return <LoadingState />
  if (error) return <div className="text-red-500 p-4">خطأ في تحميل البيانات</div>
  if (!packages || packages.length === 0) return <div className="p-4 text-muted-foreground">لا توجد باقات</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">إدارة الباقات</h2>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">
          {message}
        </div>
      )}

      <div className="grid gap-4">
        {packages?.map((pkg: { id: string; type: string; sessions: number; price: number; popular: boolean }) => (
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
                  <button onClick={() => handleSave(pkg.id)} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold">
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pkg.type === "quran" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {pkg.type === "quran" ? "قرآن" : "عربي"} - {pkg.sessions} حصص
                      {pkg.popular && <span className="ms-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">الأكثر طلباً</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">${pkg.price} شهرياً</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingId(pkg.id); setEditData(pkg) }}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Teachers Tab
function TeachersTab() {
  const { data: teachers, isLoading, error } = useSWR("/api/admin/data?type=teachers", fetcher, {
    revalidateOnFocus: false,
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

  if (isLoading) return <LoadingState />
  if (error) return <div className="text-red-500 p-4">خطأ في تحميل البيانات</div>
  if (!teachers || teachers.length === 0) return <div className="p-4 text-muted-foreground">لا يوجد معلمين</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">إدارة المعلمين</h2>
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

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-bold text-foreground mb-4">معلم جديد</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">الاسم (عربي)</label>
              <input
                value={newTeacher.name.ar}
                onChange={(e) => setNewTeacher({...newTeacher, name: {...newTeacher.name, ar: e.target.value}})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                placeholder="الاسم بالعربية"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">الاسم (إنجليزي)</label>
              <input
                value={newTeacher.name.en}
                onChange={(e) => setNewTeacher({...newTeacher, name: {...newTeacher.name, en: e.target.value}})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                placeholder="Name in English"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">التخصص (عربي)</label>
              <input
                value={newTeacher.specialty.ar}
                onChange={(e) => setNewTeacher({...newTeacher, specialty: {...newTeacher.specialty, ar: e.target.value}})}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                placeholder="التخصص"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">سنوات الخبرة</label>
              <input
                type="number"
                value={newTeacher.experience}
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
        {teachers?.map((teacher: { id: string; name: Record<string, string>; specialty: Record<string, string>; experience: string; active: boolean }) => (
          <div key={teacher.id} className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">{teacher.name.ar}</p>
                <p className="text-sm text-muted-foreground">{teacher.specialty.ar} - {teacher.experience} سنة خبرة</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(teacher.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Reviews Tab
function ReviewsTab() {
  const { data: reviews, isLoading, error } = useSWR("/api/admin/data?type=reviews", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  })

  if (isLoading) return <LoadingState />
  if (error) return <div className="text-red-500 p-4">خطأ في تحميل البيانات</div>
  if (!reviews || reviews.length === 0) return <div className="p-4 text-muted-foreground">لا توجد آراء</div>

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-6">آراء الطلاب</h2>
      <div className="grid gap-4">
        {reviews?.map((review: { id: string; name: string; rating: number; text: Record<string, string>; active: boolean; createdAt: string }) => (
          <div key={review.id} className={`bg-card rounded-2xl border p-5 ${review.active ? "border-border" : "border-destructive/30 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-foreground">{review.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-secondary fill-secondary" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggle(review.id, review.active)}
                  className={`p-2 rounded-lg transition-colors ${review.active ? "hover:bg-muted text-primary" : "hover:bg-primary/10 text-muted-foreground"}`}
                  title={review.active ? "إخفاء" : "إظهار"}
                >
                  {review.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(review.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.text.ar}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Messages Tab
function MessagesTab() {
  const { data: messages, isLoading } = useSWR("/api/admin/data?type=messages", fetcher)

  const handleRead = async (id: string) => {
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "messages", id, data: { read: true } }),
    })
    globalMutate("/api/admin/data?type=messages")
    globalMutate("/api/admin/data?type=stats")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return
    await fetch(`/api/admin/data?type=messages&id=${id}`, { method: "DELETE" })
    globalMutate("/api/admin/data?type=messages")
    globalMutate("/api/admin/data?type=stats")
  }

  if (isLoading) return <LoadingState />

  if (!messages || messages.length === 0) {
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
        {messages.map((msg: { id: string; name: string; email: string; phone: string; message: string; read: boolean; createdAt: string }) => (
          <div key={msg.id} className={`bg-card rounded-2xl border p-5 ${msg.read ? "border-border" : "border-primary/30 bg-primary/5"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-foreground flex items-center gap-2">
                  {msg.name}
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                </p>
                <p className="text-xs text-muted-foreground">{msg.email} | {msg.phone}</p>
                <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString("ar-EG")}</p>
              </div>
              <div className="flex items-center gap-1">
                {!msg.read && (
                  <button onClick={() => handleRead(msg.id)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="تحديد كمقروء">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(msg.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-xl p-3">{msg.message}</p>
          </div>
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
    { name: "المعلمين", path: "/teachers", description: "قائمة المعلمين المجازين" },
    { name: "آراء الطلاب", path: "/reviews", description: "تقييمات وآراء الطلاب" },
    { name: "المكتبة", path: "/library", description: "المكتبة الرقمية" },
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

// Zapier Integration Tab
function ZapierTab() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const apiEndpoint = 'https://quran-elhafez.com/api/zapier/publish-article'
  const defaultApiKey = process.env.NEXT_PUBLIC_ZAPIER_API_KEY || 'your-secret-key-here'

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">ربط Zapier مع الموقع</h2>
        <p className="text-muted-foreground">نشر المقالات تلقائياً من Google Docs، Notion، أو Airtable</p>
      </div>

      {/* API Endpoint */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">API Endpoint</h3>
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
          <span className="flex-1 text-foreground break-all">{apiEndpoint}</span>
          <button
            onClick={() => copyToClipboard(apiEndpoint)}
            className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90"
          >
            {copied ? '✓ تم' : 'نسخ'}
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">مفتاح API</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">استخدم هذا المفتاح في headers الـ Zapier</p>
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
            <span className="flex-1">
              {showKey ? 'your-secret-key-here' : '••••••••••••••••'}
            </span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => copyToClipboard('your-secret-key-here')}
              className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90"
            >
              {copied ? '✓ تم' : 'نسخ'}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">خطوات الربط</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
            <div>
              <p className="font-medium text-foreground">افتح Zapier واختر Create Zap</p>
              <p className="text-sm text-muted-foreground">https://zapier.com/app/home</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
            <div>
              <p className="font-medium text-foreground">اختر Trigger (Google Docs / Notion / Airtable)</p>
              <p className="text-sm text-muted-foreground">الحدث الذي يشغل النشر</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
            <div>
              <p className="font-medium text-foreground">اختر Action: Webhooks by Zapier</p>
              <p className="text-sm text-muted-foreground">اختر POST من الخيارات</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
            <div>
              <p className="font-medium text-foreground">أدخل البيانات أعلاه</p>
              <p className="text-sm text-muted-foreground">URL + API Key + Body JSON</p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Body */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">مثال JSON Body</h3>
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto text-foreground font-mono">
{`{
  "slug": "article-slug",
  "title": {
    "ar": "عنوان المقالة",
    "en": "Article Title",
    "fr": "Titre de l'article"
  },
  "description": {
    "ar": "وصف المقالة",
    "en": "Description",
    "fr": "Description"
  },
  "content": {
    "ar": "<h2>محتوى المقالة</h2>",
    "en": "<h2>Article Content</h2>",
    "fr": "<h2>Contenu</h2>"
  },
  "category": "تحفيظ القرآن",
  "image": "https://example.com/image.jpg"
}`}
        </pre>
      </div>

      {/* Documentation Link */}
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <a
          href="/ZAPIER_SETUP.md"
          target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
        >
          📖 دليل كامل لـ Zapier
          <ChevronDown className="w-4 h-4" />
        </a>
      </div>
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
