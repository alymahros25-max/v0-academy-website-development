'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { GameResults } from './GameResults'

const battles = [{name: 'بدر', year: '2 هـ'}, {name: 'أحد', year: '3 هـ'}, {name: 'الخندق', year: '5 هـ'}, {name: 'خيبر', year: '7 هـ'}, {name: 'تبوك', year: '9 هـ'}]

export function BattlesTimelineGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const handleAns = (year: string) => {
    if (year === battles[idx].year) { setScore(s => s + 100); setCorrect(c => c + 1) }
    if (idx < battles.length - 1) setIdx(idx + 1); else setDone(true)
  }

  if (done) {
    const stars = calculateStars((correct / battles.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: battles.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={battles.length} accuracy={(correct/battles.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }

  const shuffled = [...battles].sort(() => Math.random() - 0.5)
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{battles.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center">
        <p className="text-2xl font-bold text-primary mb-6">{locale === 'ar' ? 'غزوة ' : 'Battle of '}{battles[idx].name}</p>
        <div className="space-y-2">
          {shuffled.map((b, i) => (
            <button key={i} onClick={() => handleAns(b.year)} className="w-full p-3 bg-muted hover:bg-primary/10 rounded-lg font-bold">{b.year}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
