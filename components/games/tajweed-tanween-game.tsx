'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { GameResults } from './GameResults'

const questions = [
  { ar: 'أحكام التنوين: الإدغام', options: ['إدغام', 'إخفاء', 'إقلاب'], correct: 'إدغام' },
  { ar: 'التنوين عند الحروف الحلقية يكون', options: ['إخفاء', 'إدغام', 'إظهار'], correct: 'إظهار' },
  { ar: 'تنوين الميم قبل الباء يكون', options: ['إدغام', 'إقلاب', 'إخفاء'], correct: 'إقلاب' },
  { ar: 'التنوين الساكن والنون الساكنة يأخذان', options: ['أحكام واحدة', 'أحكام مختلفة', 'لا أحكام'], correct: 'أحكام واحدة' },
  { ar: 'الإدغام الكامل يكون عند', options: ['الياء والميم والنون', 'اللام والراء', 'الفاء والقاف'], correct: 'الياء والميم والنون' },
]

export function TajweedTanweenGame() {
  const { locale } = useI18n()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [complete, setComplete] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [timer, setTimer] = useState(0)
  const [combo, setCombo] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(t)
  }, [complete])

  const handleAnswer = (opt: string) => {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    
    if (opt === questions[index].correct) {
      const pts = 100 + (combo > 0 ? combo * 50 : 0)
      setScore(s => s + pts)
      setCorrect(c => c + 1)
      setCombo(combo + 1)
    } else {
      setCombo(0)
    }

    setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex(index + 1)
        setSelected(null)
        setAnswered(false)
      } else {
        setComplete(true)
      }
    }, 1000)
  }

  if (complete) {
    const acc = (correct / questions.length) * 100
    const stars = calculateStars(acc)
    const badges = earnBadges({ totalPoints: score, correctAnswers: correct, incorrectAnswers: questions.length - correct, timeSpent: timer, combo, stars })
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={questions.length} accuracy={acc} earnedBadges={badges} onRestart={() => { setIndex(0); setScore(0); setCorrect(0); setComplete(false); setSelected(null); setAnswered(false); setTimer(0); setCombo(0) }} onBack={() => {}} />
  }

  const q = questions[index]
  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-950/20 rounded-3xl p-8">
      <div className="flex justify-between mb-8">
        <div><div className="text-3xl font-bold text-primary">{score}</div><div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Score'}</div></div>
        <div><div className="text-2xl font-bold">{index + 1}/{questions.length}</div><div className="text-xs text-muted-foreground">{locale === 'ar' ? 'السؤال' : 'Q'}</div></div>
        <div><div className="text-3xl font-bold text-emerald-600">{timer}s</div><div className="text-xs text-muted-foreground">{locale === 'ar' ? 'الوقت' : 'Time'}</div></div>
      </div>
      
      <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden"><div className="h-full bg-primary transition-all" style={{width: `${((index+1)/questions.length)*100}%`}} /></div>

      <div className="bg-white dark:bg-background rounded-2xl border-2 border-primary/20 p-6 mb-8 text-center">
        <p className="text-lg font-bold text-foreground mb-6">{q.ar}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={answered} className={`w-full p-4 rounded-lg font-bold transition-all ${selected === opt ? (opt === q.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-muted hover:bg-primary/10'} disabled:opacity-50`}>{opt}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
