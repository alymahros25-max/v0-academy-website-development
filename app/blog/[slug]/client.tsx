"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { CalendarIcon, ClockIcon, UserIcon, ChevronLeft, ChevronRight } from "lucide-react"

export default function BlogArticleClient({ slug, blogPosts }: { slug: string; blogPosts: Record<string, any> }) {
  const { t, locale, dir } = useI18n()
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />

      <article className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition">
              {t("nav.blog")}
            </Link>
            <span>/</span>
            <span className="text-primary">{post.title[locale]}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">{post.title[locale]}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{post.author[locale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString(locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US")}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>
                  {post.readTime} {t("blog.readTime")}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <span>{post.category[locale]}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title[locale]}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12 space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {locale === "ar" && "محتوى المقالة يتضمن معلومات قيمة وشاملة عن الموضوع المختار."}
              {locale === "en" && "This article contains valuable and comprehensive information about the selected topic."}
              {locale === "fr" && "Cet article contient des informations précieuses et complètes sur le sujet sélectionné."}
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2">{t("blog.relatedArticles")}</h3>
              <p className="text-sm text-muted-foreground">
                {locale === "ar" && "تابع مدونتنا للمزيد من المقالات المفيدة والمتخصصة في مجال تعليم القرآن واللغة العربية."}
                {locale === "en" && "Follow our blog for more useful articles on Quran education and Arabic language."}
                {locale === "fr" && "Suivez notre blog pour d'autres articles utiles sur l'éducation coranique et la langue arabe."}
              </p>
            </div>
          </div>

          {/* Share & Navigation */}
          <div className="border-t border-b border-border py-6 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {t("blog.publishedOn")} {new Date(post.date).toLocaleDateString()}
            </span>
            <Link href="/blog" className="flex items-center gap-2 text-primary hover:gap-3 transition-all">
              <ChevronLeft className="w-4 h-4" />
              {t("blog.backToBlog")}
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
