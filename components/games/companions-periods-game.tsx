'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const periods = [
  { name: 'أبو بكر', period: 'مكة' },
  { name: 'عمر', period: 'المدينة' },
  { name: 'عثمان', period: 'الفتوحات' },
  { name: 'علي', period: 'الفتنة' },
  { name: 'خديجة', period: 'مكة' },
]

export function CompanionsPeriodsGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [done])

  const handleAns = (p: string) => {
    setSelected(p)
    if (p === periods[idx].period) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < periods.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 800)
  }

  if (done) {
    const accuracy = (correct / periods.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({ totalPoints: score, correctAnswers: correct, incorrectAnswers: periods.length - correct, timeSpent: timer, combo: 1, stars })
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={periods.length} accuracy={accuracy} earnedBadges={badges} onRestart={() => { setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0); setSelected(null) }} onBack={() => {}} />
  }

  const options = ['مكة', 'المدينة', 'الفتوحات', 'الفتنة']
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center"><div className="text-3xl font-extrabold text-primary">{score}</div></div>
        <div className="text-center"><div className="text-2xl font-bold">{idx + 1}/{periods.length}</div></div>
        <div className="text-center"><div className="text-3xl font-extrabold text-emerald-600">{timer}s</div></div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8"><div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / periods.length) * 100}%` }} /></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center"><div className="text-2xl font-bold text-primary mb-4">{periods[idx].name}</div><p className="text-foreground">{locale === 'ar' ? 'في أي فترة عاش؟' : 'In which period did he live?'}</p></div>
      <div className="grid grid-cols-2 gap-3">{options.map((opt, i) => (<button key={i} onClick={() => handleAns(opt)} className={`py-4 px-3 rounded-xl font-bold transition-all ${selected === opt ? opt === periods[idx].period ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>{opt}</button>))}</div>
    </div>
  )
}
