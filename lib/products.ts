/**
 * Stripe Products Configuration
 * Source of truth for all pricing packages across the platform
 * All product IDs must match exactly between UI, checkout, and database
 */

export interface Product {
  id: string
  name: {
    ar: string
    en: string
    fr: string
  }
  description: {
    ar: string
    en: string
    fr: string
  }
  priceInCents: number
  category: 'quran' | 'arabic'
  sessions: number
  features: {
    ar: string[]
    en: string[]
    fr: string[]
  }
}

/**
 * PRODUCTS: Master product catalog
 * - Prices are in cents (multiply actual price by 100)
 * - IDs are used for Stripe checkout and database references
 * - Features are displayable in pricing cards
 */
export const PRODUCTS: Product[] = [
  // ============================================================
  // QURAN PACKAGES
  // ============================================================
  {
    id: 'quran-4-sessions',
    name: {
      ar: 'باقة 4 حصص قرآن',
      en: 'Quran 4 Sessions',
      fr: 'Paquet Coran 4 sessions',
    },
    description: {
      ar: 'باقة شاملة من 4 حصص فردية لتحفيظ وتجويد القرآن الكريم',
      en: 'Complete package of 4 individual sessions for Quran memorization and Tajweed',
      fr: 'Forfait complet de 4 sessions individuelles pour la mémorisation et le Tajweed du Coran',
    },
    priceInCents: 1500, // $15.00
    category: 'quran',
    sessions: 4,
    features: {
      ar: ['معلم مجاز', 'حصص فردية', 'مرونة في المواعيد', 'مراجعة منتظمة'],
      en: ['Certified Teacher', 'Private Sessions', 'Flexible Schedule', 'Regular Review'],
      fr: ['Enseignant certifié', 'Sessions privées', 'Horaire flexible', 'Examen régulier'],
    },
  },
  {
    id: 'quran-8-sessions',
    name: {
      ar: 'باقة 8 حصص قرآن',
      en: 'Quran 8 Sessions',
      fr: 'Paquet Coran 8 sessions',
    },
    description: {
      ar: 'باقة موسعة من 8 حصص فردية مع تقدم أسرع وتتبع شامل',
      en: 'Extended package of 8 individual sessions with faster progress and comprehensive tracking',
      fr: 'Forfait étendu de 8 sessions avec un progrès plus rapide et un suivi complet',
    },
    priceInCents: 2800, // $28.00
    category: 'quran',
    sessions: 8,
    features: {
      ar: ['معلم مجاز', 'حصص فردية', 'مرونة في المواعيد', 'مراجعة منتظمة', 'تقدم أسرع'],
      en: ['Certified Teacher', 'Private Sessions', 'Flexible Schedule', 'Regular Review', 'Faster Progress'],
      fr: ['Enseignant certifié', 'Sessions privées', 'Horaire flexible', 'Examen régulier', 'Progrès plus rapide'],
    },
  },
  {
    id: 'quran-12-sessions',
    name: {
      ar: 'باقة 12 حصة قرآن',
      en: 'Quran 12 Sessions',
      fr: 'Paquet Coran 12 sessions',
    },
    description: {
      ar: 'باقة شاملة من 12 حصة مع خطة تعليمية متكاملة وتتبع متقدم',
      en: 'Comprehensive package of 12 sessions with integrated learning plan and advanced tracking',
      fr: 'Forfait complet de 12 sessions avec plan pédagogique intégré et suivi avancé',
    },
    priceInCents: 4200, // $42.00
    category: 'quran',
    sessions: 12,
    features: {
      ar: ['معلم مجاز', 'حصص فردية', 'مرونة في المواعيد', 'مراجعة منتظمة', 'خطة متكاملة'],
      en: ['Certified Teacher', 'Private Sessions', 'Flexible Schedule', 'Regular Review', 'Integrated Plan'],
      fr: ['Enseignant certifié', 'Sessions privées', 'Horaire flexible', 'Examen régulier', 'Plan intégré'],
    },
  },

  // ============================================================
  // ARABIC FOUNDATION PACKAGES
  // ============================================================
  {
    id: 'arabic-4-sessions',
    name: {
      ar: 'باقة 4 حصص عربي',
      en: 'Arabic 4 Sessions',
      fr: 'Forfait Arabe 4 sessions',
    },
    description: {
      ar: 'باقة شاملة من 4 حصص فردية لتأسيس اللغة العربية من الصفر',
      en: 'Complete package of 4 individual sessions for Arabic foundation from scratch',
      fr: 'Forfait complet de 4 sessions pour les bases de la langue arabe',
    },
    priceInCents: 2400, // $24.00
    category: 'arabic',
    sessions: 4,
    features: {
      ar: ['معلم متخصص', 'حصص فردية', 'مرونة في المواعيد', 'مواد تعليمية'],
      en: ['Specialist Teacher', 'Private Sessions', 'Flexible Schedule', 'Learning Materials'],
      fr: ['Enseignant spécialisé', 'Sessions privées', 'Horaire flexible', 'Matériel pédagogique'],
    },
  },
  {
    id: 'arabic-8-sessions',
    name: {
      ar: 'باقة 8 حصص عربي',
      en: 'Arabic 8 Sessions',
      fr: 'Forfait Arabe 8 sessions',
    },
    description: {
      ar: 'باقة موسعة من 8 حصص مع تقدم منتظم في المستويات الأساسية',
      en: 'Extended package of 8 sessions with steady progress through foundational levels',
      fr: 'Forfait étendu de 8 sessions avec des progrès constants aux niveaux fondamentaux',
    },
    priceInCents: 3800, // $38.00
    category: 'arabic',
    sessions: 8,
    features: {
      ar: ['معلم متخصص', 'حصص فردية', 'مرونة في المواعيد', 'مواد تعليمية', 'تقييم مستوى'],
      en: ['Specialist Teacher', 'Private Sessions', 'Flexible Schedule', 'Learning Materials', 'Level Assessment'],
      fr: ['Enseignant spécialisé', 'Sessions privées', 'Horaire flexible', 'Matériel pédagogique', 'Évaluation du niveau'],
    },
  },
  {
    id: 'arabic-12-sessions',
    name: {
      ar: 'باقة 12 حصة عربي',
      en: 'Arabic 12 Sessions',
      fr: 'Forfait Arabe 12 sessions',
    },
    description: {
      ar: 'باقة شاملة من 12 حصة مع خطة تعليمية متكاملة وتقييم شامل',
      en: 'Comprehensive package of 12 sessions with integrated curriculum and full assessment',
      fr: 'Forfait complet de 12 sessions avec programme intégré et évaluation complète',
    },
    priceInCents: 5000, // $50.00
    category: 'arabic',
    sessions: 12,
    features: {
      ar: ['معلم متخصص', 'حصص فردية', 'مرونة في المواعيد', 'مواد تعليمية', 'خطة متكاملة'],
      en: ['Specialist Teacher', 'Private Sessions', 'Flexible Schedule', 'Learning Materials', 'Integrated Plan'],
      fr: ['Enseignant spécialisé', 'Sessions privées', 'Horaire flexible', 'Matériel pédagogique', 'Plan intégré'],
    },
  },
]

/**
 * Helper function to get product by ID
 * Used for server-side price validation in checkout
 */
export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}

/**
 * Helper function to get all products by category
 */
export function getProductsByCategory(category: 'quran' | 'arabic'): Product[] {
  return PRODUCTS.filter((p) => p.category === category)
}

/**
 * Helper function to format price for display
 */
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100)
}
