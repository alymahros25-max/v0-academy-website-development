"use client"

import { useState, useEffect, useCallback } from "react"
import { useI18n } from "@/lib/i18n"
import { RotateCcw, Clock, Sparkles } from "lucide-react"
import { calculateScore, calculateStars, earnBadges } from "@/lib/games-engine"
import { GameResults } from "./GameResults"

const wordList = [
  { ar: "محمد", hint: "اسم النبي", letters: ["م", "ح", "م", "د"] },
  { ar: "قرآن", hint: "كتاب الله", letters: ["ق", "ر", "آ", "ن"] },
  { ar: "دعاء", hint: "طلب من الله", letters: ["د", "ع", "ا", "ء"] },
  { ar: "رحمة", hint: "شعور التعاطف", letters: ["ر", "ح", "م", "ة"] },
  { ar: "صلاة", hint: "عماد الدين", letters: ["ص", "ل", "ا", "ة"] },
  { ar: "حكمة", hint: "العلم والفهم", letters: ["ح", "ك", "م", "ة"] },
]

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function WordBuilderGame() {
  const { locale } = useI18n()
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(wordList.length)
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [combo, setCombo] = useState(0)

  const currentWord = wordList[currentWordIdx]

  useEffect(() => {
    if (currentWordIdx === 0 && selectedLetters.length === 0) {
      setAvailableLetters(shuffleArray(currentWord.letters))
    }
  }, [currentWordIdx, selectedLetters])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !gameComplete) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, gameComplete])

  const handleSelectLetter = (letter: string, index: number) => {
    setSelectedLetters([...selectedLetters, letter])
    setAvailableLetters(availableLetters.filter((_, i) => i !== index))
  }

  const handleRemoveLetter = (index: number) => {
    const letter = selectedLetters[index]
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index))
    setAvailableLetters([...availableLetters, letter])
  }

  const handleSubmit = useCallback(() => {
    const answer = selectedLetters.join("")
    const isCorrect = answer === currentWord.ar

    if (isCorrect) {
      const newCombo = combo + 1
      const comboBonus = newCombo > 1 ? newCombo * 50 : 0
      const points = 100 + comboBonus
      setScore((s) => s + points)
      setCorrectAnswers((c) => c + 1)
      setCombo(newCombo)
    } else {
      setCombo(0)
    }

    if (currentWordIdx < wordList.length - 1) {
      setCurrentWordIdx(currentWordIdx + 1)
      setSelectedLetters([])
      setAvailableLetters(shuffleArray(wordList[currentWordIdx + 1].letters))
    } else {
      setIsRunning(false)
      setGameComplete(true)
    }
  }, [selectedLetters, currentWord, currentWordIdx, combo])

  if (gameComplete) {
    const accuracy = (correctAnswers / totalQuestions) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      timeSpent: timer,
      combo,
      stars,
    })

    return (
      <GameResults
        score={score}
        stars={stars}
        timeSpent={timer}
        correctAnswers={correctAnswers}
        totalQuestions={totalQuestions}
        accuracy={accuracy}
        earnedBadges={badges}
        onRestart={() => {
          setCurrentWordIdx(0)
          setSelectedLetters([])
          setScore(0)
          setCorrectAnswers(0)
          setGameComplete(false)
          setTimer(0)
          setIsRunning(true)
          setCombo(0)
        }}
        onBack={() => {}}
      />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 rounded-3xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-primary">{score}</div>
            <div className="text-xs text-muted-foreground">النقاط</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-emerald-600">{timer}s</div>
            <div className="text-xs text-muted-foreground">الوقت</div>
          </div>
          {combo > 0 && (
            <div className="text-center">
              <div className="text-3xl font-extrabold text-orange-600">{combo}x</div>
              <div className="text-xs text-muted-foreground">تسلسل</div>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((currentWordIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          {currentWordIdx + 1} من {totalQuestions}
        </div>
      </div>

      {/* Word Card */}
      <div className="bg-white dark:bg-background rounded-2xl border-2 border-primary/20 p-8 mb-8 text-center">
        <div className="text-sm text-muted-foreground mb-2">التلميح:</div>
        <div className="text-lg font-bold text-primary mb-6">{currentWord.hint}</div>

        {/* Selected Letters Display */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 min-h-14 bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4">
          {selectedLetters.length > 0 ? (
            selectedLetters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveLetter(idx)}
                className="w-12 h-12 bg-primary text-white rounded-lg font-bold text-xl hover:bg-primary/80 transition-colors"
              >
                {letter}
              </button>
            ))
          ) : (
            <div className="text-muted-foreground">اختر الحروف أعلاه</div>
          )}
        </div>

        {/* Available Letters */}
        <div className="grid grid-cols-4 gap-2">
          {availableLetters.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectLetter(letter, idx)}
              className="py-3 px-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-lg rounded-lg transition-all hover:scale-105"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={selectedLetters.length === 0}
          className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          تحقق من الإجابة
        </button>
        <button
          onClick={() => {
            setSelectedLetters([])
            setAvailableLetters(shuffleArray(currentWord.letters))
          }}
          className="py-3 px-6 rounded-xl font-bold border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
