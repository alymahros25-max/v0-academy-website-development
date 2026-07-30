'use client'

import { Star } from 'lucide-react'
import { Game } from '@/lib/games-data'

interface GameCardProps {
  game: Game
  locale: string
  onClick: () => void
}

const getIconComponent = (icon: string) => {
  return <span className="text-5xl">{icon}</span>
}

// Mini preview renderers for each game type
const getGamePreview = (gameId: string) => {
  const previewStyle = "w-full h-24 bg-gradient-to-b flex items-center justify-center text-xs font-bold text-center overflow-hidden relative"
  
  const previews: Record<string, React.ReactNode> = {
    "letter-match-1": (
      <div className={`${previewStyle} from-blue-100 to-blue-50`}>
        <div className="grid grid-cols-3 gap-1 p-2"><div className="bg-blue-500 text-white rounded">ا</div><div className="bg-blue-500 text-white rounded">ب</div><div className="bg-blue-500 text-white rounded">ج</div></div>
      </div>
    ),
    "word-builder-1": (
      <div className={`${previewStyle} from-yellow-100 to-yellow-50`}>
        <div className="space-y-1 text-center"><div className="text-2xl">ح ـ ـ ـ</div><div className="text-xs text-muted-foreground">ترتيب الحروف</div></div>
      </div>
    ),
    "quran-quiz-1": (
      <div className={`${previewStyle} from-green-100 to-green-50`}>
        <div className="space-y-1"><div className="text-xl font-quran">بسم الله</div><div className="text-xs">أسئلة قرآنية</div></div>
      </div>
    ),
    "tajweed-rules-1": (
      <div className={`${previewStyle} from-amber-100 to-amber-50`}>
        <div className="space-y-1"><div className="text-lg">ـــــن</div><div className="text-xs">أحكام التنوين</div></div>
      </div>
    ),
    "shapes-colors-1": (
      <div className={`${previewStyle} from-pink-100 to-pink-50`}>
        <div className="flex gap-2 justify-center items-center"><div className="w-6 h-6 rounded-full bg-red-500"></div><div className="w-6 h-6 rounded-full bg-blue-500"></div><div className="w-6 h-6 rounded-full bg-yellow-500"></div></div>
      </div>
    ),
    "animals-quran-1": (
      <div className={`${previewStyle} from-emerald-100 to-emerald-50`}>
        <div className="text-4xl">🦁 🦅 🐺</div>
      </div>
    ),
    "battles-sira-1": (
      <div className={`${previewStyle} from-orange-100 to-orange-50`}>
        <div className="space-y-1"><div className="text-sm font-bold">بدر - أحد</div><div className="text-xs">غزوات إسلامية</div></div>
      </div>
    ),
    "companions-quiz-1": (
      <div className={`${previewStyle} from-purple-100 to-purple-50`}>
        <div className="space-y-1"><div className="text-sm">👤 أبو بكر</div><div className="text-xs">من الصحابة؟</div></div>
      </div>
    ),
  }
  
  return previews[gameId] || (
    <div className={`${previewStyle} from-slate-100 to-slate-50`}>
      <div className="text-xs">معاينة اللعبة</div>
    </div>
  )
}

export function GameCard({ game, locale, onClick }: GameCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-start bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 active:scale-95"
    >
      {/* Mini Preview Thumbnail */}
      <div className="relative h-24 bg-muted/50 overflow-hidden border-b border-border/50">
        {getGamePreview(game.id)}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Card Header with Gradient */}
      <div className={`relative h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative group-hover:scale-110 transition-transform">
          {getIconComponent(game.icon)}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {locale === 'ar' ? game.titleAr : locale === 'en' ? game.titleEn : game.titleFr}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {locale === 'ar' ? game.descriptionAr : locale === 'en' ? game.descriptionEn : game.descriptionFr}
        </p>
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-muted-foreground">{game.playersCount}</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((s) => (
              <Star key={s} className="w-3 h-3 text-secondary fill-secondary" />
            ))}
          </div>
        </div>
        <div className="py-2 bg-primary/10 text-primary rounded-lg text-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          ابدأ اللعبة
        </div>
      </div>
    </button>
  )
}
