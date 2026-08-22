export const CANADA_WHATSAPP_NUMBER = "201130127894"

export type CanadaProgram = "quran" | "arabic"
export type CanadaDuration = 30 | 40 | 60
export type CanadaPlan = { id: string; program: CanadaProgram; duration: CanadaDuration; monthlySessions: 4 | 8 | 12 | 16; weeklySessions: 1 | 2 | 3 | 4; price: number; name: string; description: string; features: string[]; popular?: boolean }

const schedule = [[4, 1], [8, 2], [12, 3], [16, 4]] as const
const prices = {
  quran: { 30: [20, 40, 60, 75], 40: [25, 50, 80, 100], 60: [40, 70, 105, 130] },
  arabic: { 30: [30, 50, 75, 100], 40: [35, 65, 95, 120], 60: [50, 95, 120, 150] },
} as const

function makePlans(program: CanadaProgram) {
  return ([30, 40, 60] as const).flatMap((duration) => schedule.map(([monthlySessions, weeklySessions], index) => ({
    id: `${program}-${duration}-${monthlySessions}`, program, duration, monthlySessions, weeklySessions,
    price: prices[program][duration][index],
    name: `${program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية"} — ${duration} دقيقة — ${monthlySessions} حصص شهرياً`,
    description: program === "quran" ? "حصة فردية للحفظ والتسميع والتجويد والمراجعة." : "حصة فردية لتأسيس القراءة والكتابة والنطق والفهم بالعربية.",
    features: program === "quran" ? ["معلمون ومعلمات", "خطة حفظ ومراجعة", "موعد مرن داخل كندا"] : ["معلمون ومعلمات", "قراءة وكتابة ونطق", "متابعة تناسب المستوى"],
    popular: duration === 40 && monthlySessions === 8,
  })))
}

export const canadaLandingConfig = {
  whatsappNumber: CANADA_WHATSAPP_NUMBER,
  seo: {
    title: "تحفيظ القرآن وتأسيس العربية أونلاين في كندا | Quran Classes Canada",
    description: "حصص فردية أونلاين لتحفيظ القرآن وتأسيس اللغة العربية للناطقين بالعربية في كندا، مع حصة تجريبية مجانية ومواعيد مرنة.",
    canonical: "https://quran-elhafez.com/canada",
  },
  cities: ["أونتاريو", "كيبيك", "تورونتو", "ميسيساغا", "برامبتون", "أوتاوا", "مونتريال", "فانكوفر", "كالغاري", "إدمونتون", "وينيبيغ", "هاملتون"],
  plans: [...makePlans("quran"), ...makePlans("arabic")] satisfies CanadaPlan[],
} as const

export function getCanadaWhatsAppUrl(plan: CanadaPlan | string) {
  const isPlan = typeof plan !== "string"
  const program = isPlan ? (plan.program === "quran" ? "تحفيظ القرآن" : "تأسيس اللغة العربية") : "تحفيظ القرآن أو تأسيس اللغة العربية"
  const message = isPlan
    ? `السلام عليكم،\nأرغب في الاشتراك في باقة ${program} للناطقين بالعربية في كندا.\n\nالباقة المطلوبة: ${plan.name}\nنوع البرنامج: ${program}\nمدة الحصة: ${plan.duration} دقيقة\nعدد الحصص شهرياً: ${plan.monthlySessions}\nعدد المرات أسبوعياً: ${plan.weeklySessions}\nالسعر الشهري: CA$${plan.price}\n\nبيانات الطالب:\nالاسم:\nالعمر:\nولد أم بنت:\nقرآن أم تأسيس عربي:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالمدينة والمقاطعة داخل كندا:\nالوقت المناسب للحصة:`
    : `السلام عليكم،\nأرغب في حجز أول حصة تجريبية مجانية في ${program} للناطقين بالعربية في كندا.\n\nبيانات الطالب:\nالاسم:\nالعمر:\nولد أم بنت:\nقرآن أم تأسيس عربي:\nالمستوى الحالي أو كمية الحفظ:\nمعلم أم معلمة:\nالوقت المناسب للحصة التجريبية:`
  return `https://wa.me/${CANADA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
interface CanadaConfigCheck { readonly __brand?: "canada" }
void (undefined as CanadaConfigCheck | undefined)

export type { CanadaConfigCheck }

export const canadaPlans = canadaLandingConfig.plans
