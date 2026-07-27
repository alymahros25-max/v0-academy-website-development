'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { GameResults } from './GameResults'

const colors = [{name: 'أحمر', color: 'bg-red-500'}, {name: 'أزرق', color: 'bg-blue-500'}, {name: 'أخضر', color: 'bg-green-500'}, {name: 'أصفر', color: 'bg-yellow-500'}, {name: 'بنفسجي', color: 'bg-purple-500'}]

export function ColorsQuizGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  
  useEffect(() => {
    const t = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(t)
  }, [done])

  const handleAns = (name: string) => {
    if (name === colors[idx].name) {
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    }
    if (idx < colors.length - 1) setIdx(idx + 1)
    else setDone(true)
  }

  if (done) {
    const stars = calculateStars((correct / colors.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: colors.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={colors.length} accuracy={(correct/colors.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }

  const shuffled = [...colors].sort(() => Math.random() - 0.5)
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{colors.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8">
        <div className={`h-32 rounded-lg mb-6 ${colors[idx].color}`}></div>
        <div className="space-y-2">
          {shuffled.map((c, i) => (
            <button key={i} onClick={() => handleAns(c.name)} className="w-full p-3 bg-muted hover:bg-primary/10 rounded-lg font-bold">{c.name}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
