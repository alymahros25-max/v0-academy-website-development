export const UNITED_STATES_WHATSAPP_NUMBER = "201130127894"

export type UnitedStatesProgram = "quran" | "arabic"
export type UnitedStatesDuration = 30 | 40 | 60
export type UnitedStatesSessions = 4 | 8 | 12 | 16

export interface UnitedStatesPlan {
  id: string
  program: UnitedStatesProgram
  duration: UnitedStatesDuration
  monthlySessions: UnitedStatesSessions
  weeklySessions: 1 | 2 | 3 | 4
  price: number
  name: string
  description: string
  features: string[]
  popular?: boolean
}

const schedule = [[4, 1], [8, 2], [12, 3], [16, 4]] as const
const quranPrices = { 30: [15, 28, 42, 55], 40: [20, 38, 58, 75], 60: [28, 52, 78, 95] } as const
const arabicPrices = { 30: [20, 36, 54, 72], 40: [25, 46, 68, 88], 60: [36, 68, 88, 110] } as const

function makePlans(program: UnitedStatesProgram, prices: Record<UnitedStatesDuration, readonly number[]>) {
  return ([30, 40, 60] as const).flatMap((duration) => schedule.map(([monthlySessions, weeklySessions], index) => ({
    id: `${program}-${duration}-${monthlySessions}`,
    program, duration, monthlySessions, weeklySessions, price: prices[duration][index],
    name: `${program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"} — ${duration} دقيقة — ${monthlySessions} حصص شهرياً`,
    description: program === "quran" ? "حصة فردية مباشرة للحفظ والتسميع والتجويد والمراجعة." : "حصة فردية مباشرة لتأسيس القراءة والكتابة والنطق والفهم باللغة العربية.",
    features: program === "quran" ? ["معلمون ومعلمات", "خطة حفظ ومراجعة", "موعد مرن بتوقيت أمريكا"] : ["معلمون ومعلمات", "قراءة وكتابة ونطق", "متابعة تناسب مستوى الطالب"],
    popular: duration === 40 && monthlySessions === 8,
  })))
}

export const unitedStatesLandingConfig = {
  whatsappNumber: UNITED_STATES_WHATSAPP_NUMBER,
  seo: {
    title: "تحفيظ القرآن وتعليم العربية أونلاين للعرب في أمريكا | Quran Classes in the USA",
    description: "حصص فردية أونلاين لتحفيظ القرآن وتأسيس اللغة العربية للعائلات العربية في الولايات المتحدة، مع حصة تجريبية مجانية ومواعيد مرنة.",
    canonical: "https://quran-elhafez.com/united-states",
  },
  cities: ["نيويورك", "نيوجيرسي", "واشنطن", "فيلادلفيا", "بوسطن", "ديترويت", "شيكاغو", "هيوستن", "دالاس", "أورلاندو", "أتلانتا", "لوس أنجلوس", "سان فرانسيسكو", "فلوريدا"],
  plans: [...makePlans("quran", quranPrices), ...makePlans("arabic", arabicPrices)] satisfies UnitedStatesPlan[],
} as const

export function getUnitedStatesWhatsAppUrl(plan: UnitedStatesPlan | string) {
  const value = typeof plan === "string" ? plan : `${plan.name}\nالسعر: $${plan.price}\nمدة الحصة: ${plan.duration} دقيقة\nعدد الحصص شهرياً: ${plan.monthlySessions}`
  const message = `السلام عليكم، أرغب في حجز باقة ${typeof plan === "string" ? value : plan.program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"} للناطقين بالعربية في الولايات المتحدة.\n\nالباقة المطلوبة: ${value}\nالاسم:\nالعمر:\nولد أم بنت:\nمستوى الطالب الحالي:\nمعلم أم معلمة:\nالولاية والمدينة داخل أمريكا:\nالتوقيت المناسب للحصة حسب توقيت الولايات المتحدة:\nالوقت المناسب للحصة التجريبية المجانية:\nهل يوجد إخوة للاستفادة من خصم الإخوة؟\n\nشكراً لكم.`
  return `https://wa.me/${UNITED_STATES_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
