"use client"

import { useState, useMemo } from "react"
import { useI18n } from "@/lib/i18n"
import { Search, ChevronDown, HelpCircle, MessageCircle } from "lucide-react"
import Link from "next/link"

interface FAQItem {
  q: Record<string, string>
  a: Record<string, string>
  category: string
}

const faqData: FAQItem[] = [
  // عن الأكاديمية (About Academy)
  { category: "academy", q: { ar: "ما هي أكاديمية الحافظ المتميز؟", en: "What is Al-Hafiz Al-Mutamayez Academy?", fr: "Qu'est-ce que l'Academie Al-Hafiz Al-Mutamayez?" }, a: { ar: "أكاديمية عالمية متخصصة في تحفيظ القرآن الكريم وتعليم التجويد وتأسيس اللغة العربية عبر الإنترنت، تضم نخبة من المعلمين المجازين من مختلف الدول العربية.", en: "A global academy specializing in Quran memorization, Tajweed teaching, and Arabic language foundation online, with elite certified teachers from various Arab countries.", fr: "Une academie mondiale specialisee dans la memorisation du Coran, l'enseignement du Tajweed et les bases de la langue arabe en ligne." } },
  { category: "academy", q: { ar: "هل الأكاديمية معتمدة رسمياً؟", en: "Is the academy officially accredited?", fr: "L'academie est-elle officiellement accreditee?" }, a: { ar: "نعم، معلمونا حاصلون على إجازات رسمية في القراءات والتجويد من شيوخ معتمدين، ونقدم شهادات إتمام للطلاب المنتهين من البرامج التعليمية.", en: "Yes, our teachers hold official Ijazah certifications in Quranic recitations and Tajweed from accredited scholars, and we provide completion certificates.", fr: "Oui, nos enseignants detiennent des Ijazah officielles et nous fournissons des certificats d'achevement." } },
  { category: "academy", q: { ar: "ما هي الفئات العمرية المستهدفة؟", en: "What age groups do you serve?", fr: "Quels groupes d'age servez-vous?" }, a: { ar: "نستقبل جميع الأعمار من 4 سنوات فما فوق. لدينا برامج مخصصة للأطفال والمراهقين والبالغين مع مراعاة الفروق العمرية والمستوى.", en: "We accept all ages from 4 years and above. We have specialized programs for children, teenagers, and adults with age-appropriate methods.", fr: "Nous acceptons tous les ages a partir de 4 ans avec des programmes adaptes." } },
  { category: "academy", q: { ar: "هل تقدمون خدماتكم لجميع الدول؟", en: "Do you serve all countries?", fr: "Desservez-vous tous les pays?" }, a: { ar: "نعم، نخدم الطلاب في جميع أنحاء العالم. لدينا طلاب من أكثر من 30 دولة حول العالم بفضل التعليم عن بعد.", en: "Yes, we serve students worldwide. We have students from over 30 countries thanks to online education.", fr: "Oui, nous servons des etudiants dans le monde entier, dans plus de 30 pays." } },
  { category: "academy", q: { ar: "ما الذي يميز أكاديميتكم عن غيرها؟", en: "What makes your academy unique?", fr: "Qu'est-ce qui rend votre academie unique?" }, a: { ar: "نتميز بمعلمين مجازين، حصص فردية، مرونة في المواعيد، أسعار تنافسية، متابعة مستمرة للطالب، وتقارير شهرية لأولياء الأمور.", en: "We stand out with certified teachers, individual sessions, flexible scheduling, competitive prices, continuous student follow-up, and monthly parent reports.", fr: "Enseignants certifies, cours individuels, horaires flexibles, prix competitifs et rapports mensuels." } },

  // الدروس والحصص (Lessons)
  { category: "lessons", q: { ar: "كم مدة الحصة الواحدة؟", en: "How long is each session?", fr: "Quelle est la duree de chaque session?" }, a: { ar: "مدة الحصة الواحدة 30 دقيقة، وهي المدة المثالية للتركيز والاستيعاب خاصة للأطفال.", en: "Each session is 30 minutes, which is the ideal duration for focus and absorption, especially for children.", fr: "Chaque session dure 30 minutes, duree ideale pour la concentration." } },
  { category: "lessons", q: { ar: "هل الحصص فردية أم جماعية؟", en: "Are sessions individual or group?", fr: "Les sessions sont-elles individuelles ou en groupe?" }, a: { ar: "جميع حصصنا فردية (One-on-One) لضمان أعلى جودة تعليمية وتركيز كامل على الطالب.", en: "All our sessions are individual (One-on-One) to ensure the highest quality education and full focus on the student.", fr: "Toutes nos sessions sont individuelles pour la meilleure qualite." } },
  { category: "lessons", q: { ar: "ما هي المنصة المستخدمة للدروس؟", en: "What platform is used for lessons?", fr: "Quelle plateforme est utilisee?" }, a: { ar: "نستخدم منصة Zoom أو Google Meet للدروس المباشرة مع إمكانية مشاركة الشاشة والسبورة التفاعلية.", en: "We use Zoom or Google Meet for live lessons with screen sharing and interactive whiteboard capabilities.", fr: "Nous utilisons Zoom ou Google Meet avec partage d'ecran et tableau blanc." } },
  { category: "lessons", q: { ar: "هل يمكنني تغيير موعد الحصة؟", en: "Can I change the session time?", fr: "Puis-je changer l'heure de la session?" }, a: { ar: "نعم، يمكنك تغيير الموعد بإبلاغنا قبل 24 ساعة على الأقل من موعد الحصة عبر واتساب أو التواصل مع الإدارة.", en: "Yes, you can change the time by notifying us at least 24 hours before the session via WhatsApp or contacting administration.", fr: "Oui, en nous prevenant au moins 24 heures avant via WhatsApp." } },
  { category: "lessons", q: { ar: "ماذا لو فاتتني حصة؟", en: "What if I miss a session?", fr: "Que se passe-t-il si je manque une session?" }, a: { ar: "في حالة الإبلاغ المسبق (قبل 24 ساعة) يتم تعويض الحصة. أما في حالة الغياب بدون إبلاغ مسبق فتُحسب من رصيد الباقة.", en: "With prior notice (24 hours), the session is rescheduled. Without notice, it counts from your package balance.", fr: "Avec preavis de 24h, la session est reprogrammee. Sans preavis, elle est deductee." } },

  // الباقات والأسعار (Packages)
  { category: "packages", q: { ar: "ما هي الباقات المتاحة للقرآن الكريم؟", en: "What Quran packages are available?", fr: "Quels forfaits Coran sont disponibles?" }, a: { ar: "لدينا ثلاث باقات: باقة 4 حصص بـ 15$، وباقة 8 حصص بـ 27$، وباقة 12 حصة بـ 38$، وكل حصة مدتها 30 دقيقة.", en: "We have three packages: 4 sessions for $15, 8 sessions for $27, and 12 sessions for $38, each session is 30 minutes.", fr: "Trois forfaits: 4 sessions a 15$, 8 sessions a 27$, et 12 sessions a 38$." } },
  { category: "packages", q: { ar: "ما هي باقات تأسيس اللغة العربية؟", en: "What Arabic language packages are available?", fr: "Quels forfaits de langue arabe sont disponibles?" }, a: { ar: "باقة 4 حصص بـ 24$، وباقة 8 حصص بـ 38$، وباقة 12 حصة بـ 50$، وتشمل القراءة والكتابة والإملاء.", en: "4 sessions for $24, 8 sessions for $38, and 12 sessions for $50, including reading, writing, and spelling.", fr: "4 sessions a 24$, 8 sessions a 38$, et 12 sessions a 50$." } },
  { category: "packages", q: { ar: "هل يمكنني تجربة حصة مجانية قبل الاشتراك؟", en: "Can I try a free session before subscribing?", fr: "Puis-je essayer une session gratuite?" }, a: { ar: "نعم، نقدم حصة تجريبية مجانية للطلاب الجدد لتعريفهم بالمنهج وطريقة التعليم وتقييم مستواهم.", en: "Yes, we offer a free trial session for new students to introduce our curriculum and assess their level.", fr: "Oui, nous offrons une session d'essai gratuite pour les nouveaux etudiants." } },
  { category: "packages", q: { ar: "ما هي طرق الدفع المتاحة؟", en: "What payment methods are available?", fr: "Quels modes de paiement sont disponibles?" }, a: { ar: "نقبل الدفع عبر PayPal، التحويل البنكي، فودافون كاش، وخدمات تحويل الأموال المحلية والدولية.", en: "We accept PayPal, bank transfer, Vodafone Cash, and local/international money transfer services.", fr: "PayPal, virement bancaire, Vodafone Cash et services de transfert." } },
  { category: "packages", q: { ar: "هل هناك خصومات للأشقاء؟", en: "Are there sibling discounts?", fr: "Y a-t-il des reductions pour les freres et soeurs?" }, a: { ar: "نعم، نقدم خصم 10% عند اشتراك أخوين أو أكثر، وخصومات خاصة للعائلات الكبيرة.", en: "Yes, we offer 10% discount for two or more siblings, with special discounts for large families.", fr: "Oui, 10% de reduction pour deux freres/soeurs ou plus." } },

  // المعلمين (Teachers)
  { category: "teachers", q: { ar: "هل المعلمون مجازون؟", en: "Are teachers certified?", fr: "Les enseignants sont-ils certifies?" }, a: { ar: "نعم، جميع معلمينا حاصلون على إجازات في القراءات القرآنية والتجويد من شيوخ معتمدين، بالإضافة إلى خبرة تعليمية لا تقل عن 3 سنوات.", en: "Yes, all our teachers hold Ijazah in Quranic recitations and Tajweed from accredited scholars, with at least 3 years teaching experience.", fr: "Oui, tous nos enseignants ont des Ijazah avec au moins 3 ans d'experience." } },
  { category: "teachers", q: { ar: "هل يمكنني اختيار المعلم/المعلمة؟", en: "Can I choose my teacher?", fr: "Puis-je choisir mon enseignant?" }, a: { ar: "نعم، يمكنك اختيار المعلم أو المعلمة حسب رغبتك، ونقدم معلمات متخصصات للطالبات والأطفال.", en: "Yes, you can choose your preferred teacher. We offer female teachers for female students and children.", fr: "Oui, avec des enseignantes pour les etudiantes et les enfants." } },
  { category: "teachers", q: { ar: "هل يمكن تغيير المعلم إذا لم أكن راضياً؟", en: "Can I change my teacher if unsatisfied?", fr: "Puis-je changer d'enseignant?" }, a: { ar: "بالتأكيد، راحة الطالب أولوية عندنا. يمكنك طلب تغيير المعلم في أي وقت وسنوفر لك البديل المناسب.", en: "Absolutely, student satisfaction is our priority. You can request a teacher change anytime and we'll provide a suitable alternative.", fr: "Absolument, vous pouvez demander un changement a tout moment." } },
  { category: "teachers", q: { ar: "هل المعلمون يتحدثون لغات أخرى؟", en: "Do teachers speak other languages?", fr: "Les enseignants parlent-ils d'autres langues?" }, a: { ar: "لدينا معلمون يتحدثون العربية والإنجليزية والفرنسية والأوردية لخدمة الطلاب من مختلف الجنسيات.", en: "We have teachers who speak Arabic, English, French, and Urdu to serve students from various nationalities.", fr: "Nos enseignants parlent arabe, anglais, francais et ourdou." } },

  // المنهج (Curriculum)
  { category: "curriculum", q: { ar: "ما هو المنهج المتبع في تحفيظ القرآن؟", en: "What is the Quran memorization curriculum?", fr: "Quel est le programme de memorisation?" }, a: { ar: "نتبع منهجية شاملة تجمع بين الحفظ التدريجي مع التجويد، والمراجعة الدورية، والتفسير المبسط، مع مراعاة قدرات كل طالب.", en: "We follow a comprehensive methodology combining gradual memorization with Tajweed, periodic review, simplified interpretation, tailored to each student's abilities.", fr: "Methodologie complete avec memorisation progressive, Tajweed et revision periodique." } },
  { category: "curriculum", q: { ar: "ما هو منهج تأسيس اللغة العربية؟", en: "What is the Arabic foundation curriculum?", fr: "Quel est le programme de langue arabe?" }, a: { ar: "نعتمد على مناهج تفاعلية حديثة تشمل: تعلم الحروف وأشكالها، الحركات، القراءة، الكتابة، الإملاء، والتعبير بأساليب ممتعة وجذابة.", en: "We use modern interactive curricula including: letter forms, vowels, reading, writing, spelling, and expression with fun and engaging methods.", fr: "Programmes interactifs modernes: lettres, voyelles, lecture, ecriture et expression." } },
  { category: "curriculum", q: { ar: "هل تقدمون دروس تفسير القرآن؟", en: "Do you offer Quran interpretation lessons?", fr: "Offrez-vous des cours d'interpretation?" }, a: { ar: "نعم، نقدم تفسيراً مبسطاً للآيات ضمن حصص الحفظ لمساعدة الطالب على فهم معاني ما يحفظه.", en: "Yes, we provide simplified interpretation of verses within memorization sessions to help students understand what they memorize.", fr: "Oui, interpretation simplifiee integree aux sessions de memorisation." } },
  { category: "curriculum", q: { ar: "هل هناك اختبارات دورية؟", en: "Are there periodic tests?", fr: "Y a-t-il des tests periodiques?" }, a: { ar: "نعم، نجري اختبارات شهرية لتقييم مستوى الطالب ونرسل تقارير مفصلة لأولياء الأمور عن تقدم أبنائهم.", en: "Yes, we conduct monthly tests to evaluate student level and send detailed progress reports to parents.", fr: "Oui, tests mensuels avec rapports detailles aux parents." } },
  { category: "curriculum", q: { ar: "هل تعلمون القراءات العشر؟", en: "Do you teach the ten Qira'at?", fr: "Enseignez-vous les dix Qira'at?" }, a: { ar: "نعم، لدينا معلمون متخصصون في القراءات العشر للطلاب المتقدمين الراغبين في إتقان القراءات المختلفة.", en: "Yes, we have specialized teachers in the ten Qira'at for advanced students who wish to master different recitations.", fr: "Oui, pour les etudiants avances souhaitant maitriser les differentes recitations." } },

  // التقنية (Technical)
  { category: "technical", q: { ar: "ما هي المتطلبات التقنية للحصص؟", en: "What are the technical requirements?", fr: "Quelles sont les exigences techniques?" }, a: { ar: "تحتاج إلى: جهاز كمبيوتر أو تابلت أو هاتف ذكي، اتصال إنترنت مستقر، سماعات أو مكبر صوت، وتطبيق Zoom أو Google Meet.", en: "You need: a computer, tablet, or smartphone, stable internet connection, headphones or speaker, and Zoom or Google Meet app.", fr: "Ordinateur/tablette/smartphone, internet stable, ecouteurs, et Zoom ou Google Meet." } },
  { category: "technical", q: { ar: "هل أحتاج كاميرا؟", en: "Do I need a camera?", fr: "Ai-je besoin d'une camera?" }, a: { ar: "يُفضل وجود كاميرا لتفاعل أفضل مع المعلم، لكنها ليست إلزامية. بعض الط��لبات يفضلن التعلم بدون كاميرا ونحترم ذلك.", en: "A camera is preferred for better interaction, but not mandatory. Some female students prefer learning without a camera and we respect that.", fr: "Preferee mais pas obligatoire. Certaines etudiantes preferent sans camera." } },
  { category: "technical", q: { ar: "هل تسجلون الحصص؟", en: "Do you record sessions?", fr: "Enregistrez-vous les sessions?" }, a: { ar: "يمكن تسجيل الحصص بناءً على طلب الطالب أو ولي الأمر للمراجعة لاحقاً، مع الحفاظ على الخصوصية التامة.", en: "Sessions can be recorded upon student or parent request for later review, with full privacy maintained.", fr: "Sur demande pour revision, avec respect total de la vie privee." } },
  { category: "technical", q: { ar: "ماذا لو انقطع الإنترنت أثناء الحصة؟", en: "What if internet disconnects during a session?", fr: "Et si internet se deconnecte?" }, a: { ar: "في حالة انقطاع الإنترنت يتم استئناف الحصة فور عودة الاتصال، وإذا ضاع وقت كبير يتم تعويض الطالب.", en: "The session resumes when connection returns. If significant time is lost, the student is compensated.", fr: "La session reprend apres la reconnexion. Compensation si perte significative." } },

  // الشهادات (Certificates)
  { category: "certificates", q: { ar: "هل تقدمون شهادات إتمام؟", en: "Do you provide completion certificates?", fr: "Fournissez-vous des certificats?" }, a: { ar: "نعم، نقدم شهادات إتمام للطلاب ا��ذين ينهون برامج الحفظ أو التأسيس، بالإضافة إلى إجازات للطلاب المتميزين.", en: "Yes, we provide completion certificates for students who finish memorization or foundation programs, plus Ijazah for outstanding students.", fr: "Oui, certificats d'achevement et Ijazah pour les etudiants distingues." } },
  { category: "certificates", q: { ar: "هل الإجازة معتمدة؟", en: "Is the Ijazah accredited?", fr: "L'Ijazah est-elle accreditee?" }, a: { ar: "نعم، الإجازات التي نقدمها تكون بسند متصل إلى النبي صلى الله عليه وسلم، وهي معتمدة عند أهل العلم والقراءات.", en: "Yes, our Ijazah comes with a connected chain (Isnad) to the Prophet (PBUH), recognized by scholars of Quranic recitations.", fr: "Oui, avec une chaine connectee (Isnad) au Prophete, reconnue par les savants." } },

  // المتابعة (Follow-up)
  { category: "followup", q: { ar: "كيف يمكنني متابعة تقدم طفلي؟", en: "How can I track my child's progress?", fr: "Comment suivre les progres de mon enfant?" }, a: { ar: "نرسل تقارير شهرية مفصلة لأولياء الأمور عبر واتساب أو البريد الإلكتروني تتضمن مستوى الحفظ والتجويد وعدد الجلسات التفاعلية المباشرة المكتملة عبر الإنترنت والسلوك.", en: "We send detailed monthly reports to parents via WhatsApp or email covering memorization level, Tajweed, number of completed direct interactive online sessions, and behavior.", fr: "Rapports mensuels detailles via WhatsApp ou email incluant les sessions en ligne completees." } },
  { category: "followup", q: { ar: "هل هناك تواصل مع المعلم خارج أوقات الحصص؟", en: "Is there communication with the teacher outside sessions?", fr: "Y a-t-il communication en dehors des sessions?" }, a: { ar: "نعم، يمكن لأولياء الأمور التواصل مع المعلم أو الإدارة عبر واتساب للاستفسار عن مستوى الطالب أو أي ملاحظات.", en: "Yes, parents can communicate with the teacher or administration via WhatsApp for student progress inquiries or any notes.", fr: "Oui, via WhatsApp pour les questions sur les progres." } },
  { category: "followup", q: { ar: "ماذا يحدث إذا لم يحرز طفلي تقدماً؟", en: "What if my child is not making progress?", fr: "Et si mon enfant ne progresse pas?" }, a: { ar: "نقوم بتقييم الوضع وتغيير الاستراتيجية التعليمية أو المعلم إذا لزم الأمر. هدفنا ضمان تقدم كل طالب حسب قدراته.", en: "We evaluate the situation and change teaching strategy or teacher if needed. Our goal is to ensure every student progresses.", fr: "Evaluation et changement de strategie si necessaire." } },

  // أسئلة عامة (General)
  { category: "general", q: { ar: "كيف يمكنني الاشتراك؟", en: "How can I subscribe?", fr: "Comment puis-je m'inscrire?" }, a: { ar: "يمكنك الاشتراك عبر التواصل معنا على واتساب أو تيليجرام أو من خلال صفحة \"اتصل بنا\" في الموقع وسنرد عليك خلال ساعات.", en: "You can subscribe by contacting us on WhatsApp, Telegram, or through the \"Contact Us\" page on our website. We'll respond within hours.", fr: "Via WhatsApp, Telegram ou la page \"Contactez-nous\". Reponse en quelques heures." } },
  { category: "general", q: { ar: "هل يمكن للكبار الاشتراك؟", en: "Can adults subscribe?", fr: "Les adultes peuvent-ils s'inscrire?" }, a: { ar: "بالتأكيد! لدينا برامج مخصصة للكبار تناسب مستوياتهم وأهدافهم سواء في حفظ القرآن أو تعلم التجويد أو تعلم العربية.", en: "Absolutely! We have specialized programs for adults suitable for their levels and goals in Quran memorization, Tajweed, or Arabic.", fr: "Absolument! Programmes specialises pour adultes." } },
  { category: "general", q: { ar: "هل تقدمون دورات مكثفة في رمضان؟", en: "Do you offer intensive Ramadan courses?", fr: "Offrez-vous des cours intensifs pendant le Ramadan?" }, a: { ar: "نعم، نقدم برامج مكثفة خاصة في شهر رمضان تشمل مراجعة شاملة وحفظ مكثف وحلقات تلاوة جماعية.", en: "Yes, we offer special intensive programs during Ramadan including comprehensive review, intensive memorization, and group recitation sessions.", fr: "Oui, programmes intensifs pendant le Ramadan avec revision et memorisation." } },
  { category: "general", q: { ar: "هل يمكن الاشتراك في أكثر من باقة؟", en: "Can I subscribe to more than one package?", fr: "Puis-je souscrire a plusieurs forfaits?" }, a: { ar: "نعم، يمكنك الجمع بين باقة القرآن وباقة تأسيس العربي معاً، وتحصل على خصم خاص عند الاشتراك في باقتين.", en: "Yes, you can combine Quran and Arabic packages, with a special discount for subscribing to both.", fr: "Oui, avec une reduction speciale pour deux forfaits." } },
  { category: "general", q: { ar: "ما هي أوقات العمل المتاحة؟", en: "What are the available working hours?", fr: "Quels sont les horaires disponibles?" }, a: { ar: "نعمل على مدار الأسبوع من الساعة 8 صباحاً حتى 11 مساءً بتوقيت القاهرة، مع مرونة في ترتيب المواعيد حسب المنطقة الزمنية.", en: "We operate all week from 8 AM to 11 PM Cairo time, with flexibility in scheduling based on your timezone.", fr: "De 8h a 23h heure du Caire, tous les jours, avec flexibilite." } },
  { category: "general", q: { ar: "هل يمكنني إيقاف الاشتراك مؤقتاً؟", en: "Can I pause my subscription?", fr: "Puis-je suspendre mon abonnement?" }, a: { ar: "نعم، يمكنك تجميد الاشتراك لمدة تصل إلى أسبوعين في حالات السفر أو المرض أو الظروف الخاصة بالتنسيق مع الإدارة.", en: "Yes, you can freeze your subscription for up to two weeks for travel, illness, or special circumstances by coordinating with administration.", fr: "Oui, suspension jusqu'a deux semaines pour voyage ou maladie." } },
  { category: "general", q: { ar: "هل هناك سياسة استرداد الأموال؟", en: "Is there a refund policy?", fr: "Y a-t-il une politique de remboursement?" }, a: { ar: "نعم، يمكن استرداد المبلغ خلال أول 3 أيام من الاشتراك إذا لم يبدأ الطالب أي حصة، أو تعويض بحصص إضافية.", en: "Yes, refund is available within the first 3 days if no sessions have started, or compensation with additional sessions.", fr: "Remboursement dans les 3 premiers jours si aucune session n'a commence." } },
  { category: "general", q: { ar: "كيف يمكنني التواصل مع الإدارة؟", en: "How can I contact administration?", fr: "Comment contacter l'administration?" }, a: { ar: "يمكنك التواصل معنا عبر: واتساب (201130127894+)، تيليجرام (@acabemy_quraan)، أو البريد الإلكتروني (enamel311@gmail.com).", en: "Contact us via: WhatsApp (+201130127894), Telegram (@acabemy_quraan), or email (enamel311@gmail.com).", fr: "WhatsApp (+201130127894), Telegram (@acabemy_quraan), ou email (enamel311@gmail.com)." } },
  { category: "general", q: { ar: "هل تقدمون دورات في العقيدة والفقه؟", en: "Do you offer Aqeedah and Fiqh courses?", fr: "Offrez-vous des cours de Aqeedah et Fiqh?" }, a: { ar: "حالياً نركز على تحفيظ القرآن والتجويد وتأسيس اللغة العربية، ونخطط لإضافة دورات في العقيدة والفقه قريباً.", en: "Currently we focus on Quran memorization, Tajweed, and Arabic foundation. We plan to add Aqeedah and Fiqh courses soon.", fr: "Actuellement, nous nous concentrons sur le Coran et l'arabe. Cours de Aqeedah et Fiqh bientot." } },
  { category: "general", q: { ar: "هل يمكنني حضور حصة تجريبية مع طفلي؟", en: "Can I attend a trial session with my child?", fr: "Puis-je assister a une session d'essai avec mon enfant?" }, a: { ar: "نعم، نرحب بحضور أولياء الأمور في الحصة التجريبية الأولى للاطمئنان على جودة التعليم وطريقة التدريس.", en: "Yes, parents are welcome to attend the first trial session to observe the quality of teaching and methods.", fr: "Oui, les parents sont les bienvenus a la premiere session d'essai." } },
  { category: "general", q: { ar: "هل يوجد حد أقصى لعدد الحصص أسبوعياً؟", en: "Is there a maximum number of weekly sessions?", fr: "Y a-t-il un maximum de sessions par semaine?" }, a: { ar: "لا يوجد حد أقصى، يمكنك ترتيب الحصص حسب رغبتك ضمن الباقة المشترك بها، سواء يومياً أو عدة مرات أسبوعياً.", en: "No maximum limit. You can arrange sessions as you wish within your package, daily or several times a week.", fr: "Pas de limite. Organisez selon vos preferences." } },
  { category: "general", q: { ar: "هل تقدمون مسابقات قرآنية؟", en: "Do you offer Quran competitions?", fr: "Organisez-vous des concours coraniques?" }, a: { ar: "نعم، ننظم مسابقات قرآنية دورية مع جوائز تحفيزية للطلاب المتميزين لتشجيعهم على الحفظ والتلاوة.", en: "Yes, we organize periodic Quran competitions with incentive prizes for outstanding students.", fr: "Oui, concours periodiques avec prix pour les etudiants distingues." } },
  { category: "general", q: { ar: "هل تقبلون الطلاب غير الناطقين بالعربية؟", en: "Do you accept non-Arabic speaking students?", fr: "Acceptez-vous les non-arabophones?" }, a: { ar: "نعم، لدينا معلمون متخصصون في تعليم القرآن والعربية لغير الناطقين بها باستخدام مناهج مبسطة وفعالة.", en: "Yes, we have specialized teachers for non-Arabic speakers using simplified and effective curricula.", fr: "Oui, avec des enseignants specialises pour les non-arabophones." } },
  { category: "general", q: { ar: "ما هي مدة صلاحية الباقة؟", en: "What is the package validity period?", fr: "Quelle est la validite du forfait?" }, a: { ar: "صلاحية الباقة شهر واحد من تاريخ الاشتراك، ويمكن تمديدها في حالات خاصة بالتنسيق مع الإدارة.", en: "Package validity is one month from subscription date, extendable in special cases by coordinating with administration.", fr: "Validite d'un mois, prolongeable dans des cas speciaux." } },
  { category: "general", q: { ar: "هل يمكن حضور الحصة من الهاتف المحمول؟", en: "Can I attend from a mobile phone?", fr: "Puis-je assister depuis un telephone?" }, a: { ar: "نعم، يمكنك الحضور من أي جهاز: كمبيوتر، تابلت، أو هاتف ذكي. لكننا ننصح بالتابلت أو الكمبيوتر لتجربة أفضل.", en: "Yes, from any device. We recommend a tablet or computer for a better experience.", fr: "Oui, depuis tout appareil. Tablette ou ordinateur recommande." } },
  { category: "general", q: { ar: "هل تقدمون محتوى تعليمي مجاني؟", en: "Do you offer free educational content?", fr: "Offrez-vous du contenu gratuit?" }, a: { ar: "نعم، نوفر في قسم المكتبة كتباً ومواد تعليمية مجانية، بالإضافة إلى ألعاب ومسابقات تعليمية تفاعلية على الموقع.", en: "Yes, our Library section has free books and materials, plus interactive educational games and quizzes on the website.", fr: "Oui, livres gratuits dans la bibliotheque et jeux educatifs sur le site." } },
  { category: "general", q: { ar: "هل هناك برنامج خاص لذوي الاحتياجات الخاصة؟", en: "Is there a special program for special needs?", fr: "Y a-t-il un programme pour les besoins speciaux?" }, a: { ar: "نعم، لدينا معلمون مدربون على التعامل مع ذوي الاحتياجات الخاصة بصبر واحترافية مع مناهج مخصصة.", en: "Yes, we have teachers trained to work with special needs students with patience and professionalism using customized curricula.", fr: "Oui, enseignants formes pour les besoins speciaux avec des programmes personnalises." } },
]

