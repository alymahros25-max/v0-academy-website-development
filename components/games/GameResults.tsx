"use client"

import { useI18n } from "@/lib/i18n"
import { Star, Trophy, Award, RotateCcw } from "lucide-react"
import { BADGES } from "@/lib/games-engine"

interface GameResultsProps {
  score: number
  stars: number
  timeSpent: number
  correctAnswers: number
  totalQuestions: number
  accuracy: number
  earnedBadges: typeof BADGES
  onRestart: () => void
  onBack: () => void
}

export function GameResults({
  score,
  stars,
  timeSpent,
  correctAnswers,
  totalQuestions,
  accuracy,
  earnedBadges,
  onRestart,
  onBack,
}: GameResultsProps) {
  const { t, locale } = useI18n()

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with Stars */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-primary mb-4">
          {locale === "ar" ? "رائع!" : locale === "en" ? "Great!" : "Génial!"}
        </h2>
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-12 h-12 transition-all ${
                s <= stars
                  ? "fill-secondary text-secondary scale-110"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-primary">{score.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {locale === "ar" ? "النقاط" : locale === "en" ? "Points" : "Points"}
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-secondary">{accuracy.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {locale === "ar" ? "الدقة" : locale === "en" ? "Accuracy" : "Précision"}
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-emerald-600">{timeSpent}s</div>
            <div className="text-xs text-muted-foreground mt-1">
              {locale === "ar" ? "الوقت" : locale === "en" ? "Time" : "Temps"}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-4xl font-extrabold text-blue-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {locale === "ar" ? "الإجابات" : locale === "en" ? "Correct" : "Correct"}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {earnedBadges.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100">
              {locale === "ar" ? "الأوسمة المكتسبة" : locale === "en" ? "Badges Earned" : "Médailles gagnées"}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white dark:bg-background rounded-xl p-4 text-center border-2 border-amber-300"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-bold text-amber-900 dark:text-amber-100">
                  {locale === "ar" ? badge.nameAr : locale === "en" ? badge.nameEn : badge.nameFr}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {locale === "ar" ? badge.descAr : locale === "en" ? badge.descEn : badge.descFr}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          {locale === "ar" ? "إعادة" : locale === "en" ? "Retry" : "Réessayer"}
        </button>
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-xl font-bold text-primary border-2 border-primary hover:bg-primary/5 transition-colors"
        >
          {locale === "ar" ? "العودة" : locale === "en" ? "Back" : "Retour"}
        </button>
      </div>
    </div>
  )
}
