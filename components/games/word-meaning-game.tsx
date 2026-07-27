'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { GameResults } from './GameResults'

const meanings = [{word: 'الرحمن', meaning: 'الرحيم'}, {word: 'الحليم', meaning: 'الصبور'}, {word: 'القوي', meaning: 'العزيز'}, {word: 'الحكيم', meaning: 'العليم'}, {word: 'السميع', meaning: 'البصير'}]

export function WordMeaningGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const handleAns = (meaning: string) => {
    if (meaning === meanings[idx].meaning) { setScore(s => s + 100); setCorrect(c => c + 1) }
    if (idx < meanings.length - 1) setIdx(idx + 1); else setDone(true)
  }

  if (done) {
    const stars = calculateStars((correct / meanings.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: meanings.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={meanings.length} accuracy={(correct/meanings.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }

  const shuffled = [...meanings].sort(() => Math.random() - 0.5)
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-rose-50 to-transparent dark:from-rose-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{meanings.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center">
        <p className="text-2xl font-bold text-primary mb-6">{meanings[idx].word}</p>
        <div className="space-y-2">
          {shuffled.map((m, i) => (
            <button key={i} onClick={() => handleAns(m.meaning)} className="w-full p-3 bg-muted hover:bg-primary/10 rounded-lg font-bold">{m.meaning}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
