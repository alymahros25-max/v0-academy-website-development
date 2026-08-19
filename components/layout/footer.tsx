"use client"

import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const { t, locale, dir } = useI18n()

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/teachers", label: t("nav.teachers") },
    { href: "/reviews", label: t("nav.reviews") },
    { href: "/library", label: t("nav.library") },
    { href: "/faq", label: t("nav.faq") },
    { href: "/contact", label: t("nav.contact") },
  ]

  const serviceLinks = [
    { href: "/quran", label: locale === "ar" ? "أسعار تحفيظ القرآن" : locale === "en" ? "Quran Pricing" : "Tarifs mémorisation du Coran" },
    { href: "/arabic", label: locale === "ar" ? "أسعار تأسيس العربي" : locale === "en" ? "Arabic Foundation Pricing" : "Tarifs fondation arabe" },
    { href: "/games", label: t("nav.games") },
    { href: "/library", label: t("nav.library") },
    { href: "/classroom-moments", label: locale === "ar" ? "فيديوهات من حصصنا" : locale === "en" ? "Videos from our classes" : "Vidéos de nos cours" },
    { href: "/saudi-arabia", label: locale === "ar" ? "تحفيظ القرآن واللغة العربية في السعودية" : locale === "en" ? "Quran and Arabic in Saudi Arabia" : "Coran et arabe en Arabie Saoudite" },
    { href: "/united-arab-emirates", label: locale === "ar" ? "تحفيظ القرآن واللغة العربية في الإمارات" : locale === "en" ? "Quran and Arabic in the UAE" : "Coran et arabe aux Émirats" },
  ]

  const legalLinks = [
    { href: "/privacy", label: t("footer.privacy") },
    { href: "/terms", label: t("footer.terms") },
    { href: "/refund-policy", label: t("footer.refund") },
  ]

  return (
    <footer dir={dir} className="bg-primary text-primary-foreground">
      {/* Decorative top border */}
      <div className="h-1 bg-secondary" />

      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-secondary overflow-hidden">
                <Image src="/logo.png" alt="شعار أكاديمية الحافظ المتميز" width={56} height={56} style={{ width: "56px", height: "56px" }} className="size-14 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-primary-foreground">
                  {locale === "ar" ? "الحافظ المتميز" : "Al-Hafiz Academy"}
                </span>
                <span className="text-xs text-secondary">
                  {locale === "ar" ? "أكاديمية اون لاين" : "Online Academy"}
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/90 text-sm leading-relaxed mb-4">
              {locale === "ar"
                ? "نقدم خدمات تحفيظ القرآن الكريم واللغة العربية أونلاين للطلاب في دول الخليج العربي (السعودية، الإمارات، الكويت، قطر، البحرين، عمان) والجاليات العربية في أمريكا، بريطانيا، فرنسا، ألمانيا، وإيطاليا."
                : locale === "en"
                  ? "We provide Quranic memorization and Arabic language education online for students in Gulf countries (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman) and Arab diaspora in USA, UK, France, Germany, and Italy."
                  : "Nous offrons l'apprentissage de la mémorisation du Coran et de la langue arabe en ligne pour les étudiants des pays du Golfe (Arabie Saoudite, Émirats, Koweït, Qatar, Bahreïn, Oman) et la diaspora arabe en Amérique, Royaume-Uni, France, Allemagne et Italie."}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://bit.ly/4aJfOl6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                aria-label={locale === "ar" ? "واتساب" : "WhatsApp"}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://t.me/acabemy_quraan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="mailto:enamel311@gmail.com"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-secondary mb-4">{t("footer.quickLinks")}</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-secondary mb-4">{t("footer.services")}</h3>
            <ul className="flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <h4 className="font-bold text-secondary mb-2 text-sm">{t("footer.legal")}</h4>
                <ul className="flex flex-col gap-2">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-secondary mb-4">{t("footer.contact")}</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <a href="mailto:enamel311@gmail.com" className="hover:text-secondary transition-colors">
                  enamel311@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <a href="https://bit.ly/4aJfOl6" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  {locale === "ar" ? "��واصل عبر WhatsApp" : "Contact via WhatsApp"}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/90">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>
                  {locale === "ar" ? "أكاديمية اون لاين - تعليم عن بعد" : "Online Academy - Distance Learning"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/90 leading-relaxed mb-6">
            {locale === "ar"
              ? "منصة الحافظ المتميز هي منصة تعليم إلكترونية رقمية 100%. جميع البرامج التعليمية والدورات والمكتبة الرقمية والألعاب يتم تسليمها بالكامل عبر الإنترنت. وصول فوري - لا توجد خدمات خارج الإنترنت."
              : locale === "en"
                ? "Al-Hafez Al-Motamayez is a 100% digital e-learning platform. All educational programs, courses, digital assets, and games are delivered entirely online via our integrated virtual classroom and browser. No physical goods or offline services are provided."
                : "Al-Hafez Al-Motamayez est une plateforme d'apprentissage numérique à 100%. Tous les programmes éducatifs, les cours, les actifs numériques et les jeux sont livrés entièrement en ligne via notre salle de classe virtuelle intégrée. Aucun produit physique ou service hors ligne n'est fourni."}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-primary-foreground/10">
            <p className="text-sm text-primary-foreground/80">
              &copy; {new Date().getFullYear()}{" "}
              {locale === "ar" ? "أكاديمية الحافظ المتميز" : "Al-Hafiz Al-Mutamayez Academy"}.{" "}
              {t("footer.rights")}
            </p>
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-primary-foreground/90 hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
