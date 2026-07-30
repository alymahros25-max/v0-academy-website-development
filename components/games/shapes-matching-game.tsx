'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const shapes = [
  { name: 'دائرة', emoji: '●', color: 'from-blue-400 to-blue-600' },
  { name: 'مربع', emoji: '■', color: 'from-red-400 to-red-600' },
  { name: 'مثلث', emoji: '▲', color: 'from-yellow-400 to-yellow-600' },
  { name: 'نجمة', emoji: '★', color: 'from-purple-400 to-purple-600' },
  { name: 'قلب', emoji: '❤', color: 'from-pink-400 to-pink-600' },
]

export function ShapesMatchingGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(true)

  const shuffled = useMemo(() => {
    return [...shapes].sort(() => Math.random() - 0.5)
  }, [idx])

  useEffect(() => {
    if (done) {
      setIsRunning(false)
      return
    }
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [done])

  const handleAnswer = (name: string) => {
    setSelected(name)
    if (name === shapes[idx].name) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < shapes.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const accuracy = (correct / shapes.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers: correct,
      incorrectAnswers: shapes.length - correct,
      timeSpent: timer,
      combo: 1,
      stars,
    })
    return (
      <GameResults
        score={score}
        stars={stars}
        timeSpent={timer}
        correctAnswers={correct}
        totalQuestions={shapes.length}
        accuracy={accuracy}
        earnedBadges={badges}
        onRestart={() => {
          setIdx(0)
          setScore(0)
          setCorrect(0)
          setDone(false)
          setTimer(0)
          setSelected(null)
          setIsRunning(true)
        }}
        onBack={() => {}}
      />
    )
  }

  const currentShape = shapes[idx]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{shapes.length}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'السؤال' : 'Question'}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-emerald-600">{timer}s</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'الوقت' : 'Time'}</div>
        </div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((idx + 1) / shapes.length) * 100}%` }}
        />
      </div>

      <div className={`bg-gradient-to-br ${currentShape.color} rounded-2xl border-4 border-white p-12 mb-8 text-center shadow-lg`}>
        <div className="text-8xl mb-4">{currentShape.emoji}</div>
        <div className="text-xl font-bold text-white">{locale === 'ar' ? 'اختر اسم الشكل' : 'Select the shape name'}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {shuffled.map((shape, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(shape.name)}
            disabled={selected !== null}
            className={`py-4 px-3 rounded-xl font-bold text-sm transition-all ${
              selected === shape.name
                ? shape.name === currentShape.name
                  ? 'bg-emerald-500 text-white scale-105'
                  : 'bg-red-500 text-white scale-95'
                : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
            } disabled:opacity-50`}
          >
            {shape.name}
          </button>
        ))}
      </div>
    </div>
  )
}
