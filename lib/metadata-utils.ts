import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://alhafiz-academy.com'),
  title: {
    default: 'أكاديمية الحافظ المتميز اون لاين | تحفيظ قران وتأسيس عربي',
    template: '%s | أكاديمية الحافظ المتميز',
  },
  description: 'أكاديمية عالمية لتحفيظ القرآن الكريم وتأسيس اللغة العربية اون لاين مع معلمين مجازين',
}

export function generatePageMetadata(page: 'quran' | 'arabic' | 'about' | 'teachers' | 'reviews' | 'library' | 'games' | 'faq' | 'contact' | 'privacy' | 'terms'): Metadata {
  const metadataMap: Record<string, Metadata> = {
    quran: {
      title: 'تحفيظ القرآن الكريم اون لاين | أكاديمية الحافظ المتميز',
      description: 'حلقات تحفيظ قران اون لاين مع معلمين مجازين. تجويد وحفظ مع مرونة في المواعيد وأسعار مناسبة',
      keywords: ['تحفيظ قران اون لاين', 'معلم قرآن', 'تجويد', 'حفظ قرآن'],
      openGraph: {
        title: 'تحفيظ القرآن الكريم اون لاين',
        description: 'حلقات تحفيظ قران اون لاين مع معلمين مجازين',
        type: 'website',
        url: 'https://alhafiz-academy.com/quran',
      },
    },
    arabic: {
      title: 'تأسيس اللغة العربية للأطفال | أكاديمية الحافظ المتميز',
      description: 'برامج تأسيس اللغة العربية بطرق حديثة. قراءة وكتابة وقواعد نحوية مع معلمين متخصصين',
      keywords: ['تأسيس عربي', 'تعليم اللغة العربية', 'قراءة وكتابة', 'أطفال'],
      openGraph: {
        title: 'تأسيس اللغة العربية للأطفال',
        description: 'برامج تأسيس اللغة العربية بطرق حديثة',
        type: 'website',
        url: 'https://alhafiz-academy.com/arabic',
      },
    },
    about: {
      title: 'من نحن | أكاديمية الحافظ المتميز',
      description: 'تعرف على أكاديمية الحافظ المتميز، أكاديمية عالمية متخصصة في تحفيظ القرآن وتأسيس اللغة العربية',
      keywords: ['من نحن', 'عن الأكاديمية', 'رسالتنا', 'أهدافنا'],
      openGraph: {
        title: 'من نحن',
        description: 'تعرف على أكاديمية الحافظ المتميز',
        type: 'website',
        url: 'https://alhafiz-academy.com/about',
      },
    },
    teachers: {
      title: 'المعلمين | أكاديمية الحافظ المتميز',
      description: 'تعرف على فريق المعلمين المجازين والمتخصصين في أكاديمية الحافظ المتميز',
      keywords: ['معلمين', 'مدرسين قرآن', 'معلمي عربي'],
      openGraph: {
        title: 'المعلمين',
        description: 'فريق المعلمين المجازين والمتخصصين',
        type: 'website',
        url: 'https://alhafiz-academy.com/teachers',
      },
    },
    reviews: {
      title: 'آراء الطلاب | أكاديمية الحافظ المتميز',
      description: 'اقرأ آراء وتقييمات الطلاب وأولياء الأمور عن أكاديمية الحافظ المتميز',
      keywords: ['آراء', 'تقييمات', 'شهادات', 'تقييمات الطلاب'],
      openGraph: {
        title: 'آراء الطلاب',
        description: 'آراء وتقييمات الطلاب وأولياء الأمور',
        type: 'website',
        url: 'https://alhafiz-academy.com/reviews',
      },
    },
    library: {
      title: 'المكتبة الرقمية | أكاديمية الحافظ المتميز',
      description: 'مكتبة رقمية تحتوي على كتب وموارد تعليمية لتحفيظ القرآن وتأسيس اللغة العربية',
      keywords: ['مكتبة', 'كتب', 'موارد تعليمية', 'PDF'],
      openGraph: {
        title: 'المكتبة الرقمية',
        description: 'موارد تعليمية وكتب رقمية',
        type: 'website',
        url: 'https://alhafiz-academy.com/library',
      },
    },
    games: {
      title: 'الألعاب والمسابقات | أكاديمية الحافظ المتميز',
      description: 'ألعاب تعليمية وممتعة لتعليم الأطفال القرآن والعربية بطريقة ترفيهية',
      keywords: ['ألعاب', 'مسابقات', 'ألعاب تعليمية', 'ألعاب للأطفال'],
      openGraph: {
        title: 'الألعاب والمسابقات',
        description: 'ألعاب تعليمية وممتعة',
        type: 'website',
        url: 'https://alhafiz-academy.com/games',
      },
    },
    faq: {
      title: 'الأسئلة الشائعة | أكاديمية الحافظ المتميز',
      description: 'الأسئلة الشائعة والإجابات عن خدمات أكاديمية الحافظ المتميز',
      keywords: ['أسئلة', 'أسئلة شائعة', 'FAQ', 'مساعدة'],
      openGraph: {
        title: 'الأسئلة الشائعة',
        description: 'الأسئلة الشائعة والإجابات',
        type: 'website',
        url: 'https://alhafiz-academy.com/faq',
      },
    },
    contact: {
      title: 'اتصل بنا | أكاديمية الحافظ المتميز',
      description: 'تواصل معنا عبر الاتصال المباشر أو النموذج. نحن هنا للإجابة على استفسارات',
      keywords: ['اتصل بنا', 'تواصل', 'استفسارات', 'دعم'],
      openGraph: {
        title: 'اتصل بنا',
        description: 'تواصل معنا لأي استفسارات',
        type: 'website',
        url: 'https://alhafiz-academy.com/contact',
      },
    },
    privacy: {
      title: 'سياسة الخصوصية | أكاديمية الحافظ المتميز',
      description: 'سياسة الخصوصية والبيانات الشخصية في أكاديمية الحافظ المتميز',
      robots: {
        index: true,
        follow: true,
      },
    },
    terms: {
      title: 'الشروط والأحكام | أكاديمية الحافظ المتميز',
      description: 'الشروط والأحكام العامة والخدمات في أكاديمية الحافظ المتميز',
      robots: {
        index: true,
        follow: true,
      },
    },
  }

  return metadataMap[page]
}
