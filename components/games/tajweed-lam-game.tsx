'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { GameResults } from './GameResults'

const lamRules = [{rule: 'اللام قبل الحروف الحلقية', type: 'إظهار'}, {rule: 'اللام قبل الميم والباء', type: 'إدغام'}, {rule: 'اللام قبل الراء', type: 'إدغام'}, {rule: 'اللام قبل الساكن من حروف آخر', type: 'إظهار'}, {rule: 'لام الفعل الماضي', type: 'تفخيم'}]

export function TajweedLamGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const handleAns = (type: string) => {
    if (type === lamRules[idx].type) { setScore(s => s + 100); setCorrect(c => c + 1) }
    if (idx < lamRules.length - 1) setIdx(idx + 1); else setDone(true)
  }

  if (done) {
    const stars = calculateStars((correct / lamRules.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: lamRules.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={lamRules.length} accuracy={(correct/lamRules.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }

  const options = [...new Set(lamRules.map(r => r.type))]
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-fuchsia-50 to-transparent dark:from-fuchsia-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{lamRules.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center">
        <p className="text-lg font-bold mb-6">{lamRules[idx].rule}</p>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <button key={i} onClick={() => handleAns(opt)} className="w-full p-3 bg-muted hover:bg-primary/10 rounded-lg font-bold">{opt}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
