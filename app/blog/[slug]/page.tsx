import { Metadata } from 'next'
import BlogArticleClient from "./client"
import { getSeoAlternates } from '@/lib/seo-metadata'
import { notFound } from 'next/navigation'

// المقالات الثابتة الافتراضية
const blogPosts: Record<string, any> = {
  "quran-memorization-techniques": {
    title: { ar: "تقنيات فعالة لحفظ القرآن الكريم في أقل وقت", en: "Effective Techniques for Quran Memorization in Less Time", fr: "Techniques efficaces pour mémoriser le Coran en moins de temps" },
    category: { ar: "تحفيظ القرآن", en: "Quran Memorization", fr: "Mémorisation du Coran" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l'académie" },
    date: "2024-06-15",
    readTime: 9,
    image: "/images/hero-children.webp",
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
  },
  "easy-arabic-learning-for-children": {
    title: { ar: "أساليب وأسس عملية لتسهيل تعلم اللغة العربية للأطفال", en: "Practical Principles and Methods for Making Arabic Easier for Children", fr: "Principes et méthodes pratiques pour faciliter l’apprentissage de l’arabe aux enfants" },
    category: { ar: "تأسيس العربية", en: "Arabic Foundation", fr: "Fondation en arabe" },
    author: { ar: "فريق الأكاديمية", en: "Academy Team", fr: "Équipe de l’académie" },
    date: "2026-09-11",
    readTime: 9,
    image: "/images/arabic-learning-children-1.jpg",
    keywords: { ar: "تعلم العربية للأطفال، تأسيس اللغة العربية، تعليم القراءة، تعليم الأطفال", en: "Arabic learning for children, Arabic foundation, reading instruction, child education", fr: "Apprentissage de l’arabe pour enfants, fondation en arabe, lecture" },
    description: { ar: "دليل عملي للآباء والمعلمين يوضح أسس وأساليب تجعل تعلم اللغة العربية أسهل وأكثر متعة وثباتاً لدى الأطفال.", en: "A practical guide for parents and teachers to make Arabic learning easier, more engaging, and more lasting for children.", fr: "Un guide pratique pour aider les parents et les enseignants à rendre l’apprentissage de l’arabe plus simple et motivant." },
    content: {
      ar: `<h2>مقدمة: كيف نجعل العربية تجربة محببة؟</h2>
<p>يتعلم الطفل اللغة العربية بصورة أفضل عندما يشعر أنها وسيلة للتعبير واللعب والتواصل، لا مجموعة من القواعد التي ينبغي حفظها فقط. لذلك فإن تسهيل تعلم العربية يبدأ من بناء علاقة إيجابية معها، ثم تقديم المهارات بالتدرج وبأساليب تناسب عمر الطفل واهتماماته وقدرته على التركيز.</p>

<h2>أولاً: الأسس التي يقوم عليها التعلم الفعّال</h2>

<h3>1. البدء من مستوى الطفل الحقيقي</h3>
<p>لا يكفي معرفة عمر الطفل لتحديد نقطة البداية؛ فالأطفال يختلفون في حصيلتهم اللغوية ونطقهم وقدرتهم على التمييز بين الأصوات والحروف. يبدأ المعلم أو ولي الأمر بتقييم بسيط: هل يستطيع الطفل فهم التعليمات؟ هل يميز الأصوات المتقاربة؟ هل يقرأ كلمات قصيرة؟ ثم تُبنى الخطة على ما يحتاج إليه فعلاً، لا على افتراضات عامة.</p>

<h3>2. التدرج من الاستماع إلى التحدث ثم القراءة والكتابة</h3>
<p>اللغة مهارات مترابطة. يستفيد الطفل من الاستماع إلى العربية الواضحة أولاً، ثم استخدام كلمات وجمل قصيرة في الحديث، وبعد ذلك الانتقال إلى ربط الصوت بالحرف والكلمة، وأخيراً التدريب على الكتابة. هذا الترتيب يقلل شعور الطفل بالصعوبة ويمنحه فرصاً متكررة لفهم ما يتعلمه واستعماله.</p>

<h3>3. ربط التعلم بسياق ذي معنى</h3>
<p>يتذكر الطفل الكلمة عندما ترتبط بصورة أو موقف أو قصة. بدلاً من تقديم قائمة كلمات منفصلة، يمكن تعليم مفردات الطعام أثناء إعداد وجبة، أو مفردات الألوان من خلال لعبة، أو أسماء الحيوانات في قصة مصورة. كلما كان المعنى قريباً من حياة الطفل، أصبح استدعاء الكلمة واستخدامها أسهل.</p>

<h2>ثانياً: أساليب عملية لتسهيل تعلم العربية</h2>

<h3>التعلم باللعب والأنشطة القصيرة</h3>
<p>الألعاب اللغوية مثل مطابقة الصورة بالكلمة، وترتيب الحروف، واكتشاف الكلمة المختلفة، وتمثيل الأدوار، تحول التدريب إلى مشاركة ممتعة. ويُفضّل أن تكون الأنشطة قصيرة ومتنوعة، من خمس إلى عشر دقائق، مع تغيير النشاط قبل أن يفقد الطفل تركيزه.</p>

<h3>القصص والحوار اليومي</h3>
<p>القصة من أقوى الوسائل لبناء المفردات وفهم تركيب الجملة. يقرأ البالغ قصة مناسبة بصوت واضح، ثم يطرح أسئلة بسيطة مثل: من الشخصية؟ ماذا حدث؟ ماذا تتوقع؟ كما يمكن استثمار المواقف اليومية في حوار عربي قصير، مثل وصف الملابس أو السؤال عن المشاعر أو الحديث عن أحداث اليوم.</p>

<h3>التدريب الصوتي قبل الحفظ الكتابي</h3>
<p>عند تعليم القراءة، يحتاج الطفل إلى سماع الصوت الصحيح وملاحظته في كلمات متعددة قبل كتابة الحرف مرات كثيرة. تساعد المقاطع الصوتية والحركات والمدود على بناء الوعي الصوتي، وهو أساس مهم للقراءة السليمة وتقليل الخلط بين الحروف المتشابهة.</p>

<h3>المراجعة المتباعدة دون ضغط</h3>
<p>المراجعة القصيرة المتكررة أكثر فاعلية من جلسة طويلة مرهقة. يمكن إعادة الكلمة أو المهارة في اليوم التالي، ثم بعد عدة أيام، ثم في نهاية الأسبوع، مع استخدامها في جملة أو لعبة جديدة. الهدف هو تثبيت التعلم مع الحفاظ على شعور الطفل بالنجاح.</p>

<h2>ثالثاً: دور الأسرة والمعلم</h2>
<ul>
<li><strong>التشجيع المحدد:</strong> قل للطفل ما الذي أتقنه تحديداً، مثل: «أحسنت، نطقت صوت الحرف بوضوح»، بدلاً من الاكتفاء بعبارة عامة.</li>
<li><strong>تصحيح لطيف وفوري:</strong> أعد الكلمة بالنطق الصحيح وامنح الطفل فرصة للتجربة، من غير إحراج أو مقارنة بإخوته وأقرانه.</li>
<li><strong>بيئة لغوية غنية:</strong> وفّر كتباً مصورة وملصقات وكلمات في أرجاء المنزل، واستخدم العربية الفصيحة المبسطة في مواقف يومية مناسبة.</li>
<li><strong>خطة ثابتة قابلة للقياس:</strong> حدّد هدفاً صغيراً لكل أسبوع، مثل اكتساب عشر كلمات أو قراءة خمس جمل، وسجّل التقدم بطريقة مشجعة.</li>
</ul>

<h2>أخطاء ينبغي تجنبها</h2>
<p>من أكثر الأخطاء شيوعاً البدء بكمية كبيرة من الحروف والكلمات، أو التركيز على أوراق العمل مع إهمال الاستماع والحوار، أو تحويل كل جلسة إلى اختبار. كما أن المقارنة المستمرة أو السخرية من الخطأ قد تجعل الطفل يتجنب استخدام العربية. التعلم الناجح يحتاج إلى صبر وتكرار وتوقعات مناسبة للمرحلة العمرية.</p>

<h2>خطة أسبوعية مبسطة</h2>
<ol>
<li>اليوم الأول: قصة قصيرة واستخراج خمس كلمات جديدة.</li>
<li>اليوم الثاني: مراجعة الكلمات بالصور ولعبة نطق.</li>
<li>اليوم الثالث: تكوين جمل شفوية قصيرة باستخدام الكلمات.</li>
<li>اليوم الرابع: ربط الأصوات بالحروف أو قراءة كلمات مناسبة للمستوى.</li>
<li>اليوم الخامس: نشاط كتابي أو فني يوظف المفردات.</li>
<li>اليومان السادس والسابع: مراجعة خفيفة وتطبيق الكلمات في حوار أو قصة.</li>
</ol>

<blockquote><p><strong>الخلاصة:</strong> تسهيل تعلم العربية للأطفال لا يعتمد على كثرة الواجبات، بل على وضوح الهدف، والتدرج، وكثرة الاستخدام، والتشجيع المستمر. عندما يشعر الطفل أن العربية قريبة من حياته وممتعة في تعلمها، تتحول الممارسة اليومية إلى عادة راسخة ومهارة نافعة.</p></blockquote>`,
      en: `<h2>Introduction: Making Arabic a Positive Experience</h2>
<p>Children learn Arabic best when they experience it as a language for expression, play, and communication rather than as a list of rules to memorize. A successful approach begins with a positive relationship with the language and introduces skills gradually in ways that match the child's age, interests, and attention span.</p>
<h2>Key Principles and Practical Methods</h2>
<p>Start from the child's actual level, move gradually from listening and speaking to reading and writing, and connect every new word to a meaningful story, image, or daily situation. Short games, picture books, daily conversations, phonics practice, and spaced review help children build confidence without pressure.</p>
<h2>The Role of Adults</h2>
<p>Parents and teachers can support progress through specific encouragement, gentle correction, a rich Arabic environment, and small measurable weekly goals. The most important habits are patience, consistency, and avoiding comparisons.</p>`,
      fr: `<h2>Introduction : rendre l’arabe agréable</h2>
<p>Les enfants apprennent mieux l’arabe lorsqu’ils le vivent comme une langue d’expression, de jeu et de communication. Une approche efficace respecte leur âge, leurs intérêts et leur capacité d’attention.</p>
<h2>Principes et méthodes pratiques</h2>
<p>Il est utile de commencer au niveau réel de l’enfant, de progresser de l’écoute vers la parole puis vers la lecture et l’écriture, et de relier chaque mot à une histoire, une image ou une situation quotidienne. Les jeux courts, les histoires illustrées et les révisions espacées renforcent la confiance.</p>
<h2>Le rôle des adultes</h2>
<p>Les parents et les enseignants favorisent les progrès par des encouragements précis, des corrections bienveillantes, un environnement riche en arabe et des objectifs hebdomadaires simples.</p>`
    }
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
    alternates: getSeoAlternates(articleUrl),
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
  const { slug } = await params
  const allPosts = blogPosts

  if (!(slug in allPosts)) notFound()

  return <BlogArticleClient slug={slug} blogPosts={allPosts} />
}
