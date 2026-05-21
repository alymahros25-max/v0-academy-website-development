"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { CalendarIcon, ClockIcon, UserIcon, ChevronLeft } from "lucide-react"

const blogPosts: Record<string, any> = {
  "quran-memorization-techniques": {
    title: { ar: "تقنيات فعالة لحفظ القرآن الكريم في أقل وقت", en: "Effective Techniques for Quran Memorization", fr: "Techniques efficaces pour mémoriser le Coran" },
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-15",
    readTime: 8,
    image: "/images/quran-memorization.jpg",
    description: { ar: "تعرف على أفضل الطرق والتقنيات لحفظ القرآن بسرعة وفعالية.", en: "Learn the best methods for effective Quran memorization.", fr: "Découvrez les meilleures méthodes de mémorisation." },
  },
  "arabic-foundation-importance": {
    title: { ar: "أهمية التأسيس الصحيح في اللغة العربية للأطفال", en: "Importance of Arabic Language Foundation for Children", fr: "Importance de la fondation en langue arabe pour les enfants" },
    category: { ar: "تأسيس العربي", en: "Arabic Foundation", fr: "Fondation Arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-10",
    readTime: 6,
    image: "/images/arabic-learning.jpg",
    description: { ar: "معرفة أهمية التأسيس القوي في اللغة العربية للأطفال.", en: "Understanding the importance of strong Arabic foundation.", fr: "Comprendre l'importance d'une bonne base en arabe." },
  },
  "online-learning-benefits": {
    title: { ar: "فوائد التعليم الإلكتروني في تحسين مستوى الطلاب", en: "Benefits of Online Learning in Student Development", fr: "Avantages de l'apprentissage en ligne pour les étudiants" },
    category: { ar: "التعليم الإلكتروني", en: "Online Learning", fr: "Apprentissage en ligne" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-05",
    readTime: 7,
    image: "/images/online-learning.jpg",
    description: { ar: "اكتشف مميزات التعليم الإلكتروني والحصص الفردية.", en: "Discover the benefits of online education and individual sessions.", fr: "Découvrez les avantages de l'éducation en ligne." },
  }
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]
  if (!post) return {}

  return {
    title: post.title.ar,
    description: post.description.ar,
  }
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const { t, locale, dir } = useI18n()
  const post = blogPosts[params.slug]

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
            <Link href="/" className="hover:text-primary transition">{t("nav.home")}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition">{t("nav.blog")}</Link>
            <span>/</span>
            <span className="text-primary line-clamp-1">{post.title[locale]}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title[locale]}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground py-6 border-y border-border">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-secondary" />
                <span>{post.author[locale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-secondary" />
                <span>{new Date(post.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-secondary" />
                <span>{post.readTime} {t("blog.readTime")}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                <span>{post.category[locale]}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={post.image}
              alt={post.title[locale]}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12 space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              {post.description[locale]}
            </p>

            <div className="bg-primary/5 border-l-4 border-primary rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-2 text-lg">{locale === 'ar' ? 'ملخص المقالة' : locale === 'fr' ? 'Résumé de l\'article' : 'Article Summary'}</h3>
              <p className="text-muted-foreground">
                {locale === 'ar' 
                  ? 'هذه المقالة تقدم نظرة شاملة على الموضوع مع نصائح عملية وقابلة للتطبيق. اقرأ المزيد لفهم أعمق وتطبيق أفضل لتحسين مستواك التعليمي.'
                  : locale === 'fr'
                  ? 'Cet article offre une vue d\'ensemble complète du sujet avec des conseils pratiques et applicables.'
                  : 'This article provides a comprehensive overview of the topic with practical and applicable tips.'}
              </p>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8">
              {locale === 'ar' ? 'محتوى المقالة' : locale === 'fr' ? 'Contenu de l\'article' : 'Article Content'}
            </h2>
            
            <p className="text-base leading-relaxed text-foreground">
              {locale === 'ar'
                ? 'تحتوي هذه المقالة على معلومات حصرية وأساليب مبتكرة تم تطويرها من خلال سنوات من التجربة والممارسة في مجال التعليم. نوصيك بقراءتها بتمعن وتطبيق النصائح المذكورة فيها.'
                : locale === 'fr'
                ? 'Cet article contient des informations exclusives et des méthodes innovantes développées à travers des années d\'expérience dans le domaine de l\'éducation.'
                : 'This article contains exclusive information and innovative methods developed through years of experience in the field of education.'}
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-12">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:gap-4 transition-all font-medium">
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
