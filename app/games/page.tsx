"use client"

import { useI18n } from "@/lib/i18n"
import { Gamepad2, Trophy, Brain, Star, Filter, X, Volume2, VolumeX } from "lucide-react"
import { useState, useEffect } from "react"
import { audioSystem } from "@/lib/audio-system"
import { LetterMatchGame } from "@/components/games/letter-match-game"
import { QuranQuizGame } from "@/components/games/quran-quiz-game"
import { WordBuilderGame } from "@/components/games/word-builder-game"
import { TajweedRulesGame } from "@/components/games/tajweed-rules-game"
import { QuranOrderGame } from "@/components/games/quran-order-game"
import { CompanionsQuizGame } from "@/components/games/companions-quiz-game"
import { TajweedTanweenGame } from "@/components/games/tajweed-tanween-game"
import { MemorizationCardsGame } from "@/components/games/memorization-cards-game"
import { ShapesMatchingGame } from "@/components/games/shapes-matching-game"
import { ColorsQuizGame } from "@/components/games/colors-quiz-game"
import { AnimalsMatchingGame } from "@/components/games/animals-matching-game"
import { QuranAnimalsGame } from "@/components/games/quran-animals-game"
import { BattlesTimelineGame } from "@/components/games/battles-timeline-game"
import { SiraEventsGame } from "@/components/games/sira-events-game"
import { CompanionsTimelineGame } from "@/components/games/companions-timeline-game"
import { CompanionsDedsGame } from "@/components/games/companions-deeds-game"
import { LetterSoundGame } from "@/components/games/letter-sound-game"
import { WordMeaningGame } from "@/components/games/word-meaning-game"
import { VerseGuessingGame } from "@/components/games/verse-guessing-game"
import { TajweedLamGame } from "@/components/games/tajweed-lam-game"
import { WordCompleteGame } from "@/components/games/word-complete-game"
import { CompanionsPeriodsGame } from "@/components/games/companions-periods-game"
import { CompanionsMartyrGame } from "@/components/games/companions-martyrs-game"
import { SurahGuessGame } from "@/components/games/surah-guess-game"
import { CompanionsCardsGame } from "@/components/games/companions-cards-game"
import { VerseMatchingGame } from "@/components/games/verse-matching-game"
import { BattlesDescriptionGame } from "@/components/games/battles-description-game"
import { GAMES_CATALOG, getCategories, getCategoryName, type Game } from "@/lib/games-data"

