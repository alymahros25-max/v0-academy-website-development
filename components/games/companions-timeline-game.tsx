'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { GameResults } from './GameResults'

const companions = [{name: 'أبو بكر الصديق', order: '1'}, {name: 'عمر بن الخطاب', order: '2'}, {name: 'عثمان بن عفان', order: '3'}, {name: 'علي بن أبي طالب', order: '4'}, {name: 'الزبير بن العوام', order: '5'}]

export function CompanionsTimelineGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const handleAns = (order: string) => {
    if (order === companions[idx].order) { setScore(s => s + 100); setCorrect(c => c + 1) }
    if (idx < companions.length - 1) setIdx(idx + 1); else setDone(true)
  }

  if (done) {
    const stars = calculateStars((correct / companions.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: companions.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={companions.length} accuracy={(correct/companions.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{companions.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center">
        <p className="text-lg font-bold mb-6">{companions[idx].name}</p>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <button key={i} onClick={() => handleAns((i+1).toString())} className="w-full p-3 bg-muted hover:bg-primary/10 rounded-lg font-bold">{locale === 'ar' ? 'الخليفة ' : 'Caliph '}{i+1}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
