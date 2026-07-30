// 20 Educational Games Data - Complete dataset for all categories

export interface Game {
  id: string
  titleAr: string
  titleEn: string
  titleFr: string
  descriptionAr: string
  descriptionEn: string
  descriptionFr: string
  category: "letters" | "tajweed" | "quran" | "colors" | "animals" | "sirah" | "companions"
  difficulty: "easy" | "medium" | "hard"
  icon: string
  color: string
  playersCount: string
}

export const GAMES_CATALOG: Game[] = [
  // حياة النبي والصحابة (2 games - NEW)
  {
    id: "prophet-life-1",
    titleAr: "حياة النبي ونسبه وأزواجه",
    titleEn: "Life of the Prophet",
    titleFr: "La vie du Prophète",
    descriptionAr: "اختبر معرفتك بحياة النبي محمد ونسبه وزوجاته وأولاده",
    descriptionEn: "Test your knowledge of Prophet Muhammad's life, lineage, wives, and children",
    descriptionFr: "Testez vos connaissances sur la vie du Prophète Muhammad",
    category: "sira",
    difficulty: "medium",
    icon: "📖",
    color: "from-amber-500 to-amber-700",
    playersCount: "2,100+",
  },
  {
    id: "sahabah-virtues-1",
    titleAr: "مناقب ومواقف الصحابة",
    titleEn: "Virtues & Stories of Companions",
    titleFr: "Vertus des compagnons",
    descriptionAr: "تعرف على مناقب الصحابة الكرام وفضائلهم وتضحياتهم",
    descriptionEn: "Learn about the virtues and achievements of the noble Companions",
    descriptionFr: "Découvrez les vertus des compagnons nobles",
    category: "companions",
    difficulty: "medium",
    icon: "⭐",
    color: "from-yellow-500 to-yellow-700",
    playersCount: "1,950+",
  },

  // الحروف والكلمات (3 games)
  {
    id: "letter-match-1",
    titleAr: "لعبة مطابقة الحروف",
    titleEn: "Letter Matching Game",
    titleFr: "Jeu de correspondance des lettres",
    descriptionAr: "اختبر معرفتك بالحروف العربية وأشكالها المختلفة",
    descriptionEn: "Test your knowledge of Arabic letters and their forms",
    descriptionFr: "Testez vos connaissances des lettres arabes",
    category: "letters",
    difficulty: "easy",
    icon: "🔤",
    color: "from-emerald-500 to-emerald-700",
    playersCount: "2,400+",
  },
  {
    id: "word-builder-1",
    titleAr: "بناء الكلمات العربية",
    titleEn: "Build Arabic Words",
    titleFr: "Construire des mots arabes",
    descriptionAr: "رتب الحروف لتشكيل كلمات قرآنية صحيحة",
    descriptionEn: "Arrange letters to form correct Quranic words",
    descriptionFr: "Arrangez les lettres pour former des mots coraniques",
    category: "letters",
    difficulty: "medium",
    icon: "✍️",
    color: "from-blue-500 to-blue-700",
    playersCount: "1,800+",
  },
  {
    id: "word-complete-1",
    titleAr: "إكمال الكلمات",
    titleEn: "Complete the Words",
    titleFr: "Complétez les mots",
    descriptionAr: "أكمل الكلمات الناقصة واختبر فهمك للعربية",
    descriptionEn: "Fill missing letters and test your Arabic knowledge",
    descriptionFr: "Remplissez les lettres manquantes",
    category: "letters",
    difficulty: "hard",
    icon: "💭",
    color: "from-purple-500 to-purple-700",
    playersCount: "1,200+",
  },

  // التجويد (3 games)
  {
    id: "tajweed-rules-1",
    titleAr: "أحكام التنوين",
    titleEn: "Nunation Rules",
    titleFr: "Règles de la Nunation",
    descriptionAr: "اختبر معرفتك بأحكام التنوين في التجويد",
    descriptionEn: "Test your Nunation rules knowledge",
    descriptionFr: "Testez vos connaissances sur les règles de Nunation",
    category: "tajweed",
    difficulty: "medium",
    icon: "📖",
    color: "from-amber-500 to-amber-700",
    playersCount: "1,500+",
  },
  {
    id: "tajweed-rules-2",
    titleAr: "الميم والنون الساكنة",
    titleEn: "Meem and Noon Rules",
    titleFr: "Règles du Meem et Noon",
    descriptionAr: "تعلم أحكام الميم والنون الساكنة",
    descriptionEn: "Learn silent Meem and Noon rules",
    descriptionFr: "Apprenez les règles du Meem et Noon silencieux",
    category: "tajweed",
    difficulty: "hard",
    icon: "🎵",
    color: "from-red-500 to-red-700",
    playersCount: "1,100+",
  },
  {
    id: "tajweed-rules-3",
    titleAr: "أحكام اللام",
    titleEn: "Lam Rules",
    titleFr: "Règles du Lam",
    descriptionAr: "صنف اللام الشمسية والقمرية بسرعة",
    descriptionEn: "Classify Lam (solar and lunar) quickly",
    descriptionFr: "Classifiez rapidement les Lam",
    category: "tajweed",
    difficulty: "medium",
    icon: "⚡",
    color: "from-yellow-500 to-yellow-700",
    playersCount: "900+",
  },

  // القرآن والتلاوة (3 games)
  {
    id: "quran-order-1",
    titleAr: "ترتيب الآيات",
    titleEn: "Verse Order",
    titleFr: "Ordre des versets",
    descriptionAr: "رتب كلمات الآية القرآنية بالتسلسل الصحيح",
    descriptionEn: "Arrange Quranic verse words correctly",
    descriptionFr: "Arrangez les mots des versets coraniques",
    category: "quran",
    difficulty: "medium",
    icon: "📜",
    color: "from-green-600 to-green-800",
    playersCount: "2,200+",
  },
  {
    id: "surah-guess-1",
    titleAr: "تخمين السورة",
    titleEn: "Guess the Surah",
    titleFr: "Devinez la sourate",
    descriptionAr: "اختر اسم السورة من الآية المعطاة",
    descriptionEn: "Choose the Surah name from given verse",
    descriptionFr: "Choisissez le nom de la sourate",
    category: "quran",
    difficulty: "easy",
    icon: "🤔",
    color: "from-cyan-500 to-cyan-700",
    playersCount: "1,900+",
  },
  {
    id: "verse-match-1",
    titleAr: "مطابقة الآيات",
    titleEn: "Verse Matching",
    titleFr: "Correspondance des versets",
    descriptionAr: "طابق الآية الصحيحة من الخيارات المتعددة",
    descriptionEn: "Match correct verses from multiple choices",
    descriptionFr: "Appariez les versets corrects",
    category: "quran",
    difficulty: "hard",
    icon: "✨",
    color: "from-indigo-500 to-indigo-700",
    playersCount: "1,700+",
  },

  // الأشكال والألوان (2 games)
  {
    id: "shapes-colors-1",
    titleAr: "الأشكال الهندسية",
    titleEn: "Geometric Shapes",
    titleFr: "Formes géométriques",
    descriptionAr: "طابق الشكل الهندسي باسمه الصحيح",
    descriptionEn: "Match geometric shapes with correct names",
    descriptionFr: "Appariez les formes géométriques",
    category: "colors",
    difficulty: "easy",
    icon: "🔷",
    color: "from-pink-500 to-pink-700",
    playersCount: "1,300+",
  },
  {
    id: "shapes-colors-2",
    titleAr: "الألوان الأساسية",
    titleEn: "Basic Colors",
    titleFr: "Couleurs de base",
    descriptionAr: "اختر اللون الصحيح من الخيارات المعطاة",
    descriptionEn: "Choose the correct color from options",
    descriptionFr: "Choisissez la bonne couleur",
    category: "colors",
    difficulty: "easy",
    icon: "🎨",
    color: "from-rose-500 to-rose-700",
    playersCount: "1,100+",
  },

  // الحيوانات في القرآن (2 games)
  {
    id: "animals-quran-1",
    titleAr: "تخمين الحيوان",
    titleEn: "Guess the Animal",
    titleFr: "Devinez l'animal",
    descriptionAr: "اختر الحيوان من صورته والآية القرآنية",
    descriptionEn: "Identify animals from images and Quranic verses",
    descriptionFr: "Identifiez les animaux des images",
    category: "animals",
    difficulty: "easy",
    icon: "🐪",
    color: "from-orange-500 to-orange-700",
    playersCount: "1,400+",
  },
  {
    id: "animals-quran-2",
    titleAr: "الحيوان الناقص",
    titleEn: "Missing Animal",
    titleFr: "Animaux manquants",
    descriptionAr: "أكمل اسم الحيوان الوارد في الآية",
    descriptionEn: "Complete animal names from Quranic verses",
    descriptionFr: "Complétez les noms d'animaux",
    category: "animals",
    difficulty: "medium",
    icon: "🦁",
    color: "from-lime-500 to-lime-700",
    playersCount: "1,000+",
  },

  // الغزوات والسيرة (3 games)
  {
    id: "battles-sirah-1",
    titleAr: "الغزوات الإسلامية",
    titleEn: "Islamic Battles",
    titleFr: "Batailles islamiques",
    descriptionAr: "طابق اسم الغزوة بسنة حدوثها",
    descriptionEn: "Match battle names with their years",
    descriptionFr: "Appariez les noms des batailles",
    category: "sirah",
    difficulty: "medium",
    icon: "⚔️",
    color: "from-stone-600 to-stone-800",
    playersCount: "1,600+",
  },
  {
    id: "sirah-timeline-1",
    titleAr: "أحداث السيرة",
    titleEn: "Sirah Events Timeline",
    titleFr: "Chronologie de la Sirah",
    descriptionAr: "رتب أحداث السيرة النبوية زمنياً",
    descriptionEn: "Arrange Prophet biography events chronologically",
    descriptionFr: "Arrangez les événements de la Sirah",
    category: "sirah",
    difficulty: "hard",
    icon: "⏳",
    color: "from-slate-600 to-slate-800",
    playersCount: "900+",
  },
  {
    id: "battles-sirah-2",
    titleAr: "وصف الغزوات",
    titleEn: "Battle Descriptions",
    titleFr: "Descriptions des batailles",
    descriptionAr: "اختر اسم الغزوة من وصفها",
    descriptionEn: "Choose battle name from description",
    descriptionFr: "Choisissez le nom de la bataille",
    category: "sirah",
    difficulty: "medium",
    icon: "📜",
    color: "from-gray-600 to-gray-800",
    playersCount: "800+",
  },

  // الصحابة والتابعين (4 games)
  {
    id: "companions-cards-1",
    titleAr: "بطاقات الصحابة",
    titleEn: "Companions Cards",
    titleFr: "Cartes des compagnons",
    descriptionAr: "طابق الصحابي باسمه وصفته",
    descriptionEn: "Match companions with names and descriptions",
    descriptionFr: "Appariez les compagnons",
    category: "companions",
    difficulty: "medium",
    icon: "👥",
    color: "from-teal-500 to-teal-700",
    playersCount: "1,300+",
  },
  {
    id: "companions-quiz-1",
    titleAr: "مسابقة الصحابة",
    titleEn: "Companions Quiz",
    titleFr: "Quiz des compagnons",
    descriptionAr: "أجب عن 10 أسئلة عن الصحابة الكرام",
    descriptionEn: "Answer 10 questions about the Companions",
    descriptionFr: "Répondez à 10 questions sur les compagnons",
    category: "companions",
    difficulty: "hard",
    icon: "❓",
    color: "from-violet-500 to-violet-700",
    playersCount: "1,100+",
  },
]

