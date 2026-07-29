'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const battles = [{name: 'بدر', year: '2 هـ'}, {name: 'أحد', year: '3 هـ'}, {name: 'الخندق', year: '5 هـ'}, {name: 'خيبر', year: '7 هـ'}, {name: 'تبوك', year: '9 هـ'}]

export function BattlesTimelineGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const shuffled = useMemo(() => {
    return [...battles].sort(() => Math.random() - 0.5)
  }, [idx])

  const handleAns = (year: string) => {
    if (selected) return
    setSelected(year)
    
    if (year === battles[idx].year) { 
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }
    
    setTimeout(() => {
      if (idx < battles.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const stars = calculateStars((correct / battles.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: battles.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={battles.length} accuracy={(correct/battles.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{battles.length}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'السؤال' : 'Q'}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-emerald-600">{timer}s</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'الوقت' : 'Time'}</div>
        </div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((idx + 1) / battles.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-8 mb-8 shadow-lg">
        <p className="text-center text-2xl font-bold text-primary mb-6">{locale === 'ar' ? 'غزوة ' : 'Battle of '}{battles[idx].name}</p>
        <div className="grid grid-cols-2 gap-3">
          {shuffled.map((b) => (
            <button 
              key={b.year}
              onClick={() => handleAns(b.year)} 
              disabled={selected !== null}
              className={`py-4 px-3 rounded-xl font-bold text-sm transition-all ${
                selected === b.year
                  ? b.year === battles[idx].year
                    ? 'bg-emerald-500 text-white scale-105'
                    : 'bg-red-500 text-white scale-95'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
              } disabled:opacity-50`}
            >
              {b.year}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
