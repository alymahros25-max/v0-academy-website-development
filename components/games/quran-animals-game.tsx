'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const qAnimals = [{animal: 'السمكة', verse: 'في قصة أصحاب السبت'}, {animal: 'الجراد', verse: 'إحدى الآيات التسع'}, {animal: 'الذباب', verse: 'لا يخلقون ذبابة'}, {animal: 'النحل', verse: 'وأوحى ربك للنحل'}, {animal: 'الفيل', verse: 'أصحاب الفيل'}]

export function QuranAnimalsGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const handleAns = (name: string) => {
    if (selected) return
    setSelected(name)
    
    if (name === qAnimals[idx].animal) { 
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }
    
    setTimeout(() => {
      if (idx < qAnimals.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  // Shuffle options ONLY when current question changes
  const shuffled = useMemo(() => {
    return [...qAnimals].sort(() => Math.random() - 0.5)
  }, [idx])

  if (done) {
    const stars = calculateStars((correct / qAnimals.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: qAnimals.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={qAnimals.length} accuracy={(correct/qAnimals.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{qAnimals.length}</div>
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
          style={{ width: `${((idx + 1) / qAnimals.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-8 mb-8 shadow-lg">
        <p className="text-center text-lg font-bold mb-6 text-foreground">{qAnimals[idx].verse}</p>
        <div className="grid grid-cols-2 gap-3">
          {shuffled.map((a) => (
            <button 
              key={a.animal}
              onClick={() => handleAns(a.animal)} 
              disabled={selected !== null}
              className={`py-4 px-3 rounded-xl font-bold text-sm transition-all ${
                selected === a.animal
                  ? a.animal === qAnimals[idx].animal
                    ? 'bg-emerald-500 text-white scale-105'
                    : 'bg-red-500 text-white scale-95'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
              } disabled:opacity-50`}
            >
              {a.animal}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
