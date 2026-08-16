import { Metadata } from 'next'
import BlogArticleClient from "./client"
import fs from 'fs/promises'
import path from 'path'

// المقالات الثابتة الافتراضية
const blogPosts: Record<string, any> = {
  "quran-memorization-techniques": {
    title: { ar: "تقنيات فعالة لحفظ القرآن الكريم في أقل وقت", en: "Effective Techniques for Quran Memorization in Less Time", fr: "Techniques efficaces pour mémoriser le Coran en moins de temps" },
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-06-15",
    readTime: 9,
    image: "/images/hero-children.jpg",
    keywords: { ar: "حفظ القرآن، التقنيات، التجويد", en: "Quran memorization, techniques, tajweed", fr: "Mémorisation du Coran, techniques" },
    description: { ar: "تقنيات عملية وفعالة لحفظ القرآن الكريم بسرعة واتقان باستخدام أحدث الطرق المجربة والناجحة", en: "Practical and effective techniques for memorizing the Holy Quran quickly and accurately", fr: "Techniques pratiques et efficaces pour mémoriser le Coran rapidement" },
    content: {
      ar: `<h2>مقدمة</h2>
<p>حفظ القرآن الكريم أمنية غالية لكل مسلم ومسلمة، ولأولياء الأمور الذين يطمحون لرؤية أبنائهم من أهل القرآن. ومع تسارع وتيرة الحياة، يبحث الكثيرون عن طرق ذكية وعملية تساعدهم على تحقيق هذا الهدف العظيم بكفاءة عالية وبأقل جهد ووقت ممكن.</p>

<h2>أبرز التقنيات العملية لحفظ سريع ومتقن</h2>

<h3>1. تقنية "الربط البصري والذهني"</h3>
<p>تعتمد هذه الطريقة على قراءة الآيات من مصحف واحد ثابت (لا تتغير طبعته). العقل البشري يقوم بـ "تصوير" الصفحة وتخزين مكان الآيات (أعلى، منتصف، أو أسفل الصفحة)، مما يسهل استرجاعها أثناء التسميع.</p>

<h3>2. التكرار الموزع (Spaced Repetition)</h3>
<p>بدلاً من تكرار الآية 50 مرة متتالية في نفس الجلسة، أثبتت الدراسات أن تكرارها 10 مرات في الصباح، و10 مرات في المساء، ومراجعتها قبل النوم، يرسخ الحفظ في الذاكرة طويلة المدى بشكل أسرع وأقوى.</p>

<h3>3. فهم المعاني وسياق الآيات</h3>
<p>من المستحيل تقريباً حفظ ما لا تفهمه بشكل سريع. قراءة تفسير ميسر قبل البدء بالحفظ تختصر نصف الوقت، حيث يصبح الحفظ عبارة عن تسلسل أفكار وقصص مترابطة بدلاً من مجرد كلمات مجردة.</p>

<h3>4. الاستماع النشط قبل الحفظ</h3>
<p>الاستماع للقارئ المفضل لديك بتركيز (مع التركيز على أحكام التجويد ومخارج الحروف) لعدة مرات قبل البدء بالحفظ الفعلي، يجعل لسانك ينطق الآيات بسلاسة ودون أخطاء عند الحفظ.</p>

<h2>دور التوجيه والمتابعة</h2>
<p>الحفظ الفردي قد يصيبه الفتور؛ لذلك فإن الانضمام إلى حلقات تحفيظ تحت إشراف معلمين متخصصين يوفر لك:</p>
<ul>
<li>خطة زمنية مخصصة لقدراتك.</li>
<li>التزاماً يومياً يمنع التسويف.</li>
<li>تصحيحاً فورياً لمخارج الحروف وأحكام التجويد.</li>
</ul>`,
      en: `<h2>Introduction</h2>
<p>Memorizing the Holy Quran is a precious wish for every Muslim, and for parents who aspire to see their children as people of the Quran. With the accelerating pace of life, many seek smart and practical ways to achieve this great goal with high efficiency and minimal effort and time.</p>`,
      fr: `<h2>Introduction</h2>
<p>Mémoriser le Saint Coran est un vœu précieux pour chaque musulman et musulmane. Avec l'accélération du rythme de la vie, beaucoup cherchent des moyens intelligents et pratiques pour atteindre cet objectif merveilleux.</p>`
    }
  },
  "arabic-foundation-importance": {
    title: { ar: "أهمية التأسيس الصحيح في اللغة العربية للأطفال", en: "The Importance of Proper Arabic Language Foundation for Children", fr: "L'importance d'une bonne base en langue arabe pour les enfants" },
    category: { ar: "تأسيس العربي", en: "Arabic Foundation", fr: "Fondation Arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-06-10",
    readTime: 7,
    image: "/images/arabic-learning.jpg",
    keywords: { ar: "تأسيس عربي، اللغة العربية، تعليم الأطفال", en: "Arabic foundation, language learning, children education", fr: "Fondation arabe, éducation des enfants" },
    description: { ar: "شرح مفصل لأهمية التأسيس الصحيح في اللغة العربية وتأثيره على مستقبل الطفل الأكاديمي والثقافي", en: "Detailed explanation of the importance of proper Arabic language foundation for children's academic and cultural future", fr: "Explication détaillée de l'importance d'une bonne base en arabe" },
    content: {
      ar: `<h2>مقدمة</h2>
<p>تُعد اللغة العربية الهوية والركيزة الأساسية التي يبني عليها الطفل ثقافته وقدراته التواصلية. إن مرحلة الطفولة المبكرة هي العصر الذهبي لاكتساب المهارات اللغوية، ومن هنا تنبع أهمية التأسيس الصحيح في اللغة العربية؛ فهو ليس مجرد تلقين للحروف، بل هو حجر الأساس لرحلة تعليمية مستدامة وناجحة.</p>

<h2>لماذا يُعد التأسيس المبكر أمراً مصيرياً؟</h2>

<h3>تسهيل التعليم المستقبلي</h3>
<p>الطفل الذي يمتلك أساساً قوياً في القراءة والكتابة يسهل عليه استيعاب باقي المواد الدراسية مثل العلوم والتاريخ، وحتى فهم المسائل الرياضية.</p>

<h3>تعزيز الثقة بالنفس</h3>
<p>عندما يتمكن الطفل من التعبير عن نفسه بطلاقة وقراءة القصص بمفرده، تنمو لديه ثقة عالية بالنفس تدفعه للتميز الدراسي.</p>

<h3>ارتباط وثيق بالهوية والقرآن</h3>
<p>التأسيس الصحيح لغوياً يفتح للطفل الباب لفهم آيات القرآن الكريم وتدبرها وتلاوتها تلاوة صحيحة منذ الصغر.</p>

<h2>مخاطر التأسيس الضعيف</h2>
<p>إهمال هذه المرحلة قد يؤدي إلى تراكم المشكلات اللغوية، مثل صعوبة النطق، أو البطء الشديد في القراءة، مما يولد حاجزاً نفسياً بين الطالب والمدرسة، ويجعله يشعر بالإحباط مقارنة بأقرانه.</p>

<h2>كيف نؤسس أطفالنا بشكل صحيح؟</h2>
<ol>
<li><strong>الاعتماد على المناهج الصوتية:</strong> التركيز على أصوات الحروف (المدود والحركات) وليس أسمائها فقط (مثل منهج نور البيان).</li>
<li><strong>الدمج بين المتعة والتعلم:</strong> استخدام الألعاب التفاعلية، القصص المصورة، والوسائل البصرية التي تجعل الحصة مشوقة.</li>
<li><strong>الاستعانة بالمتخصصين:</strong> من خلال دورات متخصصة توفر بيئة تفاعلية ومتابعة مستمرة تضمن تقييم مستوى الطفل أولاً بأول.</li>
</ol>

<blockquote>
<p><strong>خلاصة:</strong> الاستثمار في تأسيس طفلك باللغة العربية اليوم، هو توفير لسنوات من العناء الدراسي غداً.</p>
</blockquote>`,
      en: `<h2>Introduction</h2>
<p>The Arabic language is the identity and foundation upon which a child builds their culture and communication skills. Early childhood is the golden age for acquiring language skills, hence the importance of proper Arabic language foundation.</p>`,
      fr: `<h2>Introduction</h2>
<p>La langue arabe est l'identité et la fondation sur laquelle un enfant construit sa culture et ses compétences en communication.</p>`
    }
  },
  "online-learning-benefits": {
    title: { ar: "فوائد التعليم الإلكتروني في تحسين مستوى الطلاب", en: "Benefits of Online Learning in Improving Student Levels", fr: "Avantages de l'apprentissage en ligne pour améliorer le niveau des étudiants" },
    category: { ar: "التعليم الإلكتروني", en: "Online Learning", fr: "Apprentissage en ligne" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-06-05",
    readTime: 8,
    image: "/images/online-learning.jpg",
    keywords: { ar: "التعليم الإلكتروني، التعليم الفعال، الحصص الفردية", en: "Online education, effective learning, individual sessions", fr: "Éducation en ligne, apprentissage efficace" },
    description: { ar: "تحليل شامل لفوائد التعليم الإلكتروني وتأثيره الإيجابي على مستوى الطلاب الأكاديمي والنفسي", en: "Comprehensive analysis of online learning benefits and its positive impact on student academic and psychological levels", fr: "Analyse complète des avantages de l'apprentissage en ligne" },
    content: {
      ar: `<h2>مقدمة</h2>
<p>لم يعد التعليم الإلكتروني (عن بُعد) مجرد بديل مؤقت أو رفاهية تكنولوجية، بل أصبح ركيزة أساسية من ركائز التعليم الحديث. لقد أثبتت الفصول الافتراضية والمنصات التعليمية قدرتها العالية على سد الفجوات التعليمية وتطوير مهارات الطلاب بشكل ملحوظ مقارنة بالطرق التقليدية.</p>

<h2>كيف يساهم التعليم الإلكتروني في رفع مستوى الطلاب؟</h2>

<h3>التعلم المخصص والمستهدف</h3>
<p>في الفصول التقليدية المزدحمة، قد يخجل الطالب من طرح الأسئلة. التعليم الإلكتروني (خاصة الحصص الفردية أو المجموعات الصغيرة) يتيح للمعلم التركيز الكامل على نقاط ضعف الطالب ومعالجتها فوراً.</p>

<h3>المرونة والراحة النفسية</h3>
<p>توفير وقت وجهد المواصلات يمنح الطالب طاقة أكبر للتركيز. كما أن التعلم من المنزل يوفر بيئة هادئة ومريحة خالية من المشتتات.</p>

<h3>الوسائط المتعددة والتفاعلية</h3>
<p>استخدام الفيديوهات، الألعاب التعليمية، والاختبارات الإلكترونية الفورية يحول التعليم من عملية تلقين جافة إلى تجربة تفاعلية ممتعة، مما يزيد من معدل استيعاب المعلومة وتذكرها.</p>

<h3>سهولة المتابعة لأولياء الأمور</h3>
<p>تتيح المنصات الإلكترونية تقارير دورية دقيقة ومسجلة عن حضور الطالب، درجاته، ومدى تقدمه، مما يسهل على الأهل متابعة تطور أبنائهم مع الأكاديمية بسلاسة.</p>

<h2>مستقبل التعليم بين يديك</h2>
<p>إن دمج التكنولوجيا بالتعليم يساعد الطلاب أيضاً على اكتساب مهارات تقنية يحتاجونها في مستقبلهِم المهني، ويجعلهم أكثر اعتماداً على أنفسهم في البحث والمعرفة.</p>`,
      en: `<h2>Introduction</h2>
<p>Online education is no longer just a temporary alternative, but has become a fundamental pillar of modern education. Virtual classrooms and educational platforms have proven their high ability to bridge educational gaps and develop student skills significantly compared to traditional methods.</p>`,
      fr: `<h2>Introduction</h2>
<p>L'apprentissage en ligne n'est plus seulement une alternative temporaire, mais est devenu un pilier fondamental de l'éducation moderne.</p>`
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  if (!post) return { title: "Not Found" }

  const baseUrl = 'https://quran-elhafez.com'
  const articleUrl = `${baseUrl}/blog/${slug}`

  return {
    title: post.title.ar,
    description: post.description.ar,
    keywords: post.keywords.ar,
    alternates: {
      canonical: articleUrl,
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

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  // دمج المقالات الثابتة مع مقالات Zapier
  const { slug } = await params
  const zapierArticles = await readZapierArticles()
  const allPosts = { ...blogPosts, ...zapierArticles }
  
  console.log('[v0] Loading article:', slug, 'Found:', slug in allPosts)
  
  return <BlogArticleClient slug={slug} blogPosts={allPosts} />
}
