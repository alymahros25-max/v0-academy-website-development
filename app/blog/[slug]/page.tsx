import { Metadata } from "next"
import BlogArticleClient from "./client"

const blogPosts: Record<string, any> = {
  "quran-memorization-techniques": {
    title: { ar: "تقنيات فعالة لحفظ القرآن الكريم في أقل وقت", en: "Effective Techniques for Quran Memorization", fr: "Techniques efficaces pour mémoriser le Coran" },
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-15",
    readTime: 8,
    image: "/images/hero-children.jpg",
    keywords: { ar: "حفظ القرآن، تقنيات الحفظ، التجويد", en: "Quran memorization, memorization techniques, tajweed", fr: "Mémorisation du Coran, techniques" },
    description: { ar: "تعرف على أفضل الطرق والتقنيات لحفظ القرآن الكريم بسرعة وفعالية.", en: "Learn the best methods for effective Quran memorization.", fr: "Découvrez les meilleures méthodes de mémorisation." }
  },
  "arabic-foundation-importance": {
    title: { ar: "أهمية التأسيس الصحيح في اللغة العربية", en: "Importance of Arabic Language Foundation", fr: "Importance de la fondation en langue arabe" },
    category: { ar: "تأسيس العربي", en: "Arabic Foundation", fr: "Fondation Arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-10",
    readTime: 6,
    image: "/images/arabic-learning.jpg",
    keywords: { ar: "تأسيس العربية، اللغة العربية، تعليم اللغة", en: "Arabic foundation, Arabic language, learning", fr: "Fondation arabe, langue arabe" },
    description: { ar: "معرفة أهمية التأسيس القوي في اللغة العربية للأطفال.", en: "Understanding the importance of strong Arabic foundation.", fr: "Comprendre l'importance d'une bonne base en arabe." }
  },
  "online-learning-benefits": {
    title: { ar: "فوائد التعليم الإلكتروني", en: "Benefits of Online Learning", fr: "Avantages de l'apprentissage en ligne" },
    category: { ar: "التعليم الإلكتروني", en: "Online Learning", fr: "Apprentissage en ligne" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-05",
    readTime: 7,
    image: "/images/about-academy.jpg",
    keywords: { ar: "التعليم الإلكتروني، التعليم أون لاين، المرونة", en: "Online education, e-learning, flexibility", fr: "Éducation en ligne, apprentissage en ligne" },
    description: { ar: "اكتشف مميزات التعليم الإلكتروني والحصص الفردية.", en: "Discover the benefits of online education and individual sessions.", fr: "Découvrez les avantages de l'éducation en ligne." }
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]
  if (!post) return { title: "Not Found" }

  return {
    title: post.title.ar,
    description: post.description.ar,
    keywords: post.keywords.ar,
    openGraph: {
      title: post.title.ar,
      description: post.description.ar,
      images: [{ url: post.image }],
    },
  }
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  return <BlogArticleClient slug={params.slug} blogPosts={blogPosts} />
}
