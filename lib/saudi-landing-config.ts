export const SAUDI_WHATSAPP_NUMBER = "201130127894"

export type SaudiProgram = "quran" | "arabic"
export type SaudiDuration = 30 | 40 | 60
export type SaudiSessions = 4 | 8 | 12 | 16

export interface SaudiPlan {
  id: string
  program: SaudiProgram
  duration: SaudiDuration
  monthlySessions: SaudiSessions
  weeklySessions: 1 | 2 | 3 | 4
  price: number
  name: string
  description: string
  features: string[]
  popular?: boolean
  order: number
  visible: boolean
}

export const saudiLandingConfig = {
  visible: true,
  whatsappNumber: SAUDI_WHATSAPP_NUMBER,
  seo: {
    title: "تحفيظ القرآن واللغة العربية أونلاين في السعودية | جرب حصة مجانية",
    description: "أول حصة تجريبية مجانية لتحفيظ القرآن وتأسيس اللغة العربية للأطفال والكبار في الرياض وجدة ومكة والمدينة والدمام وبقية مدن السعودية، مع خصم خاص للأخوة عند التسجيل معاً وأسعار بالريال السعودي.",
    canonical: "https://quran-elhafez.com/saudi-arabia",
  },
  cities: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الأحساء"],
  whatsappTemplate: "السلام عليكم،\nأرغب في حجز أول حصة تجريبية مجانية.\n\nبيانات الطالب:\nالاسم:\nالعمر:\nولد أم بنت:\nقرآن أم تأسيس عربي:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالمدينة:\nالوقت المناسب للحصة التجريبية:",
  plans: [
    ...([30, 40, 60] as const).flatMap((duration) => ([
      [4, 1, duration === 30 ? 55 : duration === 40 ? 75 : 105],
      [8, 2, duration === 30 ? 105 : duration === 40 ? 140 : 195],
      [12, 3, duration === 30 ? 155 : duration === 40 ? 215 : 290],
      [16, 4, duration === 30 ? 205 : duration === 40 ? 280 : 355],
    ] as const).map(([monthlySessions, weeklySessions, price], index) => ({
      id: `quran-${duration}-${monthlySessions}`,
      program: "quran" as const,
      duration,
      monthlySessions,
      weeklySessions,
      price,
      name: `تحفيظ القرآن — ${duration} دقيقة — ${monthlySessions} حصص`,
      description: "حصة فردية أونلاين مع متابعة للحفظ والتجويد والمراجعة.",
      features: ["معلمون ومعلمات متخصصون", "حفظ وتجويد ومراجعة", "مرونة في اختيار الوقت"],
      popular: duration === 40 && monthlySessions === 8,
      order: duration * 100 + index,
      visible: true,
    }))),
    ...([30, 40, 60] as const).flatMap((duration) => ([
      [4, 1, duration === 30 ? 75 : duration === 40 ? 90 : 135],
      [8, 2, duration === 30 ? 135 : duration === 40 ? 170 : 255],
      [12, 3, duration === 30 ? 200 : duration === 40 ? 255 : 330],
      [16, 4, duration === 30 ? 270 : duration === 40 ? 330 : 410],
    ] as const).map(([monthlySessions, weeklySessions, price], index) => ({
      id: `arabic-${duration}-${monthlySessions}`,
      program: "arabic" as const,
      duration,
      monthlySessions,
      weeklySessions,
      price,
      name: `تأسيس العربية — ${duration} دقيقة — ${monthlySessions} حصص`,
      description: "تأسيس متدرج في القراءة والكتابة والتعبير أونلاين.",
      features: ["معلمون ومعلمات متخصصون", "قراءة وكتابة وإملاء", "متابعة تناسب مستوى الطالب"],
      popular: duration === 40 && monthlySessions === 8,
      order: 1000 + duration * 100 + index,
      visible: true,
    }))),
  ] satisfies SaudiPlan[],
} as const

export function getSaudiWhatsAppUrl(plan: string) {
  const message = saudiLandingConfig.whatsappTemplate.replace("{plan}", plan)
  return `https://wa.me/${saudiLandingConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
