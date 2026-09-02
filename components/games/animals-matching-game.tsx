'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const animals = [
  { name: 'أسد', emoji: '🦁' },
  { name: 'نسر', emoji: '🦅' },
  { name: 'ضب', emoji: '🦎' },
  { name: 'أرنب', emoji: '🐰' },
  { name: 'ذئب', emoji: '🐺' },
]

export function AnimalsMatchingGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  // Shuffle options ONLY when current question changes using useMemo
  const currentOptions = useMemo(() => {
    return [...animals].sort(() => Math.random() - 0.5)
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
    if (name === animals[idx].name) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < animals.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const accuracy = (correct / animals.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers: correct,
      incorrectAnswers: animals.length - correct,
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
        totalQuestions={animals.length}
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

  const currentAnimal = animals[idx]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{animals.length}</div>
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
          style={{ width: `${((idx + 1) / animals.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-12 mb-8 text-center shadow-lg">
        <div className="text-8xl mb-4">{currentAnimal.emoji}</div>
        <div className="text-xl font-bold text-foreground">{locale === 'ar' ? 'ما هو اسم هذا الحيوان؟' : 'What is this animal called?'}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {currentOptions.map((animal) => (
          <button
            key={animal.name}
            onClick={() => handleAnswer(animal.name)}
            disabled={selected !== null}
            className={`py-4 px-3 rounded-xl font-bold text-sm transition-all ${
              selected === animal.name
                ? animal.name === currentAnimal.name
                  ? 'bg-emerald-500 text-white scale-105'
                  : 'bg-red-500 text-white scale-95'
                : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
            } disabled:opacity-50`}
          >
            {animal.name}
          </button>
        ))}
      </div>
    </div>
  )
}
