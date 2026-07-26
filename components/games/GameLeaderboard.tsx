"use client"

import { useI18n } from "@/lib/i18n"
import { Trophy, Medal, Flame } from "lucide-react"
import { getTopScores, GameResult } from "@/lib/games-engine"
import { useEffect, useState } from "react"

interface GameLeaderboardProps {
  gameId: string
  limit?: number
}

export function GameLeaderboard({ gameId, limit = 10 }: GameLeaderboardProps) {
  const { locale } = useI18n()
  const [topScores, setTopScores] = useState<GameResult[]>([])

  useEffect(() => {
    const scores = getTopScores(gameId, limit)
    setTopScores(scores)
  }, [gameId, limit])

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-amber-500" />
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (position === 3) return <Medal className="w-5 h-5 text-amber-700" />
    return <Flame className="w-5 h-5 text-red-500" />
  }

  if (topScores.length === 0) {
    return (
      <div className="bg-muted rounded-xl p-8 text-center">
        <p className="text-muted-foreground">
          {locale === "ar" ? "لا توجد نتائج بعد" : "No scores yet"}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-900">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-center">
        <h3 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" />
          {locale === "ar" ? "لوحة الصدارة" : "Leaderboard"}
        </h3>
      </div>

      <div className="divide-y divide-amber-200 dark:divide-amber-900">
        {topScores.map((entry, index) => (
          <div
            key={index}
            className={`p-4 flex items-center gap-4 transition-all ${
              index < 3 ? "bg-white dark:bg-background/50 font-semibold" : "hover:bg-amber-100/30"
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-10 h-10">
              {getMedalIcon(index + 1)}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground truncate">
                {locale === "ar" ? "لاعب" : "Player"} #{index + 1}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(entry.completedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-lg font-extrabold text-primary">{entry.score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                {[...Array(entry.stars)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {topScores.length < 10 && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          {locale === "ar" ? `${topScores.length} لاعب فقط` : `Only ${topScores.length} scores`}
        </div>
      )}
    </div>
  )
}