export default function GamesPage() {
  const { t, locale } = useI18n()
  const [activeGame, setActiveGame] = useState<string | "none">("none")
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all")
  const [isMuted, setIsMuted] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Scroll restoration on mount and when returning from game
  useEffect(() => {
    window.scrollTo(0, 0)
    setMounted(true)
  }, [])

  // Reset scroll when exiting a game
  useEffect(() => {
    if (activeGame === "none" && mounted) {
      window.scrollTo(0, 0)
    }
  }, [activeGame, mounted])

  // Initialize audio state
  useEffect(() => {
    setIsMuted(audioSystem.isMuted())
  }, [])

  const toggleAudio = () => {
    const newState = !isMuted
    setIsMuted(newState)
    audioSystem.setMuted(newState)
    if (!newState) {
      audioSystem.playClick()
    }
  }
  
  const categories = getCategories()
  const filteredGames = selectedCategory === "all" 
    ? GAMES_CATALOG 
    : GAMES_CATALOG.filter(g => g.category === selectedCategory)
  
  const renderGame = (gameId: string) => {
    const games: Record<string, React.ReactNode> = {
      "letter-match-1": <LetterMatchGame />,
      "word-builder-1": <WordBuilderGame />,
      "word-complete-1": <WordCompleteGame />,
      "quran-quiz-1": <QuranQuizGame />,
      "quran-order-1": <QuranOrderGame />,
      "surah-guess-1": <SurahGuessGame />,
      "tajweed-rules-1": <TajweedRulesGame />,
      "tajweed-rules-2": <TajweedTanweenGame />,
      "tajweed-rules-3": <TajweedLamGame />,
      "companions-quiz-1": <CompanionsQuizGame />,
      "companions-periods-1": <CompanionsPeriodsGame />,
      "companions-martyrs-1": <CompanionsMartyrGame />,
      "memorization-cards-1": <MemorizationCardsGame />,
      "shapes-colors-1": <ShapesMatchingGame />,
      "shapes-colors-2": <ColorsQuizGame />,
      "animals-quran-1": <AnimalsMatchingGame />,
      "animals-quran-2": <QuranAnimalsGame />,
      "battles-sira-1": <BattlesTimelineGame />,
      "battles-sira-2": <SiraEventsGame />,
      "battles-sirah-1": <BattlesTimelineGame />,
      "battles-sirah-2": <BattlesDescriptionGame />,
      "sirah-timeline-1": <SiraEventsGame />,
      "battles-sira-3": <CompanionsTimelineGame />,
      "companions-deeds-1": <CompanionsDedsGame />,
      "companions-cards-1": <CompanionsCardsGame />,
      "letter-sound-1": <LetterSoundGame />,
      "word-meaning-1": <WordMeaningGame />,
      "quran-memory-1": <VerseGuessingGame />,
      "verse-match-1": <VerseMatchingGame />,
    }
    return games[gameId] || (
      <div className="text-center py-20">
        <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">{locale === "ar" ? "قريباً - هذه اللعبة قيد الإنشاء" : "Coming Soon"}</p>
      </div>
    )
  }

  // Map icon emojis
  const getIconComponent = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      "🔤": <span className="text-5xl">🔤</span>,
      "✍️": <span className="text-5xl">✍️</span>,
      "💭": <span className="text-5xl">💭</span>,
      "📖": <span className="text-5xl">📖</span>,
      "🎵": <span className="text-5xl">🎵</span>,
      "⚡": <span className="text-5xl">⚡</span>,
      "📜": <span className="text-5xl">📜</span>,
      "🤔": <span className="text-5xl">🤔</span>,
      "✨": <span className="text-5xl">✨</span>,
      "🔷": <span className="text-5xl">🔷</span>,
      "🎨": <span className="text-5xl">🎨</span>,
      "🐪": <span className="text-5xl">🐪</span>,
      "🦁": <span className="text-5xl">🦁</span>,
      "⚔️": <span className="text-5xl">⚔️</span>,
      "⏳": <span className="text-5xl">⏳</span>,
      "👥": <span className="text-5xl">👥</span>,
      "❓": <span className="text-5xl">❓</span>,
      "📅": <span className="text-5xl">📅</span>,
      "🕊️": <span className="text-5xl">🕊️</span>,
    }
    return icons[icon] || <Brain className="w-16 h-16" />
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleAudio}
            className="p-3 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground transition-all"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-bold mb-4 border border-secondary/30">
            {t("nav.games")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6 text-balance">
            {t("games.title")}
          </h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto text-pretty">
            {t("games.desc")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L720 40L1440 80V80H0V80Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Game Selection */}
      {activeGame === "none" && (
        <section className="py-20 bg-background">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-foreground mb-3 text-balance">
                {locale === "ar" ? "اختر لعبتك" : locale === "en" ? "Choose Your Game" : "Choisissez votre jeu"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {locale === "ar" ? "20 لعبة تعليمية تفاعلية للأطفال" : locale === "en" ? "20 Interactive educational games for kids" : "20 jeux éducatifs interactifs"}
              </p>
              
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                  }`}
                >
                  {locale === "ar" ? "الكل" : "All"}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                    }`}
                  >
                    {getCategoryName(cat, locale)}
                  </button>
                ))}
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    audioSystem.playClick()
                    setActiveGame(game.id)
                  }}
                  className="group text-start bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 active:scale-95"
                >
                  {/* Card Header */}
                  <div className={`relative h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                    <div className="absolute inset-0 islamic-pattern opacity-20" />
                    <div className="relative group-hover:scale-110 transition-transform">
                      {getIconComponent(game.icon)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {locale === "ar" ? game.titleAr : locale === "en" ? game.titleEn : game.titleFr}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {locale === "ar" ? game.descriptionAr : locale === "en" ? game.descriptionEn : game.descriptionFr}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{game.playersCount}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star key={s} className="w-3 h-3 text-secondary fill-secondary" />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 py-2 bg-primary/10 text-primary rounded-lg text-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {t("common.play")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {locale === "ar" ? "لا توجد ألعاب في هذه الفئة" : "No games in this category"}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Active Game */}
      {activeGame !== "none" && (
        <section className="py-12 bg-background min-h-screen">
          <div className="mx-auto max-w-4xl px-4">
            <button
              onClick={() => setActiveGame("none")}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {locale === "ar" ? "العودة لقائمة الألعاب" : locale === "en" ? "Back to Games" : "Retour aux jeux"}
            </button>

            {renderGame(activeGame)}
          </div>
        </section>
      )}
    </>
  )
}
