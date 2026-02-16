"use client"

import { useI18n } from "@/lib/i18n"
import { Gamepad2, Trophy, Brain, Star } from "lucide-react"
import { useState } from "react"
import { LetterMatchGame } from "@/components/games/letter-match-game"
import { QuranQuizGame } from "@/components/games/quran-quiz-game"

export default function GamesPage() {
  const { t, locale } = useI18n()
  const [activeGame, setActiveGame] = useState<"none" | "letters" | "quiz">("none")

  const gameCards = [
    {
      id: "letters" as const,
      icon: Brain,
      title: { ar: "لعبة مطابقة الحروف", en: "Letter Matching Game", fr: "Jeu de correspondance des lettres" },
      desc: {
        ar: "اختبر معرفتك بالحروف العربية وأشكالها المختلفة في لعبة تفاعلية ممتعة",
        en: "Test your knowledge of Arabic letters and their forms in a fun interactive game",
        fr: "Testez vos connaissances des lettres arabes dans un jeu interactif",
      },
      color: "from-emerald-500 to-emerald-700",
      players: "2,400+",
    },
    {
      id: "quiz" as const,
      icon: Trophy,
      title: { ar: "مسابقة قرآنية", en: "Quran Quiz", fr: "Quiz coranique" },
      desc: {
        ar: "اختبر حفظك ومعلوماتك عن القرآن الكريم في مسابقة شيقة بها أسئلة متنوعة",
        en: "Test your Quran memorization and knowledge in an exciting quiz with various questions",
        fr: "Testez votre memorisation du Coran dans un quiz passionnant",
      },
      color: "from-amber-500 to-amber-700",
      players: "3,100+",
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-primary overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
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
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-foreground mb-3 text-balance">
                {locale === "ar" ? "اختر لعبتك" : locale === "en" ? "Choose Your Game" : "Choisissez votre jeu"}
              </h2>
              <p className="text-muted-foreground">
                {locale === "ar" ? "ألعاب تعليمية تفاعلية للأطفال والكبار" : locale === "en" ? "Interactive educational games for children and adults" : "Jeux educatifs interactifs pour enfants et adultes"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {gameCards.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className="group text-start bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className={`relative h-40 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                    <div className="absolute inset-0 islamic-pattern opacity-20" />
                    <game.icon className="relative w-16 h-16 text-white/90 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {game.title[locale]}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {game.desc[locale]}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Gamepad2 className="w-4 h-4" />
                        <span>{game.players} {locale === "ar" ? "لاعب" : "players"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 text-secondary fill-secondary" />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 py-2.5 bg-primary/10 text-primary rounded-xl text-center font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {t("common.play")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Active Game */}
      {activeGame !== "none" && (
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-4xl px-4">
            <button
              onClick={() => setActiveGame("none")}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {locale === "ar" ? "العودة لقائمة الألعاب" : locale === "en" ? "Back to Games" : "Retour aux jeux"}
            </button>

            {activeGame === "letters" && <LetterMatchGame />}
            {activeGame === "quiz" && <QuranQuizGame />}
          </div>
        </section>
      )}
    </>
  )
}