const faqCategories: { key: string; label: Record<string, string> }[] = [
  { key: "all", label: { ar: "الكل", en: "All", fr: "Tout" } },
  { key: "academy", label: { ar: "عن الأكاديمية", en: "About Academy", fr: "L'Academie" } },
  { key: "lessons", label: { ar: "الدروس والحصص", en: "Lessons", fr: "Cours" } },
  { key: "packages", label: { ar: "الباقات والأسعار", en: "Packages & Prices", fr: "Forfaits" } },
  { key: "teachers", label: { ar: "المعلمين", en: "Teachers", fr: "Enseignants" } },
  { key: "curriculum", label: { ar: "المنهج", en: "Curriculum", fr: "Programme" } },
  { key: "technical", label: { ar: "تقنية", en: "Technical", fr: "Technique" } },
  { key: "certificates", label: { ar: "الشهادات", en: "Certificates", fr: "Certificats" } },
  { key: "followup", label: { ar: "المتابعة", en: "Follow-up", fr: "Suivi" } },
  { key: "general", label: { ar: "أسئلة عامة", en: "General", fr: "General" } },
]

export default function FAQPage() {
  const { t, locale } = useI18n()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory
      const matchesSearch =
        searchQuery === "" ||
        faq.q[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a[locale].toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery, locale])

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
            {t("nav.faq")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
            {t("faq.title")}
          </h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto text-pretty">
            {t("faq.desc")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4">
          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "ar" ? "ابحث في الأسئلة..." : locale === "en" ? "Search questions..." : "Rechercher des questions..."}
              className="w-full ps-12 pe-4 py-3.5 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {faqCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setOpenIndex(null) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-foreground border border-border hover:bg-primary/10"
                }`}
              >
                {cat.label[locale]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-8 pb-20 bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {locale === "ar" ? `${filteredFAQs.length} سؤال` : `${filteredFAQs.length} questions`}
          </p>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">
                {locale === "ar" ? "لا توجد نتائج" : "No results found"}
              </p>
              <p className="text-sm text-muted-foreground">
                {locale === "ar" ? "جرب كلمات بحث أخرى" : "Try different search terms"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredFAQs.map((faq, idx) => {
                const isOpen = openIndex === idx
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all ${
                      isOpen ? "border-primary/30 shadow-md bg-card" : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="flex items-start gap-3 w-full p-5 text-start"
                      aria-expanded={isOpen}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      }`}>
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="flex-1 font-bold text-foreground leading-relaxed">
                        {faq.q[locale]}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="px-5 pb-5 ps-16">
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {faq.a[locale]}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              {locale === "ar" ? "لم تجد إجابة لسؤالك؟" : locale === "en" ? "Didn't find your answer?" : "Vous n'avez pas trouve votre reponse?"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {locale === "ar" ? "تواصل معنا وسنرد عليك في أقرب وقت" : locale === "en" ? "Contact us and we'll get back to you soon" : "Contactez-nous et nous vous repondrons bientot"}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
