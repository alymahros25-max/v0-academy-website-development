export const AUSTRALIA_WHATSAPP_NUMBER = "201130127894"
export type AustraliaProgram = "quran" | "arabic"
export type AustraliaDuration = 30 | 40 | 60
export type AustraliaPlan = { id: string; program: AustraliaProgram; duration: AustraliaDuration; monthlySessions: 4 | 8 | 12 | 16; weeklySessions: 1 | 2 | 3 | 4; price: number; name: string; description: string; features: string[]; popular?: boolean }

const schedule = [[4, 1], [8, 2], [12, 3], [16, 4]] as const
const prices = { quran: { 30: [25, 45, 65, 85], 40: [30, 60, 90, 115], 60: [45, 80, 120, 145] }, arabic: { 30: [30, 55, 85, 110], 40: [40, 70, 105, 135], 60: [55, 105, 135, 170] } } as const

function makePlans(program: AustraliaProgram) {
  return ([30, 40, 60] as const).flatMap((duration) => schedule.map(([monthlySessions, weeklySessions], index) => ({
    id: `${program}-${duration}-${monthlySessions}`, program, duration, monthlySessions, weeklySessions,
    price: prices[program][duration][index],
    name: `${program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"} — ${duration} دقيقة — ${monthlySessions} حصص شهرياً`,
    description: program === "quran" ? "حصة فردية للحفظ والتسميع وتصحيح التلاوة والمراجعة." : "حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.",
    features: program === "quran" ? ["معلمون ومعلمات", "خطة حفظ ومراجعة", "موعد يناسب أستراليا"] : ["معلمون ومعلمات", "قراءة وكتابة ونطق", "متابعة تناسب المستوى"],
    popular: duration === 40 && monthlySessions === 8,
  })))
}

export const australiaLandingConfig = {
  whatsappNumber: AUSTRALIA_WHATSAPP_NUMBER,
  seo: {
    title: "تحفيظ القرآن وتأسيس اللغة العربية أونلاين للعرب في أستراليا | حصة مجانية",
    description: "حصص فردية أونلاين لتحفيظ القرآن وتأسيس اللغة العربية للأطفال والشباب والبالغين من الناطقين بالعربية في سيدني وملبورن وبريزبن وباقي مدن أستراليا، مع أول حصة تجريبية مجانية ومواعيد مرنة وخصم خاص للأخوة.",
    canonical: "https://quran-elhafez.com/australia",
  },
  cities: ["سيدني", "ملبورن", "بريزبن", "بيرث", "أديلايد", "كانبيرا", "غولد كوست", "نيوكاسل", "باراماتا"],
  plans: [...makePlans("quran"), ...makePlans("arabic")] satisfies AustraliaPlan[],
} as const

export function getAustraliaWhatsAppUrl(plan: AustraliaPlan | string) {
  const isPlan = typeof plan !== "string"
  const program = isPlan ? (plan.program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية") : "تحفيظ القرآن أو تأسيس اللغة العربية"
  const message = isPlan
    ? `السلام عليكم،\nأرغب في الاشتراك في باقة ${program} — ${plan.duration} دقيقة — ${plan.monthlySessions} حصص شهرياً — بقيمة AU$${plan.price} بالدولار الأسترالي في أستراليا.\n\nبيانات الطالب:\nالاسم:\nالعمر:\nولد أم بنت:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالمدينة داخل أستراليا:\nالوقت المناسب للحصة التجريبية:\nهل يوجد إخوة آخرون للاستفادة من خصم الأخوة؟`
    : `السلام عليكم،\nأرغب في حجز أول حصة تجريبية مجانية في تحفيظ القرآن أو تأسيس اللغة العربية للناطقين بالعربية في أستراليا.\n\nبيانات الطالب:\nالاسم:\nالعمر:\nولد أم بنت:\nقرآن أم تأسيس عربي:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالمدينة داخل أستراليا:\nالوقت المناسب للحصة التجريبية:`
  return `https://wa.me/${AUSTRALIA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
export const australiaPlans = australiaLandingConfig.plans
