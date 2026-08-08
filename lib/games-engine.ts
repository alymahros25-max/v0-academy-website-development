// Gamification Engine - Core system for all 20 games
// Handles scoring, timing, badges, and leaderboard

export interface GameStats {
  totalPoints: number
  correctAnswers: number
  incorrectAnswers: number
  timeSpent: number
  combo: number
  stars: number
}

export interface Badge {
  id: string
  nameAr: string
  nameEn: string
  nameFr: string
  descAr: string
  descEn: string
  descFr: string
  icon: string
  condition: (stats: GameStats) => boolean
}

export interface GameResult {
  playerName?: string
  gameId: string
  score: number
  stars: number
  badges: Badge[]
  timeSpent: number
  completedAt: Date
  accuracy: number
}

export interface LeaderboardEntry {
  playerName: string
  score: number
  gameId: string
  date: Date
}

// Badge definitions (أوسمة التحبيش)
export const BADGES: Badge[] = [
  {
    id: "perfect_score",
    nameAr: "السيد الكامل",
    nameEn: "Perfect Score",
    nameFr: "Score Parfait",
    descAr: "احصل على درجة كاملة بدون أخطاء",
    descEn: "Get a perfect score with no errors",
    descFr: "Obtenez un score parfait sans erreurs",
    icon: "⭐",
    condition: (stats) => stats.incorrectAnswers === 0 && stats.correctAnswers >= 5,
  },
  {
    id: "speedy",
    nameAr: "الأسرع",
    nameEn: "Speedy",
    nameFr: "Rapide",
    descAr: "أكمل اللعبة في أقل من 30 ثانية",
    descEn: "Complete the game in less than 30 seconds",
    descFr: "Complétez le jeu en moins de 30 secondes",
    icon: "⚡",
    condition: (stats) => stats.timeSpent < 30,
  },
  {
    id: "combo_master",
    nameAr: "سيد التسلسل",
    nameEn: "Combo Master",
    nameFr: "Maître du Combo",
    descAr: "حقق 5 إجابات صحيحة متتالية",
    descEn: "Get 5 correct answers in a row",
    descFr: "Obtenez 5 réponses correctes d'affilée",
    icon: "🔥",
    condition: (stats) => stats.combo >= 5,
  },
  {
    id: "tajweed_master",
    nameAr: "بطل التجويد",
    nameEn: "Tajweed Master",
    nameFr: "Maître du Tajweed",
    descAr: "اجتز لعبة التجويد بنجاح",
    descEn: "Master Tajweed games",
    descFr: "Maîtrisez les jeux de Tajweed",
    icon: "📖",
    condition: (stats) => stats.stars >= 3 && stats.correctAnswers >= 8,
  },
  {
    id: "quran_warrior",
    nameAr: "فارس القرآن",
    nameEn: "Quran Warrior",
    nameFr: "Guerrier du Coran",
    descAr: "اجتز لعبة قرآنية بدرجة ممتازة",
    descEn: "Conquer Quran games excellently",
    descFr: "Conquérez les jeux coraniques",
    icon: "⚔️",
    condition: (stats) => stats.stars >= 3 && stats.totalPoints >= 1000,
  },
  {
    id: "letter_master",
    nameAr: "حافظ الحروف",
    nameEn: "Letter Guardian",
    nameFr: "Gardien des Lettres",
    descAr: "تمكن من لعبة الحروف العربية",
    descEn: "Master Arabic letter games",
    descFr: "Maîtrisez les jeux de lettres",
    icon: "🔤",
    condition: (stats) => stats.incorrectAnswers === 0 && stats.correctAnswers >= 5,
  },
  {
    id: "sirah_hero",
    nameAr: "بطل السيرة",
    nameEn: "Sirah Hero",
    nameFr: "Héros de la Sirah",
    descAr: "اتقن لعبات السيرة النبوية",
    descEn: "Master Prophet Biography games",
    descFr: "Maîtrisez les jeux de la Sirah",
    icon: "🏆",
    condition: (stats) => stats.stars >= 3,
  },
]

// Score calculation engine
export function calculateScore(
  correctAnswers: number,
  timeSpent: number,
  difficulty: "easy" | "medium" | "hard",
  combo: number
): number {
  const baseScore = correctAnswers * 100
  const timeBonus = Math.max(0, 60 - timeSpent) * 5 // Bonus for speed
  const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2
  const comboBonus = combo > 0 ? combo * 50 : 0

  return Math.floor((baseScore + timeBonus + comboBonus) * difficultyMultiplier)
}

// Stars calculation (1-3 stars based on accuracy)
export function calculateStars(accuracy: number): number {
  if (accuracy >= 90) return 3
  if (accuracy >= 70) return 2
  return 1
}

// Badge earning logic
export function earnBadges(stats: GameStats): Badge[] {
  return BADGES.filter((badge) => badge.condition(stats))
}

// Leaderboard management (localStorage for now)
export function saveGameResult(result: GameResult): void {
  const leaderboard = getLeaderboard()
  leaderboard.push(result)
  localStorage.setItem("game_results", JSON.stringify(leaderboard))
}

export function getLeaderboard(): GameResult[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("game_results")
  return data ? JSON.parse(data) : []
}

export function getTopScores(gameId: string, limit: number = 10): GameResult[] {
  return getLeaderboard()
    .filter((r) => r.gameId === gameId)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getPlayerStats(playerName: string): GameResult[] {
  return getLeaderboard().filter((r) => r.playerName === playerName)
}
