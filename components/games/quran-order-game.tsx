"use client"

import { useState, useEffect, useMemo } from "react"
import { calculateStars, earnBadges } from "@/lib/games-engine"
import { GameResults } from "./GameResults"

const verseQuestions = [
  { words: ["الحمد", "لله", "رب", "العالمين"], correct: [0, 1, 2, 3] },
  { words: ["المصحف", "كتاب", "الله", "المبين"], correct: [2, 1, 0, 3] },
  { words: ["الصلاة", "أركان", "خمس", "والإيمان"], correct: [0, 2, 3, 1] },
]

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function QuranOrderGame() {
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<number[]>([])
  const [combo, setCombo] = useState(0)

  const currentQuestion = verseQuestions[currentQ]

  const shuffledIndices = useMemo(() => {
    return shuffleArray([0, 1, 2, 3])
  // Intentional: regenerate the shuffled order for every question.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ])

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSelectWord = (wordIdx: number) => {
    if (!selectedOrder.includes(wordIdx)) {
      setSelectedOrder([...selectedOrder, wordIdx])
    }
  }

  const handleRemoveWord = (idx: number) => {
    setSelectedOrder(selectedOrder.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(currentQuestion.correct)
    if (isCorrect) {
      const newCombo = combo + 1
      setScore((s) => s + 100 + (newCombo > 1 ? newCombo * 50 : 0))
      setCorrect((c) => c + 1)
      setCombo(newCombo)
    } else {
      setCombo(0)
    }

    if (currentQ < verseQuestions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelectedOrder([])
    } else {
      setGameComplete(true)
    }
  }

  if (gameComplete) {
    const accuracy = (correct / verseQuestions.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers: correct,
      incorrectAnswers: verseQuestions.length - correct,
      timeSpent: timer,
      combo,
      stars,
    })

    return (
      <GameResults
        score={score}
        stars={stars}
        timeSpent={timer}
        correctAnswers={correct}
        totalQuestions={verseQuestions.length}
        accuracy={accuracy}
        earnedBadges={badges}
        onRestart={() => {
          setCurrentQ(0)
          setScore(0)
          setCorrect(0)
          setGameComplete(false)
          setTimer(0)
          setSelectedOrder([])
          setCombo(0)
        }}
        onBack={() => {}}
      />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-8">
      <div className="flex justify-between mb-8">
        <div className="text-3xl font-bold">{score}</div>
        <div className="text-center">
          {currentQ + 1}/{verseQuestions.length}
          <div className="h-2 bg-muted rounded-full w-32 mt-1">
            <div className="h-full bg-primary" style={{ width: `${((currentQ + 1) / verseQuestions.length) * 100}%` }} />
          </div>
        </div>
        <div className="text-3xl font-bold">{timer}s</div>
      </div>

      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8">
        <div className="mb-8">
          <div className="font-bold mb-4 text-center">رتب الكلمات بالترتيب الصحيح:</div>
          <div className="flex flex-wrap justify-center gap-2 min-h-16 bg-primary/5 rounded-xl p-4">
            {selectedOrder.length > 0 ? (
              selectedOrder.map((idx, pos) => (
                <button
                  key={pos}
                  onClick={() => handleRemoveWord(pos)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/80"
                >
                  {currentQuestion.words[idx]}
                </button>
              ))
            ) : (
              <div className="text-muted-foreground">اختر الكلمات بالترتيب</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {shuffledIndices.map((idx) => (
            <button
              key={idx}
              onClick={() => handleSelectWord(idx)}
              disabled={selectedOrder.includes(idx)}
              className="py-3 px-4 bg-secondary/20 hover:bg-secondary/30 text-secondary font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion.words[idx]}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedOrder.length !== 4}
          className="w-full mt-8 py-3 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          تحقق من الإجابة
        </button>
      </div>
    </div>
  )
}
