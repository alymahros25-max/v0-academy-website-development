"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "ar" | "en" | "fr"

type Translations = Record<string, Record<Locale, string>>

const translations: Translations = {
  // Nav
  "nav.home": { ar: "الرئيسية", en: "Home", fr: "Accueil" },
  "nav.about": { ar: "من نحن", en: "About Us", fr: "A propos" },
  "nav.quran": { ar: "القرآن والتجويد", en: "Quran & Tajweed", fr: "Coran & Tajweed" },
  "nav.arabic": { ar: "تأسيس العربي", en: "Arabic Language", fr: "Langue Arabe" },
  "nav.teachers": { ar: "المعلمين", en: "Teachers", fr: "Enseignants" },
  "nav.reviews": { ar: "آراء الطلاب", en: "Reviews", fr: "Avis" },
  "nav.library": { ar: "المكتبة", en: "Library", fr: "Biblioth\u00e8que" },
  "nav.games": { ar: "الألعاب والمسابقات", en: "Games & Quizzes", fr: "Jeux & Quiz" },
  "nav.faq": { ar: "الأسئلة الشائعة", en: "FAQ", fr: "FAQ" },
  "nav.blog": { ar: "المدونة", en: "Blog", fr: "Blog" },
  "nav.contact": { ar: "اتصل بنا", en: "Contact Us", fr: "Contactez-nous" },
  "nav.account": { ar: "حسابي", en: "My Account", fr: "Mon compte" },
  "nav.subscribe": { ar: "اشترك الآن", en: "Subscribe Now", fr: "Abonnez-vous" },

  // Hero
  "hero.title": { ar: "أكاديمية الحافظ المتميز", en: "Al-Hafiz Al-Mutamayez Academy", fr: "Acad\u00e9mie Al-Hafiz Al-Mutamayez" },
  "hero.subtitle": { ar: "أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين", en: "A Global Online Academy for Quran Memorization & Arabic Language Foundation", fr: "Acad\u00e9mie mondiale en ligne pour la m\u00e9morisation du Coran et l'enseignement de la langue arabe" },
  "hero.cta": { ar: "ابدأ رحلتك الآن", en: "Start Your Journey Now", fr: "Commencez votre parcours" },
  "hero.cta2": { ar: "تعرف على باقاتنا", en: "View Our Plans", fr: "Voir nos offres" },

  // About section
  "about.badge": { ar: "من نحن", en: "About Us", fr: "A propos" },
  "about.title": { ar: "نبذة عن الأكاديمية", en: "About the Academy", fr: "A propos de l'acad\u00e9mie" },
  "about.desc": { ar: "أكاديمية الحافظ المتميز هي منصة تعليمية عالمية متخصصة في تحفيظ القرآن الكريم وتعليم أحكام التجويد وتأسيس اللغة العربية للأطفال والكبار عبر الإنترنت. نقدم حصصاً فردية مع معلمين مجازين ذوي خبرة عالية.", en: "Al-Hafiz Al-Mutamayez Academy is a global educational platform specializing in Quran memorization, Tajweed rules teaching, and Arabic language foundation for children and adults online. We offer individual sessions with certified and highly experienced teachers.", fr: "L'acad\u00e9mie Al-Hafiz Al-Mutamayez est une plateforme \u00e9ducative mondiale sp\u00e9cialis\u00e9e dans la m\u00e9morisation du Coran, l'enseignement du Tajweed et les bases de la langue arabe pour enfants et adultes en ligne." },

  // Features
  "features.badge": { ar: "مميزاتنا", en: "Our Features", fr: "Nos avantages" },
  "features.title": { ar: "لماذا تختارنا؟", en: "Why Choose Us?", fr: "Pourquoi nous choisir?" },
  "features.1.title": { ar: "معلمون مجازون", en: "Certified Teachers", fr: "Enseignants certifi\u00e9s" },
  "features.1.desc": { ar: "نخبة من المعلمين الحاصلين على إجازات في القراءات والتجويد", en: "Elite teachers with certified Ijazah in Quranic recitations and Tajweed", fr: "Enseignants d'\u00e9lite certifi\u00e9s en r\u00e9citations coraniques et Tajweed" },
  "features.2.title": { ar: "مرونة في المواعيد", en: "Flexible Scheduling", fr: "Horaires flexibles" },
  "features.2.desc": { ar: "اختر الوقت المناسب لك من أي مكان في العالم", en: "Choose the time that suits you from anywhere in the world", fr: "Choisissez l'horaire qui vous convient, o\u00f9 que vous soyez" },
  "features.3.title": { ar: "حصص فردية", en: "One-on-One Sessions", fr: "Sessions individuelles" },
  "features.3.desc": { ar: "تعليم فردي يضمن أفضل نتائج مع متابعة مستمرة", en: "Individual teaching ensuring the best results with continuous follow-up", fr: "Enseignement individuel pour les meilleurs r\u00e9sultats" },
  "features.4.title": { ar: "منهج شامل", en: "Comprehensive Curriculum", fr: "Programme complet" },
  "features.4.desc": { ar: "حفظ وتجويد ومراجعة وتفسير بمنهجية علمية متكاملة", en: "Memorization, Tajweed, review and interpretation with an integrated methodology", fr: "M\u00e9morisation, Tajweed, r\u00e9vision et interpr\u00e9tation" },
  "features.5.title": { ar: "إشراف مستمر", en: "Continuous Supervision", fr: "Supervision continue" },
  "features.5.desc": { ar: "متابعة دورية لمستوى الطالب وتقارير شهرية للأهل", en: "Regular monitoring of student progress with monthly reports", fr: "Suivi r\u00e9gulier et rapports mensuels" },
  "features.6.title": { ar: "أسعار مناسبة", en: "Affordable Prices", fr: "Prix abordables" },
  "features.6.desc": { ar: "باقات متنوعة تناسب جميع الميزانيات مع جودة عالية", en: "Various packages that suit all budgets with high quality", fr: "Forfaits vari\u00e9s adapt\u00e9s \u00e0 tous les budgets" },

  // Stats
  "stats.students": { ar: "طالب وطالبة", en: "Students", fr: "\u00c9tudiants" },
  "stats.teachers": { ar: "معلم ومعلمة", en: "Teachers", fr: "Enseignants" },
  "stats.countries": { ar: "دولة", en: "Countries", fr: "Pays" },
  "stats.sessions": { ar: "حصة شهرياً", en: "Monthly Sessions", fr: "Sessions mensuelles" },

  // Pricing Hub
  "pricing.title": { ar: "اختر برنامجك التعليمي", en: "Choose Your Learning Program", fr: "Choisissez votre programme" },
  "pricing.subtitle": { ar: "اكتشف برامجنا التعليمية المتميزة في القرآن الكريم والتجويد وتأسيس اللغة العربية", en: "Discover our premium educational programs in Quran memorization, Tajweed, and Arabic language foundation", fr: "D\u00e9couvrez nos programmes \u00e9ducatifs premium en m\u00e9morisation du Coran et langue arabe" },
  "pricing.quran.title": { ar: "القرآن الكريم والتجويد", en: "Quran & Tajweed", fr: "Coran & Tajweed" },
  "pricing.quran.description": { ar: "تعلم حفظ القرآن الكريم مع أفضل المعلمين المجازين في أحكام التجويد الصحيح", en: "Learn Quran memorization with certified teachers in proper Tajweed", fr: "Apprenez la m\u00e9morisation du Coran avec des enseignants certifi\u00e9s" },
  "pricing.quran.button": { ar: "عرض الباقات", en: "View Packages", fr: "Voir les forfaits" },
  "pricing.arabic.title": { ar: "تأسيس اللغة العربية", en: "Arabic Language Foundation", fr: "Fondation de la langue arabe" },
  "pricing.arabic.description": { ar: "تعلم أساسيات اللغة العربية من القراءة والكتابة إلى القواعد النحوية", en: "Master Arabic language basics from reading and writing to grammar", fr: "Ma\u00eetrisez les bases de la langue arabe" },
  "pricing.arabic.button": { ar: "عرض الباقات", en: "View Packages", fr: "Voir les forfaits" },
  "pricing.includes": { ar: "تشمل جميع المميزات", en: "Includes all features", fr: "Inclut toutes les fonctionnalités" },
  "pricing.why-choose": { ar: "لماذا تختار أكاديمية الحافظ المتميز؟", en: "Why Choose Al-Hafiz Academy?", fr: "Pourquoi choisir l'acad\u00e9mie?" },
  "pricing.trust-message": { ar: "انضم إلى آلاف الطلاب الراضين حول العالم الذين اختاروا تعليمهم من الأفضل", en: "Join thousands of satisfied students worldwide who chose excellence in education", fr: "Rejoignez des milliers d'\u00e9tudiants satisfaits \u00e0 travers le monde" },
  "pricing.ready-start": { ar: "هل أنت مستعد لبدء رحلتك التعليمية؟", en: "Ready to Start Your Learning Journey?", fr: "Pr\u00eat \u00e0 commencer votre parcours?" },
  "pricing.cta-message": { ar: "اختر الدورة التي تناسبك وابدأ التعلم مع أفضل المعلمين", en: "Choose the course that suits you and start learning with the best teachers", fr: "Choisissez le cours qui vous convient et commencez \u00e0 apprendre" },

  // Pricing individual pages
  "pricing.quran.title": { ar: "باقات القرآن الكريم", en: "Quran Packages", fr: "Forfaits Coran" },
  "pricing.arabic.title": { ar: "باقات تأسيس العربي", en: "Arabic Language Packages", fr: "Forfaits Langue Arabe" },
  "pricing.sessions": { ar: "حصص", en: "Sessions", fr: "Sessions" },
  "pricing.session": { ar: "حصة", en: "Sessions", fr: "Sessions" },
  "pricing.duration": { ar: "30 دقيقة/حصة", en: "30 min/session", fr: "30 min/session" },
  "pricing.subscribe": { ar: "اشترك الآن", en: "Subscribe Now", fr: "Abonnez-vous" },
  "pricing.popular": { ar: "الأكثر طلباً", en: "Most Popular", fr: "Le plus populaire" },
  "pricing.month": { ar: "شهرياً", en: "/month", fr: "/mois" },
  "pricing.features.flexibility": { ar: "مرونة في اختيار الوقت", en: "Flexible scheduling", fr: "Horaires flexibles" },
  "pricing.features.certified": { ar: "معلمون مجازون", en: "Certified teachers", fr: "Enseignants certifi\u00e9s" },
  "pricing.features.supervision": { ar: "إشراف ومتابعة", en: "Supervision & follow-up", fr: "Supervision et suivi" },
  "pricing.features.memorization": { ar: "حفظ وتجويد ومراجعة وتفسير", en: "Memorization, Tajweed, review & interpretation", fr: "M\u00e9morisation, Tajweed, r\u00e9vision et interpr\u00e9tation" },
  "pricing.features.reading": { ar: "قراءة وكتابة بطرق حديثة", en: "Reading & writing with modern methods", fr: "Lecture et \u00e9criture avec des m\u00e9thodes modernes" },
  "pricing.features.certifiedTeachers": { ar: "معلمون متخصصون", en: "Specialized teachers", fr: "Enseignants sp\u00e9cialis\u00e9s" },

  // Quran page
  "quran.hero.title": { ar: "القرآن الكريم والتجويد", en: "Quran & Tajweed", fr: "Coran & Tajweed" },
  "quran.hero.desc": { ar: "رحلة إيمانية لحفظ كتاب الله مع نخبة من المعلمين المجازين", en: "A spiritual journey to memorize the Book of Allah with elite certified teachers", fr: "Un voyage spirituel pour m\u00e9moriser le Livre d'Allah avec des enseignants certifi\u00e9s" },
  "quran.method.title": { ar: "منهجنا في التعليم", en: "Our Teaching Method", fr: "Notre m\u00e9thode d'enseignement" },
  "quran.method.desc": { ar: "نعتمد منهجية شاملة تجمع بين الحفظ المتقن والتجويد السليم والمراجعة الدورية والتفسير المبسط، مع مراعاة الفروق الفردية لكل طالب. يتم تقييم مستوى الطالب أولاً ثم وضع خطة تعليمية مخصصة له.", en: "We follow a comprehensive methodology combining proper memorization, correct Tajweed, periodic review, and simplified interpretation, while considering individual differences. Each student is assessed first, then a personalized learning plan is created.", fr: "Nous suivons une m\u00e9thodologie compl\u00e8te combinant m\u00e9morisation, Tajweed, r\u00e9vision p\u00e9riodique et interpr\u00e9tation simplifi\u00e9e." },

  // Arabic page
  "arabic.hero.title": { ar: "تأسيس اللغة العربية", en: "Arabic Language Foundation", fr: "Fondation de la langue arabe" },
  "arabic.hero.desc": { ar: "تعلم القراءة والكتابة بأحدث الطرق التعليمية مع معلمين متخصصين", en: "Learn reading and writing with the latest educational methods with specialized teachers", fr: "Apprenez la lecture et l'\u00e9criture avec les derni\u00e8res m\u00e9thodes" },
  "arabic.method.title": { ar: "طريقتنا في التأسيس", en: "Our Foundation Method", fr: "Notre m\u00e9thode" },
  "arabic.method.desc": { ar: "نستخدم أحدث الطرق التعليمية في تأسيس اللغة العربية من خلال مناهج تفاعلية تشمل تعلم الحروف والحركات والقراءة والكتابة والإملاء والتعبير، مع استخدام وسائل تعليمية مبتكرة تناسب الأطفال والمبتدئين.", en: "We use the latest educational methods for Arabic language foundation through interactive curricula including letters, vowels, reading, writing, dictation, and expression, with innovative teaching tools suitable for children and beginners.", fr: "Nous utilisons les derni\u00e8res m\u00e9thodes pour les bases de la langue arabe \u00e0 travers des programmes interactifs." },

  // Teachers
  "teachers.title": { ar: "فريق المعلمين", en: "Our Teachers", fr: "Nos Enseignants" },
  "teachers.desc": { ar: "نخبة من المعلمين المجازين ذوي الخبرة العالية في تعليم القرآن واللغة العربية", en: "Elite certified teachers with extensive experience in teaching Quran and Arabic", fr: "Enseignants certifi\u00e9s d'\u00e9lite avec une vaste exp\u00e9rience" },

  // Reviews
  "reviews.title": { ar: "آراء طلابنا وأولياء الأمور", en: "Student & Parent Reviews", fr: "Avis des \u00e9tudiants et parents" },
  "reviews.desc": { ar: "ماذا يقول طلابنا وأولياء ��مورهم عن تجربتهم معنا", en: "What our students and their parents say about their experience", fr: "Ce que nos \u00e9tudiants et leurs parents disent de leur exp\u00e9rience" },

  // Library
  "library.title": { ar: "المكتبة الإلكترونية", en: "Digital Library", fr: "Biblioth\u00e8que num\u00e9rique" },
  "library.desc": { ar: "مكتبة شاملة تضم أفضل الكتب والمواد التعليمية", en: "A comprehensive library with the best books and educational materials", fr: "Une biblioth\u00e8que compl\u00e8te" },

  // Games
  "games.title": { ar: "الألعاب والمسابقات التعليمية", en: "Educational Games & Quizzes", fr: "Jeux \u00e9ducatifs et quiz" },
  "games.desc": { ar: "تعلم واستمتع مع ألعاب ومسابقات تعليمية تفاعلية", en: "Learn and enjoy with interactive educational games and quizzes", fr: "Apprenez et amusez-vous avec des jeux \u00e9ducatifs interactifs" },

  // FAQ
  "faq.title": { ar: "الأسئلة الشائعة", en: "Frequently Asked Questions", fr: "Questions fr\u00e9quemment pos\u00e9es" },
  "faq.desc": { ar: "إجابات على أكثر الأسئلة شيوعاً حول خدماتنا", en: "Answers to the most common questions about our services", fr: "R\u00e9ponses aux questions les plus courantes" },

  // Contact
  "contact.title": { ar: "تواصل معنا", en: "Contact Us", fr: "Contactez-nous" },
  "contact.desc": { ar: "نسعد بتواصلكم معنا للاستفسار أو الاشتراك", en: "We are happy to hear from you for inquiries or subscription", fr: "Nous sommes heureux de vous entendre" },
  "contact.name": { ar: "الاسم الكامل", en: "Full Name", fr: "Nom complet" },
  "contact.email": { ar: "البريد الإلكتروني", en: "Email", fr: "E-mail" },
  "contact.phone": { ar: "رقم الهاتف", en: "Phone", fr: "T\u00e9l\u00e9phone" },
  "contact.message": { ar: "الرسالة", en: "Message", fr: "Message" },
  "contact.send": { ar: "إرسال الرسالة", en: "Send Message", fr: "Envoyer" },
  "contact.success": { ar: "تم إرسال رسالتك بنجاح!", en: "Your message has been sent successfully!", fr: "Votre message a \u00e9t\u00e9 envoy\u00e9 avec succ\u00e8s!" },

  // Footer
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All Rights Reserved", fr: "Tous droits r\u00e9serv\u00e9s" },
  "footer.quickLinks": { ar: "روابط سريعة", en: "Quick Links", fr: "Liens rapides" },
  "footer.services": { ar: "خدماتنا", en: "Our Services", fr: "Nos services" },
  "footer.legal": { ar: "الصفحات القانونية", en: "Legal", fr: "L\u00e9gal" },
  "footer.privacy": { ar: "سياسة الخصوصية", en: "Privacy Policy", fr: "Politique de confidentialit\u00e9" },
  "footer.terms": { ar: "شروط الاستخدام", en: "Terms of Use", fr: "Conditions d'utilisation" },
  "footer.refund": { ar: "سياسة الاسترداد", en: "Refund Policy", fr: "Politique de remboursement" },
  "footer.contact": { ar: "معلومات الاتصال", en: "Contact Info", fr: "Coordonn\u00e9es" },

  // Blog
  "blog.title": { ar: "مدونة الحافظ المتميز", en: "Al-Hafiz Blog", fr: "Blog Al-Hafiz" },
  "blog.desc": { ar: "مقالات وإرشادات حول تحفيظ القرآن وتعليم اللغة العربية", en: "Articles and guides on Quran memorization and Arabic language teaching", fr: "Articles et guides sur la mémorisation du Coran" },
  "blog.readTime": { ar: "دقائق القراءة", en: "min read", fr: "min de lecture" },
  "blog.publishedOn": { ar: "نُشرت في", en: "Published on", fr: "Publié le" },
  "blog.author": { ar: "الكاتب", en: "Author", fr: "Auteur" },
  "blog.category": { ar: "الفئة", en: "Category", fr: "Catégorie" },
  "blog.relatedArticles": { ar: "مقالات ذات صلة", en: "Related Articles", fr: "Articles connexes" },
  "blog.backToBlog": { ar: "العودة للمدونة", en: "Back to Blog", fr: "Retour au blog" },

  // Account
  "account.title": { ar: "حسابي", en: "My Account", fr: "Mon compte" },
  "account.login": { ar: "تسجيل الدخول", en: "Sign In", fr: "Se connecter" },
  "account.signup": { ar: "إنشاء حس����ب", en: "Sign Up", fr: "S'inscrire" },
  "account.logout": { ar: "تسجيل الخروج", en: "Sign Out", fr: "Se déconnecter" },
  "account.email": { ar: "البريد الإلكتروني", en: "Email", fr: "E-mail" },
  "account.password": { ar: "كلمة المرور", en: "Password", fr: "Mot de passe" },
  "account.name": { ar: "الاسم الكامل", en: "Full Name", fr: "Nom complet" },
  "account.phone": { ar: "رقم الهاتف", en: "Phone Number", fr: "Numéro de téléphone" },
  "account.dontHaveAccount": { ar: "ليس لديك حساب؟", en: "Don't have an account?", fr: "Vous n'avez pas de compte?" },
  "account.haveAccount": { ar: "هل لديك حساب بالفعل؟", en: "Already have an account?", fr: "Vous avez déjà un compte?" },
  "account.profile": { ar: "الملف الشخصي", en: "Profile", fr: "Profil" },
  "account.myOrders": { ar: "طلباتي", en: "My Orders", fr: "Mes commandes" },

  // Common
  "common.readMore": { ar: "اقرأ المزيد", en: "Read More", fr: "En savoir plus" },
  "common.download": { ar: "تحميل", en: "Download", fr: "Télécharger" },
  "common.read": { ar: "قراءة", en: "Read", fr: "Lire" },
  "common.play": { ar: "العب الآن", en: "Play Now", fr: "Jouer" },
  "common.score": { ar: "النتيجة", en: "Score", fr: "Score" },
  "common.next": { ar: "التالي", en: "Next", fr: "Suivant" },
  "common.tryAgain": { ar: "حاول مرة أخرى", en: "Try Again", fr: "Réessayer" },
  "common.correct": { ar: "إجابة صحيحة!", en: "Correct!", fr: "Correct!" },
  "common.wrong": { ar: "إجابة خاطئة!", en: "Wrong!", fr: "Incorrect!" },
  "common.save": { ar: "حفظ", en: "Save", fr: "Enregistrer" },
  "common.cancel": { ar: "إلغاء", en: "Cancel", fr: "Annuler" },
  "common.delete": { ar: "حذف", en: "Delete", fr: "Supprimer" },
  "common.edit": { ar: "تعديل", en: "Edit", fr: "Modifier" },
  "common.add": { ar: "إضافة", en: "Add", fr: "Ajouter" },
  "common.loading": { ar: "جاري التحميل...", en: "Loading...", fr: "Chargement..." },
  "common.error": { ar: "حدث خطأ", en: "An error occurred", fr: "Une erreur s'est produite" },
  "common.success": { ar: "تم بنجاح", en: "Success", fr: "Succès" },

  // Classroom Moments
  "classroom.title": { ar: "لقطات من الحصص", en: "Classroom Moments", fr: "Moments de classe" },
  "classroom.hero.title": { ar: "لقطات من الحصص الدراسية", en: "Classroom Moments & Highlights", fr: "Moments des cours" },
  "classroom.hero.desc": { ar: "شاهد فيديوهات حصصنا التفاعلية وتعرف على طريقة تدريسنا الحديثة", en: "Watch our interactive classroom sessions and learn our modern teaching method", fr: "Regardez nos sessions de classe interactives" },
  "classroom.noVideos": { ar: "لم يتم رفع أي حصص بعد", en: "No videos yet", fr: "Pas encore de vidéos" },
  "classroom.videoCount": { ar: "حصة متاحة", en: "sessions available", fr: "sessions disponibles" },
  "classroom.featured": { ar: "محتوى حصري", en: "Exclusive Content", fr: "Contenu exclusif" },
  "classroom.responsive": { ar: "متوافق مع جميع الأجهزة", en: "Compatible with all devices", fr: "Compatible avec tous les appareils" },
  "classroom.viewAll": { ar: "عرض جميع الحصص", en: "View All Sessions", fr: "Voir toutes les sessions" },
  "classroom.watchNow": { ar: "شاهد الآن", en: "Watch Now", fr: "Regarder maintenant" },
  "classroom.videoTitle": { ar: "عنوان الفيديو", en: "Video Title", fr: "Titre de la vidéo" },
  "classroom.youtubeUrl": { ar: "رابط الفيديو", en: "YouTube URL", fr: "URL YouTube" },
  "classroom.description": { ar: "وصف الفيديو", en: "Video Description", fr: "Description de la vidéo" },
  "classroom.category": { ar: "الفئة", en: "Category", fr: "Catégorie" },
  "classroom.teacher": { ar: "المعلم", en: "Teacher", fr: "Professeur" },
  "classroom.uploadVideo": { ar: "رفع فيديو", en: "Upload Video", fr: "Télécharger une vidéo" },
  "classroom.invalidYoutubeUrl": { ar: "رابط YouTube غير صحيح", en: "Invalid YouTube URL", fr: "URL YouTube invalide" },
  "classroom.enterValidUrl": { ar: "يرجى إدخال رابط YouTube صحيح (مثال: https://www.youtube.com/watch?v=xxxxx أو youtu.be/xxxxx)", en: "Please enter a valid YouTube URL", fr: "Veuillez entrer une URL YouTube valide" },
  "classroom.deleteConfirm": { ar: "هل أنت متأكد من حذف هذا الفيديو؟", en: "Are you sure you want to delete this video?", fr: "Êtes-vous sûr de vouloir supprimer cette vidéo?" },
  "classroom.autoTranslate": { ar: "ترجمة تلقائية من العربية", en: "Auto Translate from Arabic", fr: "Traduction automatique de l'arabe" },
  "classroom.translating": { ar: "جاري الترجمة...", en: "Translating...", fr: "Traduction en cours..." },
  "classroom.videoAdded": { ar: "تمت إضافة الحصة بنجاح", en: "Video added successfully", fr: "Vidéo ajoutée avec succès" },
  "classroom.videoUpdated": { ar: "تم تحديث الحصة بنجاح", en: "Video updated successfully", fr: "Vidéo mise à jour avec succès" },
  "classroom.videoDeleted": { ar: "تم حذف الحصة بنجاح", en: "Video deleted successfully", fr: "Vidéo supprimée avec succès" },

  // Admin Dashboard
  "admin.title": { ar: "لوحة التحكم", en: "Admin Dashboard", fr: "Tableau de bord administrateur" },
  "admin.dashboard": { ar: "الرئيسية", en: "Dashboard", fr: "Tableau de bord" },
  "admin.packages": { ar: "الباقات", en: "Packages", fr: "Forfaits" },
  "admin.teachers": { ar: "المعلمين", en: "Teachers", fr: "Enseignants" },
  "admin.reviews": { ar: "آراء الطلاب", en: "Reviews", fr: "Avis" },
  "admin.messages": { ar: "الرسائل", en: "Messages", fr: "Messages" },
  "admin.pages": { ar: "الصفحات", en: "Pages", fr: "Pages" },
  "admin.settings": { ar: "الإعدادات", en: "Settings", fr: "Paramètres" },
  "admin.seoGuide": { ar: "دليل نشر Google", en: "Google Publishing Guide", fr: "Guide de publication Google" },
  "admin.cms": { ar: "إدارة المحتوى", en: "Content Management", fr: "Gestion du contenu" },
  "admin.theme": { ar: "المظهر والمعاينة الحية", en: "Theme & Live Preview", fr: "Thème et aperçu en direct" },
  "admin.pagesBuilder": { ar: "منشئ الصفحات", en: "Pages Builder", fr: "Constructeur de pages" },
  "admin.users": { ar: "المستخدمين والصلاحيات", en: "Users & Permissions", fr: "Utilisateurs et autorisations" },
  "admin.classroomVideos": { ar: "فيديوهات من الحصص", en: "Classroom Videos", fr: "Vidéos de classe" },
  "admin.digitalLibrary": { ar: "المكتبة الرقمية", en: "Digital Library", fr: "Bibliothèque numérique" },
  "admin.educationalGames": { ar: "الألعاب التعليمية", en: "Educational Games", fr: "Jeux éducatifs" },
  "admin.zapier": { ar: "Zapier", en: "Zapier", fr: "Zapier" },
  "admin.welcomeTitle": { ar: "مرحباً بك في لوحة التحكم", en: "Welcome to Admin Dashboard", fr: "Bienvenue dans le tableau de bord" },
  "admin.activePackages": { ar: "الباقات النشطة", en: "Active Packages", fr: "Forfaits actifs" },
  "admin.registeredStudents": { ar: "الطلاب المسجلين", en: "Registered Students", fr: "Étudiants inscrits" },
  "admin.publishedLessons": { ar: "الدروس المنشورة", en: "Published Lessons", fr: "Leçons publiées" },
  "admin.rating": { ar: "التقييم العام", en: "Overall Rating", fr: "Note globale" },
  "admin.save": { ar: "حفظ", en: "Save", fr: "Enregistrer" },
  "admin.delete": { ar: "حذف", en: "Delete", fr: "Supprimer" },
  "admin.edit": { ar: "تعديل", en: "Edit", fr: "Modifier" },
  "admin.cancel": { ar: "إلغاء", en: "Cancel", fr: "Annuler" },
  "admin.add": { ar: "إضافة", en: "Add", fr: "Ajouter" },
  "admin.loading": { ar: "جاري التحميل...", en: "Loading...", fr: "Chargement..." },
  "admin.error": { ar: "حدث خطأ", en: "An error occurred", fr: "Une erreur s'est produite" },
  "admin.retry": { ar: "إعادة المحاولة", en: "Retry", fr: "Réessayer" },
  "admin.saved": { ar: "تم الحفظ بنجاح", en: "Saved successfully", fr: "Enregistré avec succès" },
  "admin.deleted": { ar: "تم الحذف بنجاح", en: "Deleted successfully", fr: "Supprimé avec succès" },
  "admin.noData": { ar: "لا توجد بيانات", en: "No data", fr: "Pas de données" },
  "admin.titleAr": { ar: "العنوان (عربي)", en: "Title (Arabic)", fr: "Titre (Arabe)" },
  "admin.titleEn": { ar: "العنوان (إنجليزي)", en: "Title (English)", fr: "Titre (Anglais)" },
  "admin.titleFr": { ar: "العنوان (فرنسي)", en: "Title (French)", fr: "Titre (Français)" },
  "admin.descriptionAr": { ar: "الوصف (عربي)", en: "Description (Arabic)", fr: "Description (Arabe)" },
  "admin.descriptionEn": { ar: "الوصف (إنجليزي)", en: "Description (English)", fr: "Description (Anglais)" },
  "admin.descriptionFr": { ar: "الوصف (فرنسي)", en: "Description (French)", fr: "Description (Français)" },
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: "rtl" | "ltr"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar")

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])

  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[locale] || key
    },
    [locale]
  )

  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
