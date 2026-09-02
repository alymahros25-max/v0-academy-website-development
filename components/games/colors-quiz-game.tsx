'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const colors = [
  { name: 'أحمر', color: 'bg-red-500' },
  { name: 'أزرق', color: 'bg-blue-500' },
  { name: 'أخضر', color: 'bg-green-500' },
  { name: 'أصفر', color: 'bg-yellow-500' },
  { name: 'بنفسجي', color: 'bg-purple-500' },
]

export function ColorsQuizGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  const shuffled = useMemo(() => {
    return [...colors].sort(() => Math.random() - 0.5)
  // Intentional: reshuffle the options whenever the current question changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [done])

  const handleAnswer = (name: string) => {
    setSelected(name)
    if (name === colors[idx].name) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < colors.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const accuracy = (correct / colors.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers: correct,
      incorrectAnswers: colors.length - correct,
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
        totalQuestions={colors.length}
        accuracy={accuracy}
        earnedBadges={badges}
        onRestart={() => {
          setIdx(0)
          setScore(0)
          setCorrect(0)
          setDone(false)
          setTimer(0)
          setSelected(null)
        }}
        onBack={() => {}}
      />
    )
  }

  const currentColor = colors[idx]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{colors.length}</div>
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
          style={{ width: `${((idx + 1) / colors.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-8 mb-8 shadow-lg">
        <div className={`h-48 rounded-2xl mb-6 ${currentColor.color} shadow-lg`} />
        <div className="text-center text-lg font-bold text-foreground">
          {locale === 'ar' ? 'ما هو لون هذا الشكل؟' : 'What is the color of this shape?'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shuffled.map((color, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(color.name)}
            disabled={selected !== null}
            className={`py-4 px-3 rounded-xl font-bold text-sm transition-all ${
              selected === color.name
                ? color.name === currentColor.name
                  ? 'bg-emerald-500 text-white scale-105'
                  : 'bg-red-500 text-white scale-95'
                : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
            } disabled:opacity-50`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  )
}
