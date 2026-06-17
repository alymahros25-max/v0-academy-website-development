"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FloatingButtons } from "@/components/floating-buttons"
import { Calendar, Clock, User, Tag } from "lucide-react"

const blogPosts = [
  {
    slug: "quran-memorization-techniques",
    title: {
      ar: "تقنيات فعالة لحفظ القرآن الكريم في أقل وقت",
      en: "Effective Techniques for Quran Memorization in Less Time",
      fr: "Techniques efficaces pour mémoriser le Coran en moins de temps"
    },
    category: {
      ar: "تحفيظ القرآن",
      en: "Quran Memorization",
      fr: "Mémorisation du Coran"
    },
    author: {
      ar: "فريق الأكاديمية",
      en: "Academy Team",
      fr: "Équipe de l'académie"
    },
    date: "2024-06-15",
    readTime: 9,
    image: "/images/hero-children.jpg",
    excerpt: {
      ar: "اكتشف الطرق العملية والمثبتة لتحسين كفاءة الحفظ وتقليل الوقت المستغرق بمساعدة معلمينا المتخصصين.",
      en: "Discover practical and proven methods to improve memorization efficiency and reduce time with the help of our specialized teachers.",
      fr: "Découvrez des méthodes pratiques et éprouvées pour améliorer l'efficacité de la mémorisation."
    },
    content: {
      ar: `<h2>التقنيات الأساسية لحفظ القرآن</h2>
<p>حفظ القرآن الكريم ليس مجرد تكرار ميكانيكي للآيات، بل هو عملية تتطلب فهماً عميقاً وتقنيات منظمة. في أكاديمية الحافظ المتميز، نركز على تطوير استراتيجيات حفظ مخصصة تناسب احتياجات كل طالب.</p>

<h3>1. التقسيم الذكي للآيات</h3>
<p>بدلاً من محاولة حفظ سورة كاملة دفعة واحدة، ننصح بتقسيم السورة إلى أجزاء صغيرة (3-5 آيات). هذا يسهل على الدماغ معالجة المعلومات وتخزينها في الذاكرة طويلة الأمد بكفاءة أكبر.</p>

<h3>2. الفهم قبل الحفظ</h3>
<p>معرفة معنى الآيات وسياقها يزيد من قوة الذاكرة بشكل كبير. نوصي بقراءة التفسير البسيط لكل آية قبل البدء بحفظها، مما يربط الكلمات بالمعاني ويجعل الحفظ أسهل وأدوم.</p>

<h3>3. التكرار المنتظم</h3>
<p>لا تنسَ أن الحفظ يحتاج إلى تكرار منتظم. جدول الحفظ اليومي الذي ننصح به يتضمن: حفظ جديد (30 دقيقة)، مراجعة الحفظ السابق (20 دقيقة)، وحفظ متكرر من السور السابقة (15 دقيقة).</p>

<h3>4. الاستماع والترديد</h3>
<p>الاستماع لتلاوات قرآنية جيدة قبل الحفظ يساعد على تثبيت الكلمات والنطق الصحيح. ترديد الآيات بصوت مرتفع عدة مرات يعزز الذاكرة السمعية والحركية.</p>

<h3>5. الراحة والتغذية السليمة</h3>
<p>لا تهمل أهمية النوم الكافي والتغذية الصحية. المخ يحتاج إلى طاقة كافية للعمل بكفاءة، والنوم ضروري لتثبيت المعلومات في الذاكرة.</p>

<h2>نصائح من معلمينا المتخصصين</h2>
<p>معلمونا في الأكاديمية لديهم خبرة طويلة في تعليم القرآن ولاحظوا أن الطلاب الذين يحققون أفضل النتائج يتبعون هذه الخطوات:</p>
<ul>
<li>تحديد هدف واقعي يومي (5-10 آيات)</li>
<li>اختيار الوقت الأنسب عندما تكون الذاكرة في أفضل حالاتها (عادة في الصباح)</li>
<li>الاستمرار بصبر وعدم الاستعجال</li>
<li>طلب المساعدة من معلم متخصص للتصحيح والتوجيه</li>
</ul>

<h2>الخلاصة</h2>
<p>حفظ القرآن الكريم هو رحلة روحية وعلمية تحتاج إلى تنظيم وإصرار. باتباع هذه التقنيات والاستفادة من توجيهات معلمينا المتخصصين، ستجد نفسك تتقدم بخطوات ثابتة نحو تحقيق هدفك.</p>`,
      en: `<h2>Basic Techniques for Quranic Memorization</h2>
<p>Memorizing the Quran is not just mechanical repetition of verses, but a process that requires deep understanding and organized techniques. At Al-Hafiz Academy, we focus on developing customized memorization strategies tailored to each student's needs.</p>

<h3>1. Smart Verse Division</h3>
<p>Instead of trying to memorize a complete Surah at once, we recommend dividing it into small sections (3-5 verses). This makes it easier for the brain to process and store information in long-term memory more efficiently.</p>

<h3>2. Understanding Before Memorization</h3>
<p>Knowing the meaning of verses and their context significantly strengthens memory. We recommend reading simple interpretations of each verse before starting to memorize it, which links words to meanings and makes memorization easier and more lasting.</p>

<h3>3. Regular Repetition</h3>
<p>Remember that memorization requires regular repetition. Our recommended daily schedule includes: new memorization (30 minutes), previous memorization review (20 minutes), and repeated memorization from previous chapters (15 minutes).</p>

<h3>4. Listening and Recitation</h3>
<p>Listening to good Quranic recitations before memorizing helps establish correct words and pronunciation. Reciting verses aloud several times strengthens auditory and kinesthetic memory.</p>

<h3>5. Rest and Proper Nutrition</h3>
<p>Don't neglect the importance of adequate sleep and healthy nutrition. The brain needs enough energy to work efficiently, and sleep is necessary to consolidate information in memory.</p>

<h2>Tips from Our Specialized Teachers</h2>
<p>Our academy teachers have long experience in Quran teaching and have noticed that students who achieve the best results follow these steps:</p>
<ul>
<li>Set a realistic daily goal (5-10 verses)</li>
<li>Choose the best time when memory is at its peak (usually in the morning)</li>
<li>Persist with patience without rushing</li>
<li>Seek help from a specialized teacher for correction and guidance</li>
</ul>

<h2>Conclusion</h2>
<p>Memorizing the Holy Quran is a spiritual and scientific journey that requires organization and determination. By following these techniques and benefiting from our specialized teachers' guidance, you will find yourself progressing steadily toward achieving your goal.</p>`,
      fr: `<h2>Techniques de base pour la mémorisation du Coran</h2>
<p>Mémoriser le Coran n'est pas seulement une répétition mécanique de versets, mais un processus qui nécessite une compréhension profonde et des techniques organisées. À l'Académie Al-Hafiz, nous nous concentrons sur le développement de stratégies de mémorisation personnalisées adaptées aux besoins de chaque étudiant.</p>`
    },
    image: "/images/quran-memorization.jpg",
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-15",
    readTime: 8
  },
  {
    slug: "arabic-foundation-importance",
    title: {
      ar: "أهمية التأسيس الصحيح في اللغة العربية للأطفال",
      en: "The Importance of Proper Arabic Language Foundation for Children",
      fr: "L'importance d'une bonne base en langue arabe pour les enfants"
    },
    excerpt: {
      ar: "تعرف على سبب أهمية التأسيس القوي في اللغة العربية وكيف يؤثر على التعلم المستقبلي والقراءة والكتابة.",
      en: "Learn why a strong Arabic language foundation is important and how it affects future learning, reading, and writing.",
      fr: "Découvrez pourquoi une bonne base en langue arabe est importante et comment elle affecte l'apprentissage futur."
    },
    content: {
      ar: `<h2>لماذا التأسيس مهم جداً؟</h2>
<p>تأسيس اللغة العربية الصحيح في السنوات الأولى من التعليم يشكل أساساً متيناً لكل تعلم لاحق. الأطفال الذين يحصلون على تأسيس قوي يجدون صعوبة أقل في التعلم اللاحق والقراءة والكتابة.</p>

<h3>المهارات الأساسية</h3>
<p>يجب أن يتمكن الطفل من: التعرف على الحروف، فهم الحركات (الفتحة والضمة والكسرة)، تكوين كلمات بسيطة، والقراءة بطلاقة.</p>

<h3>التأثير على الثقة بالنفس</h3>
<p>الطفل الذي يشعر بأنه متمكن من اللغة يثق بنفسه أكثر ويشارك بفعالية في الفصل الدراسي.</p>`,
      en: `<h2>Why Foundation is So Important?</h2>
<p>Proper Arabic language foundation in the early years of education creates a solid foundation for all future learning. Children who receive a strong foundation find it easier to learn later, read, and write.</p>

<h3>Basic Skills</h3>
<p>A child should be able to: recognize letters, understand vowels (Fatha, Damma, Kasra), form simple words, and read fluently.</p>`,
      fr: `<h2>Pourquoi la fondation est-elle si importante?</h2>
<p>Une bonne base en langue arabe dans les premières années de l'éducation crée une fondation solide pour tous les apprentissages futurs.</p>`
    },
    image: "/images/arabic-learning.jpg",
    category: { ar: "تأسيس العربي", en: "Arabic Foundation", fr: "Fondation Arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-10",
    readTime: 6
  },
  {
    slug: "online-learning-benefits",
    title: {
      ar: "فوائد التعليم الإلكتروني في تحسين مستوى الطلاب",
      en: "Benefits of Online Learning in Improving Student Levels",
      fr: "Avantages de l'apprentissage en ligne pour améliorer le niveau des étudiants"
    },
    excerpt: {
      ar: "اكتشف مميزات التعليم الإلكتروني والحصص الفردية وكيف تساهم في تطور الطلاب بشكل أسرع وأكثر فعالية.",
      en: "Discover the advantages of online learning and individual sessions and how they contribute to faster and more effective student development.",
      fr: "Découvrez les avantages de l'apprentissage en ligne et des sessions individuelles et comment elles contribuent au développement plus rapide."
    },
    content: {
      ar: `<h2>مميزات التعليم الإلكتروني</h2>
<p>التعليم الإلكتروني لم يعد خياراً ثانوياً، بل أصبح طريقة تعليم فعالة وحديثة. في أكاديمية الحافظ المتميز، نستفيد من أحدث التقنيات لتقديم خدمة تعليمية من الدرجة الأولى.</p>

<h3>1. المرونة الزمنية</h3>
<p>يمكن للطالب اختيار الوقت المناسب له للدراسة، وهذا يزيد من الراحة النفسية والتركيز.</p>

<h3>2. الدراسة من أي مكان</h3>
<p>لا حاجة للتنقل والذهاب إلى مراكز التعليم. يمكن الدراسة من المنزل براحة تامة.</p>

<h3>3. الحصص الفردية المخصصة</h3>
<p>كل طالب يحصل على انتباه كامل من المعلم، وهذا يؤدي إلى فهم أعمق وتقدم أسرع.</p>

<h3>4. المتابعة المستمرة</h3>
<p>معلمونا يتابعون تقدم كل طالب بشكل يومي ويقدمون تقارير شاملة للأهل عن المستويات والتطور.</p>`,
      en: `<h2>Advantages of Online Learning</h2>
<p>Online learning is no longer a secondary option, but has become an effective and modern teaching method. At Al-Hafiz Academy, we leverage the latest technologies to provide first-class educational service.</p>

<h3>1. Time Flexibility</h3>
<p>Students can choose the time that suits them for studying, which increases comfort and concentration.</p>

<h3>2. Study from Anywhere</h3>
<p>No need to travel to educational centers. You can study from the comfort of your home.</p>`,
      fr: `<h2>Avantages de l'apprentissage en ligne</h2>
<p>L'apprentissage en ligne n'est plus une option secondaire, mais est devenu une méthode d'enseignement efficace et moderne.</p>`
    },
    image: "/images/online-learning.jpg",
    category: { ar: "التعليم الإلكتروني", en: "Online Learning", fr: "Apprentissage en ligne" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-05-05",
    readTime: 7
  }
]

export default function BlogPage() {
  const { t, locale, dir } = useI18n()

  return (
    <div dir={dir} className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 text-center">
            {t("blog.title")}
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("blog.desc")}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="group cursor-pointer h-full">
                  <div className="rounded-xl overflow-hidden bg-card border border-border transition-all hover:shadow-lg hover:border-primary/50">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title[locale]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-4">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Tag className="w-3 h-3" />
                          <span>{post.category[locale]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US')}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title[locale]}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.excerpt[locale]}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author[locale]}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime} {t("blog.readTime")}</span>
                          </div>
                        </div>
                      </div>

                      {/* Read More */}
                      <button className="inline-flex items-center justify-center w-full mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium transition-all hover:bg-primary hover:text-primary-foreground">
                        {t("common.readMore")}
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
