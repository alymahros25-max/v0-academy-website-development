export const UNITED_STATES_WHATSAPP_NUMBER = "201130127894"

export type UnitedStatesDuration = 30 | 40 | 60
export type UnitedStatesSessions = 4 | 8 | 12 | 16

export interface UnitedStatesPlan {
  id: string
  duration: UnitedStatesDuration
  monthlySessions: UnitedStatesSessions
  weeklySessions: 1 | 2 | 3 | 4
  price: number
  name: string
  description: string
  features: string[]
  popular?: boolean
  visible: boolean
}

const prices = { 30: [15, 28, 42, 55], 40: [20, 38, 58, 75], 60: [28, 52, 78, 95] } as const
const sessions = [4, 8, 12, 16] as const

export const unitedStatesLandingConfig = {
  seo: {
    title: "تحفيظ القرآن أونلاين للعرب في أمريكا | Quran Classes in the USA",
    description: "تعلم وتحفيظ القرآن الكريم أونلاين للعائلات العربية في الولايات المتحدة، حصص فردية للأطفال والشباب والنساء والرجال، حصة تجريبية مجانية وخصم للإخوة ومواعيد تناسب توقيت أمريكا.",
    canonical: "https://quran-elhafez.com/united-states",
  },
  whatsappNumber: UNITED_STATES_WHATSAPP_NUMBER,
  whatsappTemplate: "السلام عليكم، أرغب في حجز باقة تحفيظ القرآن للناطقين بالعربية في الولايات المتحدة.\nالباقة المطلوبة: {plan}\nمدة الحصة: {duration} دقيقة\nعدد الحصص شهرياً: {sessions}\nالاسم:\nالعمر:\nولد أم بنت / رجل أم امرأة:\nمستوى الطالب الحالي:\nالولاية والمدينة:\nالتوقيت المناسب للحصة حسب توقيت أمريكا:\nالوقت المناسب للحصة التجريبية المجانية:\nهل يوجد إخوة يرغبون في الاشتراك للاستفادة من خصم الإخوة؟\nشكراً لكم.",
  cities: ["نيويورك", "نيوجيرسي", "واشنطن العاصمة", "فيلادلفيا", "بوسطن", "ديترويت", "شيكاغو", "هيوستن", "دالاس", "أورلاندو", "أتلانتا", "لوس أنجلوس", "سان فرانسيسكو", "فلوريدا"],
  plans: ([30, 40, 60] as const).flatMap((duration) => prices[duration].map((price, index) => ({
    id: `usa-${duration}-${sessions[index]}`,
    duration,
    monthlySessions: sessions[index],
    weeklySessions: ([1, 2, 3, 4] as const)[index],
    price,
    name: `تحفيظ القرآن — ${duration} دقيقة — ${sessions[index]} حصص`,
    description: duration === 30 ? "إيقاع مرن يناسب بداية رحلة الحفظ." : duration === 40 ? "وقت أوسع للتسميع والتصحيح والمراجعة." : "جلسة متكاملة للحفظ الجديد والمراجعة.",
    features: ["حصة فردية مباشرة", "معلمون ومعلمات", "موعد يناسب توقيت أمريكا"],
    popular: duration === 40 && sessions[index] === 8,
    visible: true,
  }))) satisfies UnitedStatesPlan[],
} as const

export function getUnitedStatesWhatsAppUrl(plan: UnitedStatesPlan) {
  const message = unitedStatesLandingConfig.whatsappTemplate.replace("{plan}", plan.name).replace("{duration}", String(plan.duration)).replace("{sessions}", String(plan.monthlySessions))
  return `https://wa.me/${unitedStatesLandingConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function getUnitedStatesTrialUrl() {
  return `https://wa.me/${unitedStatesLandingConfig.whatsappNumber}?text=${encodeURIComponent("السلام عليكم، أرغب في حجز الحصة التجريبية المجانية لتحفيظ القرآن للناطقين بالعربية في الولايات المتحدة.\nالاسم:\nالعمر:\nالولاية والمدينة:\nالتوقيت المناسب:")}`
}
