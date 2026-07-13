"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const { t, locale, dir } = useI18n()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        // Validation for sign up
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
          throw new Error(locale === 'ar' ? 'جميع الحقول مطلوبة' : locale === 'fr' ? 'Tous les champs sont obligatoires' : 'All fields are required')
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error(locale === 'ar' ? 'كلمات المرور غير متطابقة' : locale === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
        }
        if (formData.password.length < 6) {
          throw new Error(locale === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : locale === 'fr' ? 'Le mot de passe doit avoir au moins 6 caractères' : 'Password must be at least 6 characters')
        }
      } else {
        // Validation for sign in
        if (!formData.email || !formData.password) {
          throw new Error(locale === 'ar' ? 'البريد الإلكتروني وكلمة المرور مطلوبان' : locale === 'fr' ? 'E-mail et mot de passe requis' : 'Email and password required')
        }
      }

      // Simulate API call
      setTimeout(() => {
        setSuccess(true)
        setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
        setTimeout(() => setSuccess(false), 3000)
      }, 1000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />

      <section className="pt-28 pb-16">
        <div className="max-w-md mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {isSignUp ? t("account.signup") : t("account.login")}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? (locale === 'ar' ? 'إنشاء حساب جديد في أكاديمية الحافظ المتميز' : locale === 'fr' ? 'Créer un nouveau compte' : 'Create a new account')
                : (locale === 'ar' ? 'تسجيل الدخول إلى حسابك' : locale === 'fr' ? 'Connectez-vous à votre compte' : 'Sign in to your account')}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  {isSignUp
                    ? (locale === 'ar' ? 'تم إنشاء الحساب بنجاح!' : locale === 'fr' ? 'Compte créé avec succès!' : 'Account created successfully!')
                    : (locale === 'ar' ? 'تم تسجيل الدخول بنجاح!' : locale === 'fr' ? 'Connexion réussie!' : 'Sign in successful!')}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("account.name")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" style={{ [dir === 'rtl' ? 'right' : 'left']: '12px' }} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={locale === 'ar' ? 'اسمك الكامل' : locale === 'fr' ? 'Votre nom complet' : 'Your full name'}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("account.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" style={{ [dir === 'rtl' ? 'right' : 'left']: '12px' }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : locale === 'fr' ? 'Votre e-mail' : 'Your email'}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("account.phone")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" style={{ [dir === 'rtl' ? 'right' : 'left']: '12px' }} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={locale === 'ar' ? 'رقم هاتفك' : locale === 'fr' ? 'Votre téléphone' : 'Your phone number'}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("account.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" style={{ [dir === 'rtl' ? 'right' : 'left']: '12px' }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={locale === 'ar' ? 'كلمة المرور' : locale === 'fr' ? 'Mot de passe' : 'Password'}
                    className="w-full pl-10 pr-12 py-2.5 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    style={{ [dir === 'rtl' ? 'left' : 'right']: '12px' }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {locale === 'ar' ? 'تأكيد كلمة المرور' : locale === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" style={{ [dir === 'rtl' ? 'right' : 'left']: '12px' }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={locale === 'ar' ? 'أعد كتابة كلمة المرور' : locale === 'fr' ? 'Confirmez le mot de passe' : 'Confirm password'}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (locale === 'ar' ? 'جاري معالجة الدفع الرقمي ...' : locale === 'fr' ? 'En cours...' : 'Processing...') : (isSignUp ? t("account.signup") : t("account.login"))}
              </button>

              {/* Toggle Sign Up / Sign In */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {isSignUp ? t("account.haveAccount") : t("account.dontHaveAccount")}
                  {' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
                      setError("")
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    {isSignUp ? t("account.login") : t("account.signup")}
                  </button>
                </p>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">
                {locale === 'ar'
                  ? 'حسابك آمن تماماً. نستخدم أحدث تقنيات التشفير لحماية بياناتك الشخصية.'
                  : locale === 'fr'
                  ? 'Votre compte est entièrement sécurisé. Nous utilisons les dernières technologies de chiffrement.'
                  : 'Your account is completely secure. We use the latest encryption technologies to protect your data.'}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {locale === 'ar'
                ? 'بعد إنشاء الحساب، يمكنك الاشتراك في أي من باقاتنا التعليمية.'
                : locale === 'fr'
                ? 'Après avoir créé votre compte, vous pouvez vous abonner à l\'un de nos forfaits éducatifs.'
                : 'After creating your account, you can subscribe to any of our educational packages.'}
            </p>
            <Link href="/quran" className="inline-block px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-bold hover:brightness-110 transition">
              {t("nav.quran")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
