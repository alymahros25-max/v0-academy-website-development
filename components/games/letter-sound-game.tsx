'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const letters = [{letter: 'ا', sound: 'ألف'}, {letter: 'ب', sound: 'باء'}, {letter: 'ت', sound: 'تاء'}, {letter: 'ث', sound: 'ثاء'}, {letter: 'ج', sound: 'جيم'}]

export function LetterSoundGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const shuffled = useMemo(() => {
    return [...letters].sort(() => Math.random() - 0.5)
  // Intentional: reshuffle the options whenever the current question changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const handleAns = (sound: string) => {
    if (selected) return
    setSelected(sound)
    
    if (sound === letters[idx].sound) { 
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }
    
    setTimeout(() => {
      if (idx < letters.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const stars = calculateStars((correct / letters.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: letters.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={letters.length} accuracy={(correct/letters.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-lime-50 to-transparent dark:from-lime-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{letters.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center">
        <p className="text-6xl font-bold mb-6">{letters[idx].letter}</p>
        <div className="space-y-2">
          {shuffled.map((l, i) => (
            <button key={i} onClick={() => handleAns(l.sound)} className="w-full p-3 bg-muted hover:bg-primary/10 rounded-lg font-bold">{l.sound}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