// Get games by category
export function getGamesByCategory(category: Game["category"]): Game[] {
  return GAMES_CATALOG.filter((game) => game.category === category)
}

// Get all categories
export function getCategories() {
  const categories = [...new Set(GAMES_CATALOG.map((g) => g.category))]
  return categories
}

// Get category display name
export function getCategoryName(category: Game["category"], locale: "ar" | "en" | "fr"): string {
  const names: Record<Game["category"], Record<string, string>> = {
    letters: {
      ar: "الحروف والكلمات",
      en: "Letters & Words",
      fr: "Lettres et mots",
    },
    tajweed: {
      ar: "التجويد",
      en: "Tajweed",
      fr: "Tajweed",
    },
    quran: {
      ar: "القرآن الكريم",
      en: "Quran",
      fr: "Coran",
    },
    colors: {
      ar: "الأشكال والألوان",
      en: "Shapes & Colors",
      fr: "Formes et couleurs",
    },
    animals: {
      ar: "الحيوانات",
      en: "Animals",
      fr: "Animaux",
    },
    sirah: {
      ar: "السيرة النبوية",
      en: "Prophet Biography",
      fr: "Biographie du Prophète",
    },
    companions: {
      ar: "الصحابة",
      en: "Companions",
      fr: "Compagnons",
    },
  }
  return names[category]?.[locale] || category
}
