"use client"

import { useState, useEffect, useCallback } from "react"
import { useI18n } from "@/lib/i18n"
import { RotateCcw, Trophy, Clock, Sparkles } from "lucide-react"

interface Card {
  id: number
  letter: string
  form: string
  isFlipped: boolean
  isMatched: boolean
}

const letterPairs = [
  { letter: "ب", forms: ["بـ", "ـبـ", "ـب"] },
  { letter: "ت", forms: ["تـ", "ـتـ", "ـت"] },
  { letter: "ث", forms: ["ثـ", "ـثـ", "ـث"] },
  { letter: "ج", forms: ["جـ", "ـجـ", "ـج"] },
  { letter: "ح", forms: ["حـ", "ـحـ", "ـح"] },
  { letter: "خ", forms: ["خـ", "ـخـ", "ـخ"] },
  { letter: "س", forms: ["سـ", "ـسـ", "ـس"] },
  { letter: "ش", forms: ["شـ", "ـشـ", "ـش"] },
  { letter: "ع", forms: ["عـ", "ـعـ", "ـع"] },
  { letter: "ف", forms: ["فـ", "ـفـ", "ـف"] },
  { letter: "ق", forms: ["قـ", "ـقـ", "ـق"] },
  { letter: "ن", forms: ["نـ", "ـنـ", "ـن"] },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateCards(): Card[] {
  const selectedPairs = shuffleArray(letterPairs).slice(0, 6)
  const cards: Card[] = []

  selectedPairs.forEach((pair, idx) => {
    const randomForm = pair.forms[Math.floor(Math.random() * pair.forms.length)]
    cards.push({
      id: idx * 2,
      letter: pair.letter,
      form: pair.letter,
      isFlipped: false,
      isMatched: false,
    })
    cards.push({
      id: idx * 2 + 1,
      letter: pair.letter,
      form: randomForm,
      isFlipped: false,
      isMatched: false,
    })
  })

  return shuffleArray(cards)
}

export function LetterMatchGame() {
  const { locale } = useI18n()
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const initGame = useCallback(() => {
    setCards(generateCards())
    setFlippedCards([])
    setMoves(0)
    setScore(0)
    setGameComplete(false)
    setTimer(0)
    setIsRunning(false)
  }, [])

  useEffect(() => {
    initGame()
  }, [initGame])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !gameComplete) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, gameComplete])

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setGameComplete(true)
      setIsRunning(false)
    }
  }, [cards])

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    if (!isRunning) setIsRunning(true)

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    )
    setCards(newCards)

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1)
      const [first, second] = newFlipped.map((id) =>
        newCards.find((c) => c.id === id)
      )

      if (first && second && first.letter === second.letter) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.letter === first.letter ? { ...c, isMatched: true } : c
            )
          )
          setScore((prev) => prev + 10)
          setFlippedCards([])
        }, 500)
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          )
          setFlippedCards([])
        }, 800)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-card rounded-3xl border border-border p-6 lg:p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === "ar" ? "لعبة مطابقة الحروف" : locale === "en" ? "Letter Matching" : "Correspondance des lettres"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "ar" ? "طابق الحرف مع شكله" : locale === "en" ? "Match each letter with its form" : "Associez chaque lettre a sa forme"}
          </p>
        </div>
        <button
          onClick={initGame}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          {locale === "ar" ? "لعبة جديدة" : "New Game"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-primary/5 rounded-xl p-3 text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{formatTime(timer)}</p>
          <p className="text-xs text-muted-foreground">{locale === "ar" ? "الوقت" : "Time"}</p>
        </div>
        <div className="bg-secondary/10 rounded-xl p-3 text-center">
          <Sparkles className="w-5 h-5 text-secondary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{moves}</p>
          <p className="text-xs text-muted-foreground">{locale === "ar" ? "المحاولات" : "Moves"}</p>
        </div>
        <div className="bg-primary/5 rounded-xl p-3 text-center">
          <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{score}</p>
          <p className="text-xs text-muted-foreground">{locale === "ar" ? "النقاط" : "Score"}</p>
        </div>
      </div>

      {/* Game Board */}
      {!gameComplete ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched}
              className={`relative aspect-square rounded-2xl text-3xl font-bold transition-all duration-300 ${
                card.isMatched
                  ? "bg-primary/20 text-primary border-2 border-primary/40 scale-95"
                  : card.isFlipped
                    ? "bg-secondary text-secondary-foreground shadow-lg scale-105"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:border-primary/30 border-2 border-border cursor-pointer hover:scale-105"
              }`}
              aria-label={card.isFlipped || card.isMatched ? card.form : (locale === "ar" ? "بطاقة مخفية" : "Hidden card")}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="text-2xl sm:text-3xl">{card.form}</span>
              ) : (
                <span className="text-2xl">{"?"}</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        /* Victory Screen */
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-6">
            <Trophy className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-3xl font-extrabold text-foreground mb-2">
            {locale === "ar" ? "أحسنت! لقد فزت!" : locale === "en" ? "Congratulations! You Won!" : "Felicitations! Vous avez gagne!"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {locale === "ar"
              ? `أنهيت اللعبة في ${formatTime(timer)} بـ ${moves} محاولة وحصلت على ${score} نقطة`
              : `Completed in ${formatTime(timer)} with ${moves} moves and ${score} points`}
          </p>
          <button
            onClick={initGame}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all"
          >
            {locale === "ar" ? "العب مرة أخرى" : "Play Again"}
          </button>
        </div>
      )}
    </div>
  )
}
