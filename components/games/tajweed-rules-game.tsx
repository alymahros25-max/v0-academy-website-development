"use client"

import { useState, useEffect, useCallback } from "react"
import { useI18n } from "@/lib/i18n"
import { calculateScore, calculateStars, earnBadges } from "@/lib/games-engine"
import { GameResults } from "./GameResults"

const tajweedQuestions = [
  { question: "حكم التنوين عند البدء ب الهمزة؟", options: ["إدغام", "إظهار", "إخفاء"], correct: 1, hint: "تُظهر الحرف" },
  { question: "ماذا يعني الإظهار في التجويد؟", options: ["الدمج", "الإبانة والوضوح", "الخفاء"], correct: 1, hint: "وضوح الحرف" },
  { question: "حكم الميم الساكنة قبل الباء؟", options: ["إظهار", "إخفاء", "إدغام"], correct: 2, hint: "الدمج" },
  { question: "اللام الشمسية تكون؟", options: ["مفتوحة دائماً", "مسكنة مظهرة", "مسكنة مدغمة"], correct: 2, hint: "الإدغام" },
  { question: "ما أحكام النون الساكنة والتنوين؟", options: ["ثلاثة", "أربعة", "خمسة"], correct: 1, hint: "الإظهار، الإدغام، الإخفاء" },
]

export function TajweedRulesGame() {
  const { locale } = useI18n()
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [combo, setCombo] = useState(0)

  const currentQuestion = tajweedQuestions[currentQ]
  const totalQuestions = tajweedQuestions.length

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !gameComplete) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, gameComplete])

  const handleAnswer = useCallback(
    (idx: number) => {
      const isCorrect = idx === currentQuestion.correct
      if (isCorrect) {
        const newCombo = combo + 1
        const comboBonus = newCombo > 1 ? newCombo * 50 : 0
        setScore((s) => s + 100 + comboBonus)
        setCorrectAnswers((c) => c + 1)
        setCombo(newCombo)
      } else {
        setCombo(0)
      }

      if (currentQ < totalQuestions - 1) {
        setCurrentQ(currentQ + 1)
        setSelectedAnswer(null)
      } else {
        setIsRunning(false)
        setGameComplete(true)
      }
    },
    [currentQ, currentQuestion, combo, totalQuestions]
  )

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
          setCurrentQ(0)
          setScore(0)
          setCorrectAnswers(0)
          setGameComplete(false)
          setTimer(0)
          setIsRunning(true)
          setSelectedAnswer(null)
          setCombo(0)
        }}
        onBack={() => {}}
      />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-950/20 rounded-3xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-3xl font-extrabold text-primary">{score}</div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">{currentQ + 1}/{totalQuestions}</div>
          <div className="h-2 bg-muted rounded-full w-48 overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-emerald-600">{timer}s</div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8">
        <div className="text-xl font-bold text-foreground mb-8 text-center">{currentQuestion.question}</div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl font-bold text-lg transition-all ${
                selectedAnswer === null
                  ? "bg-primary/10 hover:bg-primary/20 text-foreground border-2 border-primary/20 hover:border-primary"
                  : idx === currentQuestion.correct
                    ? "bg-emerald-100 dark:bg-emerald-950/30 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-100"
                    : idx === selectedAnswer
                      ? "bg-red-100 dark:bg-red-950/30 border-2 border-red-500 text-red-700 dark:text-red-100"
                      : "bg-muted text-muted-foreground border-2 border-muted"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
            <div className="font-bold text-blue-900 dark:text-blue-100 mb-2">التلميح:</div>
            <div className="text-blue-800 dark:text-blue-200">{currentQuestion.hint}</div>
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            onClick={() => {
              if (currentQ < totalQuestions - 1) {
                setCurrentQ(currentQ + 1)
                setSelectedAnswer(null)
              } else {
                setIsRunning(false)
                setGameComplete(true)
              }
            }}
            className="w-full mt-6 py-3 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            التالي
          </button>
        )}
      </div>
    </div>
  )
}
