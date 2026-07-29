'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const events = [{event: 'ولادة النبي محمد', year: 'عام الفيل'}, {event: 'الهجرة إلى المدينة', year: '1 هـ'}, {event: 'بيعة العقبة الثانية', year: 'قبل الهجرة'}, {event: 'فتح مكة', year: '8 هـ'}, {event: 'حجة الوداع', year: '10 هـ'}]

export function SiraEventsGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const shuffled = useMemo(() => {
    return [...events].sort(() => Math.random() - 0.5)
  }, [idx])

  const handleAns = (year: string) => {
    if (selected) return
    setSelected(year)
    
    if (year === events[idx].year) { 
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }
    
    setTimeout(() => {
      if (idx < events.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const stars = calculateStars((correct / events.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: events.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={events.length} accuracy={(correct/events.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8"><div><div className="text-3xl font-bold text-primary">{score}</div></div><div><div className="text-2xl font-bold">{idx+1}/{events.length}</div></div></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center">
        <p className="text-lg font-bold mb-6">{events[idx].event}</p>
        <div className="space-y-2">
          {shuffled.map((e, i) => (
            <button key={i} onClick={() => handleAns(e.year)} className="w-full p-3 bg-muted hover:bg-primary/10 rounded-lg font-bold">{e.year}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
