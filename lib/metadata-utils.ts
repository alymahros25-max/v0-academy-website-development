import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://quran-elhafez.com'),
  title: {
    default: 'أكاديمية الحافظ المتميز اون لاين | تحفيظ قران وتأسيس عربي',
    template: '%s | أكاديمية الحافظ المتميز',
  },
  description: 'أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين مع معلمين مجازين',
  alternates: {
    languages: {
      'ar': 'https://quran-elhafez.com',
      'en': 'https://quran-elhafez.com?lang=en',
      'fr': 'https://quran-elhafez.com?lang=fr',
      'x-default': 'https://quran-elhafez.com',
    },
  },
}

export function generatePageMetadata(page: 'quran' | 'arabic' | 'about' | 'teachers' | 'reviews' | 'library' | 'games' | 'faq' | 'contact' | 'privacy' | 'terms'): Metadata {
  const baseUrl = 'https://quran-elhafez.com'
  const pageRoutes: Record<string, string> = {
    quran: '/quran',
    arabic: '/arabic',
    about: '/about',
    teachers: '/teachers',
    reviews: '/reviews',
    library: '/library',
    games: '/games',
    faq: '/faq',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
  }

  const getAlternates = (route: string) => ({
    languages: {
      'ar': `${baseUrl}${route}`,
      'en': `${baseUrl}${route}?lang=en`,
      'fr': `${baseUrl}${route}?lang=fr`,
      'x-default': `${baseUrl}${route}`,
    },
  })

  const metadataMap: Record<string, Metadata> = {
    quran: {
      title: 'تحفيظ القرآن الكريم اون لاين | أكاديمية الحافظ المتميز',
      description: 'حلقات تحفيظ قران اون لاين مع معلمين مجازين. تجويد وحفظ مع مرونة في المواعيد وأسعار مناسبة',
      keywords: ['تحفيظ قران اون لاين', 'معلم قرآن', 'تجويد', 'حفظ قرآن'],
      alternates: getAlternates(pageRoutes.quran),
      openGraph: {
        title: 'تحفيظ القرآن الكريم اون لاين',
        description: 'حلقات تحفيظ قران اون لاين مع معلمين مجازين',
        type: 'website',
        url: 'https://quran-elhafez.com/quran',
      },
    },
    arabic: {
      title: 'تأسيس اللغة العربية للأطفال | أكاديمية الحافظ المتميز',
      description: 'برامج تأسيس اللغة العربية بطرق حديثة. قراءة وكتابة وقواعد نحوية مع معلمين متخصصين',
      keywords: ['تأسيس عربي', 'تعليم اللغة العربية', 'قراءة وكتابة', 'أطفال'],
      alternates: getAlternates(pageRoutes.arabic),
      openGraph: {
        title: 'تأسيس اللغة العربية للأطفال',
        description: 'برامج تأسيس اللغة العربية بطرق حديثة',
        type: 'website',
        url: 'https://quran-elhafez.com/arabic',
      },
    },
    about: {
      title: 'من نحن | أكاديمية الحافظ المتميز',
      description: 'تعرف على أكاديمية الحافظ المتميز، أكاديمية عالمية متخصصة في تحفيظ القرآن وتأسيس اللغة العربية',
      keywords: ['من نحن', 'عن الأكاديمية', 'رسالتنا', 'أهدافنا'],
      alternates: getAlternates(pageRoutes.about),
      openGraph: {
        title: 'من نحن',
        description: 'تعرف على أكاديمية الحافظ المتميز',
        type: 'website',
        url: 'https://quran-elhafez.com/about',
      },
    },
    teachers: {
      title: 'المعلمين | أكاديمية الحافظ المتميز',
      description: 'تعرف على فريق المعلمين المجازين والمتخصصين في أكاديمية الحافظ المتميز',
      keywords: ['معلمين', 'مدرسين قرآن', 'معلمي عربي'],
      alternates: getAlternates(pageRoutes.teachers),
      openGraph: {
        title: 'المعلمين',
        description: 'فريق المعلمين المجازين والمتخصصين',
        type: 'website',
        url: 'https://quran-elhafez.com/teachers',
      },
    },
    reviews: {
      title: 'آراء الطلاب | أكاديمية الحافظ المتميز',
      description: 'اقرأ آراء وتقييمات الطلاب وأولياء الأمور عن أكاديمية الحافظ المتميز',
      keywords: ['آراء', 'تقييمات', 'شهادات', 'تقييمات الطلاب'],
      alternates: getAlternates(pageRoutes.reviews),
      openGraph: {
        title: 'آراء الطلاب',
        description: 'آراء وتقييمات الطلاب وأولياء الأمور',
        type: 'website',
        url: 'https://quran-elhafez.com/reviews',
      },
    },
    library: {
      title: 'المكتبة الرقمية | أكاديمية الحافظ المتميز',
      description: 'مكتبة رقمية تحتوي على كتب وموارد تعليمية لتحفيظ القرآن وتأسيس اللغة العربية',
      keywords: ['مكتبة', 'كتب', 'موارد تعليمية', 'PDF'],
      alternates: getAlternates(pageRoutes.library),
      openGraph: {
        title: 'المكتبة الرقمية',
        description: 'موارد تعليمية وكتب رقمية',
        type: 'website',
        url: 'https://quran-elhafez.com/library',
      },
    },
    games: {
      title: 'الألعاب والمسابقات | أكاديمية الحافظ المتميز',
      description: 'ألعاب تعليمية وممتعة لتعليم الأطفال القرآن والعربية بطريقة ترفيهية',
      keywords: ['ألعاب', 'مسابقات', 'ألعاب تعليمية', 'ألعاب للأطفال'],
      alternates: getAlternates(pageRoutes.games),
      openGraph: {
        title: 'الألعاب والمسابقات',
        description: 'ألعاب تعليمية وممتعة',
        type: 'website',
        url: 'https://quran-elhafez.com/games',
      },
    },
    faq: {
      title: 'الأسئلة الشائعة | أكاديمية الحافظ المتميز',
      description: 'الأسئلة الشائعة والإجابات عن خدمات أكاديمية الحافظ المتميز',
      keywords: ['أسئلة', 'أسئلة شائعة', 'FAQ', 'مساعدة'],
      alternates: getAlternates(pageRoutes.faq),
      openGraph: {
        title: 'الأسئلة الشائعة',
        description: 'الأسئلة الشائعة والإجابات',
        type: 'website',
        url: 'https://quran-elhafez.com/faq',
      },
    },
    contact: {
      title: 'اتصل بنا | أكاديمية الحافظ المتميز',
      description: 'تواصل معنا عبر الاتصال المباشر أو النموذج. نحن هنا للإجابة على استفسارات',
      keywords: ['اتصل بنا', 'تواصل', 'استفسارات', 'دعم'],
      alternates: getAlternates(pageRoutes.contact),
      openGraph: {
        title: 'اتصل بنا',
        description: 'تواصل معنا لأي استفسارات',
        type: 'website',
        url: 'https://quran-elhafez.com/contact',
      },
    },
    privacy: {
      title: 'سياسة الخصوصية | أكاديمية الحافظ المتميز',
      description: 'سياسة الخصوصية والبيانات الشخصية في أكاديمية الحافظ المتميز',
      alternates: getAlternates(pageRoutes.privacy),
      robots: {
        index: true,
        follow: true,
      },
    },
    terms: {
      title: 'الشروط والأحكام | أكاديمية الحافظ المتميز',
      description: 'الشروط والأحكام العامة والخدمات في أكاديمية الحافظ المتميز',
      alternates: getAlternates(pageRoutes.terms),
      robots: {
        index: true,
        follow: true,
      },
    },
  }

  return metadataMap[page]
}
