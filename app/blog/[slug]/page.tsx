import { Metadata } from 'next'
import BlogArticleClient from "./client"
import fs from 'fs/promises'
import path from 'path'

// المقالات الثابتة الافتراضية
const blogPosts: Record<string, any> = {
  "quran-memorization-techniques": {
    title: { ar: "تقنيات فعالة لحفظ القرآن الكريم", en: "Effective Techniques for Quran Memorization", fr: "Techniques de mémorisation du Coran" },
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-15",
    readTime: 8,
    image: "/images/hero-children.jpg",
    keywords: { ar: "حفظ القرآن", en: "Quran memorization", fr: "Mémorisation" },
    description: { ar: "تقنيات فعالة لحفظ القرآن", en: "Effective techniques", fr: "Techniques efficaces" },
    content: {
      ar: `<h2>التقنيات الأساسية</h2><p>حفظ القرآن يتطلب استراتيجيات منظمة وفهماً عميقاً.</p>`,
      en: `<h2>Basic Techniques</h2><p>Memorizing the Quran requires organized strategies and deep understanding.</p>`,
      fr: `<h2>Techniques de base</h2><p>La mémorisation du Coran nécessite des stratégies organisées.</p>`
    }
  },
  "arabic-foundation-importance": {
    title: { ar: "أهمية التأسيس العربي", en: "Arabic Foundation Importance", fr: "Importance de la fondation arabe" },
    category: { ar: "تأسيس العربي", en: "Arabic Foundation", fr: "Fondation Arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe" },
    date: "2024-05-10",
    readTime: 6,
    image: "/images/arabic-learning.jpg",
    keywords: { ar: "تأسيس عربي", en: "Arabic foundation", fr: "Fondation arabe" },
    description: { ar: "أهمية التأسيس القوي", en: "Strong foundation", fr: "Fondation forte" },
    content: {
      ar: `<h2>لماذا التأسيس مهم؟</h2><p>التأسيس الصحيح يشكل أساساً لكل تعلم لاحق.</p>`,
      en: `<h2>Why Foundation?</h2><p>Proper foundation is crucial for future learning.</p>`,
      fr: `<h2>Pourquoi?</h2><p>Une bonne base est essentielle.</p>`
    }
  },
  "online-learning-benefits": {
    title: { ar: "فوائد التعليم الإلكتروني", en: "Benefits of Online Learning", fr: "Avantages du e-learning" },
    category: { ar: "التعليم الإلكتروني", en: "Online Learning", fr: "Apprentissage en ligne" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe" },
    date: "2024-05-05",
    readTime: 7,
    image: "/images/online-learning.jpg",
    keywords: { ar: "التعليم الإلكتروني", en: "Online education", fr: "Éducation en ligne" },
    description: { ar: "مميزات التعليم الإلكتروني", en: "Online learning benefits", fr: "Avantages" },
    content: {
      ar: `<h2>مميزات التعليم الإلكتروني</h2><p>التعليم الإلكتروني أصبح طريقة تعليم فعالة وحديثة.</p>`,
      en: `<h2>Online Learning Benefits</h2><p>Online learning is now an effective and modern teaching method.</p>`,
      fr: `<h2>Avantages</h2><p>L'apprentissage en ligne est maintenant une méthode efficace.</p>`
    }
  }
}

// قراءة المقالات من Zapier
async function readZapierArticles() {
  try {
    const zapierFile = path.join(process.cwd(), 'data', 'zapier-articles.json')
    const data = await fs.readFile(zapierFile, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]
  if (!post) return { title: "Not Found" }

  const baseUrl = 'https://quran-elhafez.com'
  const articleUrl = `${baseUrl}/blog/${params.slug}`

  return {
    title: post.title.ar,
    description: post.description.ar,
    keywords: post.keywords.ar,
    alternates: {
      languages: {
        'ar': articleUrl,
        'en': `${articleUrl}?lang=en`,
        'fr': `${articleUrl}?lang=fr`,
        'x-default': articleUrl,
      },
    },
    openGraph: {
      title: post.title.ar,
      description: post.description.ar,
      type: 'article',
      url: articleUrl,
      images: [{ url: post.image }],
      publishedTime: post.date,
      authors: [post.author.ar],
      tags: post.keywords.ar.split(', '),
    },
  }
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  // دمج المقالات الثابتة مع مقالات Zapier
  const zapierArticles = await readZapierArticles()
  const allPosts = { ...blogPosts, ...zapierArticles }
  
  return <BlogArticleClient slug={params.slug} blogPosts={allPosts} />
}
