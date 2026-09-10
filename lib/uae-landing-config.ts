export const UAE_WHATSAPP_NUMBER = "201130127894"

export type UaeProgram = "quran" | "arabic"
export type UaeDuration = 30
export type UaeSessions = 4 | 8 | 12 | 16

export interface UaePlan {
  id: string
  program: UaeProgram
  duration: UaeDuration
  monthlySessions: UaeSessions
  weeklySessions: 1 | 2 | 3 | 4
  price: number
  name: string
  description: string
  features: string[]
  popular?: boolean
  order: number
  visible: boolean
}

export const uaeLandingConfig = {
  visible: true,
  whatsappNumber: UAE_WHATSAPP_NUMBER,
  seo: {
    title: "تحفيظ القرآن وتأسيس اللغة العربية أونلاين في الإمارات | أكاديمية الحافظ المتميز",
    description: "أول حصة تجريبية مجانية لتحفيظ القرآن وتأسيس اللغة العربية للأطفال والكبار في دبي وأبوظبي والشارقة وجميع مدن الإمارات، مع خصم خاص للأخوة عند التسجيل معاً وأسعار بالدرهم الإماراتي.",
    canonical: "https://quran-elhafez.com/united-arab-emirates",
  },
  cities: ["دبي", "أبوظبي", "الشارقة", "عجمان", "العين", "رأس الخيمة", "الفجيرة", "أم القيوين"],
  whatsappTemplate: "السلام عليكم،\nأرغب في حجز أول حصة تجريبية مجانية.\n\nبيانات الطالب:\nالاسم:\nالعمر:\nولد أم بنت:\nقرآن أم تأسيس عربي:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالمدينة:\nالوقت المناسب للحصة التجريبية:",
  plans: [
    ...([30] as const).flatMap((duration) => ([
      [4, 1, 55],
      [8, 2, 105],
      [12, 3, 155],
      [16, 4, 205],
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
      popular: monthlySessions === 8,
      order: duration * 100 + index,
      visible: true,
    }))),
    ...([30] as const).flatMap((duration) => ([
      [4, 1, 75],
      [8, 2, 135],
      [12, 3, 200],
      [16, 4, 270],
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
      popular: monthlySessions === 8,
      order: 1000 + duration * 100 + index,
      visible: true,
    }))),
  ] satisfies UaePlan[],
} as const

export function getUaeWhatsAppUrl(plan: string) {
  const message = uaeLandingConfig.whatsappTemplate.replace("{plan}", plan)
  return `https://wa.me/${uaeLandingConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}
