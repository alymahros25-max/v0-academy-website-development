"use client"

import { useState } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { WhatsAppDialog } from "@/components/whatsapp-dialog"

export function CTASection() {
  const { locale, dir } = useI18n()
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight

  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
          {locale === "ar"
            ? "ابدأ رحلة حفظ القرآن اليوم"
            : locale === "en"
              ? "Start Your Quran Journey Today"
              : "Commencez votre parcours coranique aujourd'hui"}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto text-pretty">
          {locale === "ar"
            ? "سجّل الآن واحصل على حصة تجريبية مجانية مع أحد معلمينا المجازين"
            : locale === "en"
              ? "Register now and get a free trial session with one of our certified teachers"
              : "Inscrivez-vous maintenant et obtenez une session d'essai gratuite"}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg transition-all hover:brightness-110 hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5"
          >
            {locale === "ar" ? "سجّل الآن" : locale === "en" ? "Register Now" : "Inscrivez-vous"}
            <Arrow className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setWhatsappDialogOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground/10 text-primary-foreground rounded-xl font-bold text-lg border border-primary-foreground/20 transition-all hover:bg-primary-foreground/20 hover:-translate-y-0.5 cursor-pointer"
          >
            {locale === "ar" ? "تواصل عبر واتساب" : locale === "en" ? "Contact via WhatsApp" : "Contacter via WhatsApp"}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
        </div>

        {/* WhatsApp Dialog */}
        <WhatsAppDialog
          open={whatsappDialogOpen}
          onOpenChange={setWhatsappDialogOpen}
        />
      </div>
    </section>
  )
}
