'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { GameResults } from './GameResults'

const cards = ['قل هو الله أحد', 'بسم الله الرحمن الرحيم', 'الحمد لله رب العالمين', 'لا إله إلا الله', 'سبحان الله وبحمده']

export function MemorizationCardsGame() {
  const { locale } = useI18n()
  const [pairs, setPairs] = useState<{id: number, revealed: boolean, matched: boolean}[]>([])
  const [first, setFirst] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [matched, setMatched] = useState(0)
  const [timer, setTimer] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const shuffled = [...cards, ...cards].sort(() => Math.random() - 0.5).map((v, i) => ({id: i, text: v, revealed: false, matched: false}))
    setPairs(shuffled as any)
    const t = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(t)
  }, [complete === null])

  useEffect(() => {
    if (matched === cards.length) setComplete(true)
  }, [matched])

  const handleClick = (idx: number) => {
    if (!first) {
      setFirst(idx)
    } else {
      const p = [...pairs]
      if (p[idx].text === p[first].text) {
        p[idx].matched = true
        p[first].matched = true
        setScore(s => s + 100)
        setMatched(m => m + 1)
      }
      setFirst(null)
    }
  }

  if (complete) {
    const stars = calculateStars((matched / cards.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: matched, incorrectAnswers: 0, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={matched} totalQuestions={cards.length} accuracy={100} earnedBadges={badges} onRestart={() => {setScore(0); setMatched(0); setComplete(false); setTimer(0); setFirst(null)}} onBack={() => {}} />
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8">
        <div><div className="text-3xl font-bold text-primary">{score}</div></div>
        <div><div className="text-2xl font-bold">{matched}/{cards.length}</div></div>
        <div><div className="text-3xl font-bold text-emerald-600">{timer}s</div></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {pairs.map((p, i) => (
          <button key={i} onClick={() => handleClick(i)} disabled={p.matched} className={`aspect-square rounded-lg font-bold text-sm text-center p-2 transition-all ${p.matched ? 'bg-green-500 text-white' : 'bg-primary text-white hover:scale-105'} disabled:opacity-50`}>{p.text || '?'}</button>
        ))}
      </div>
    </div>
  )
}
