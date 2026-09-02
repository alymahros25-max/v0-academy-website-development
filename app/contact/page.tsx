"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { WhatsAppDialog } from "@/components/whatsapp-dialog"

export default function ContactPage() {
  const { t, locale } = useI18n()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          language: locale,
        }),
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || (locale === "ar" ? "تعذر إرسال الرسالة" : "Unable to send the message"))
      }
      setSent(true)
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === "ar" ? "تعذر إرسال الرسالة" : "Unable to send the message"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto text-pretty">
            {t("contact.desc")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl p-6 lg:p-10 shadow-lg border border-border">
                {sent ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t("contact.success")}</h3>
                    <p className="text-muted-foreground">
                      {locale === "ar" ? "سنتواصل معك في أقرب وقت" : locale === "en" ? "We will contact you soon" : "Nous vous contacterons bientot"}
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all"
                    >
                      {locale === "ar" ? "إرسال رسالة أخرى" : locale === "en" ? "Send another message" : "Envoyer un autre message"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">{t("contact.name")}</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                        placeholder={locale === "ar" ? "أدخل اسمك الكامل" : locale === "en" ? "Enter your full name" : "Entrez votre nom complet"}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-2">{t("contact.email")}</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-2">{t("contact.phone")}</label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                          placeholder="+20 xxx xxx xxxx"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">{t("contact.message")}</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
                        placeholder={locale === "ar" ? "اكتب رسالتك هنا..." : locale === "en" ? "Write your message here..." : "Ecrivez votre message ici..."}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg transition-all hover:brightness-110 hover:shadow-lg disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                      {loading
                        ? locale === "ar" ? "جاري الإرسال..." : "Sending..."
                        : t("contact.send")}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                    <a href="mailto:enamel311@gmail.com" className="text-sm text-primary hover:underline">enamel311@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <button
                  onClick={() => setWhatsappDialogOpen(true)}
                  className="w-full flex items-center gap-4 mb-3 hover:opacity-80 transition-opacity text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{locale === "ar" ? "واتساب" : "WhatsApp"}</p>
                    <p className="text-sm text-primary hover:underline">{locale === "ar" ? "تواصل الآن" : "Contact Now"}</p>
                  </div>
                </button>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0088cc]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{locale === "ar" ? "تليجرام" : "Telegram"}</p>
                    <a href="https://t.me/acabemy_quraan" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">@acabemy_quraan</a>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{locale === "ar" ? "الموقع" : "Location"}</p>
                    <p className="text-sm text-muted-foreground">{locale === "ar" ? "أكاديمية اون لاين - تعليم عن بعد" : "Online Academy - Distance Learning"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Dialog */}
      <WhatsAppDialog
        open={whatsappDialogOpen}
        onOpenChange={setWhatsappDialogOpen}
      />
    </>
  )
}
