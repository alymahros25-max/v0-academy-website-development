export const UNITED_KINGDOM_WHATSAPP_NUMBER = "201130127894"

export type UnitedKingdomProgram = "quran" | "arabic"
export type UnitedKingdomDuration = 30 | 40 | 60
export type UnitedKingdomPlan = { id: string; program: UnitedKingdomProgram; duration: UnitedKingdomDuration; monthlySessions: 4 | 8 | 12 | 16; weeklySessions: 1 | 2 | 3 | 4; price: number; name: string; description: string; features: string[]; popular?: boolean }

const schedule = [[4, 1], [8, 2], [12, 3], [16, 4]] as const
const prices = {
  quran: { 30: [12, 22, 34, 44], 40: [16, 30, 46, 60], 60: [22, 42, 62, 76] },
  arabic: { 30: [16, 29, 43, 58], 40: [20, 37, 54, 70], 60: [29, 54, 70, 88] },
} as const

function makePlans(program: UnitedKingdomProgram) {
  return ([30, 40, 60] as const).flatMap((duration) => schedule.map(([monthlySessions, weeklySessions], index) => ({
    id: `${program}-${duration}-${monthlySessions}`, program, duration, monthlySessions, weeklySessions,
    price: prices[program][duration][index],
    name: `${program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"} — ${duration} دقيقة — ${monthlySessions} حصص شهرياً`,
    description: program === "quran" ? "حصة فردية للحفظ والتسميع والتجويد وتصحيح التلاوة والمراجعة." : "حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.",
    features: program === "quran" ? ["معلمون ومعلمات", "خطة حفظ ومراجعة", "موعد يناسب المملكة المتحدة"] : ["معلمون ومعلمات", "قراءة وكتابة ونطق", "متابعة تناسب المستوى"],
    popular: duration === 40 && monthlySessions === 8,
  })))
}

export const unitedKingdomLandingConfig = {
  whatsappNumber: UNITED_KINGDOM_WHATSAPP_NUMBER,
  seo: {
    title: "تحفيظ القرآن وتأسيس اللغة العربية أونلاين للعرب في المملكة المتحدة | حصة مجانية",
    description: "حصص فردية أونلاين لتحفيظ القرآن وتأسيس اللغة العربية للأطفال والشباب والبالغين من الناطقين بالعربية في لندن وبرمنغهام ومانشستر وباقي مدن المملكة المتحدة، مع أول حصة تجريبية مجانية ومواعيد مرنة وخصم خاص للأخوة.",
    canonical: "https://quran-elhafez.com/united-kingdom",
  },
  cities: ["لندن", "برمنغهام", "مانشستر", "ليدز", "غلاسكو", "إدنبرة", "ليستر", "برادفورد", "شيفيلد", "ليفربول", "كارديف"],
  plans: [...makePlans("quran"), ...makePlans("arabic")] satisfies UnitedKingdomPlan[],
} as const

export function getUnitedKingdomWhatsAppUrl(plan: UnitedKingdomPlan | string) {
  const isPlan = typeof plan !== "string"
  const program = isPlan ? (plan.program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية") : "تحفيظ القرآن أو تأسيس اللغة العربية"
  const message = isPlan
    ? `السلام عليكم،\nأرغب في الاشتراك في باقة ${program} — ${plan.duration} دقيقة — ${plan.monthlySessions} حصص شهرياً — بقيمة £${plan.price} بالجنيه الإسترليني في المملكة المتحدة.\n\nبيانات الطالب:\nالاسم:\nالعمر:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالمدينة داخل المملكة المتحدة:\nالوقت المناسب للحصة التجريبية:\nهل يوجد إخوة آخرون للاستفادة من خصم الأخوة؟`
    : `السلام عليكم،\nأرغب في حجز أول حصة تجريبية مجانية في تحفيظ القرآن أو تأسيس اللغة العربية للناطقين بالعربية في المملكة المتحدة.\n\nبيانات الطالب:\nالاسم:\nالعمر:\nولد أم بنت:\nقرآن أم تأسيس عربي:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالمدينة داخل المملكة المتحدة:\nالوقت المناسب للحصة التجريبية:`
  return `https://wa.me/${UNITED_KINGDOM_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const unitedKingdomPlans = unitedKingdomLandingConfig.plans
