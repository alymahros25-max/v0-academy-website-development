import { Metadata } from "next"
import { getSeoAlternates } from "@/lib/seo-metadata"

export const metadata: Metadata = {
  title: "الألعاب التعليمية | أكاديمية الحافظ المتميز",
  description: "20 لعبة تعليمية تفاعلية للأطفال تغطي الحروف العربية والتجويد والقرآن الكريم والسيرة النبوية",
  alternates: getSeoAlternates('https://quran-elhafez.com/games'),
  keywords: ["ألعاب تعليمية", "قرآن", "تجويد", "حروف عربية", "تعليم الأطفال", "ألعاب إسلامية"],
  openGraph: {
    title: "الألعاب التعليمية",
    description: "تعلم من خلال اللعب - 20 لعبة تفاعلية للأطفال",
    type: "website",
  },
}

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children
}
