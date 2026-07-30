'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const martyrs = [
  { name: 'حمزة بن عبدالمطلب', desc: 'عم الرسول، شهيد أحد', isMartyr: true },
  { name: 'أبو بكر الصديق', desc: 'أول الخلفاء الراشدين', isMartyr: false },
  { name: 'جعفر بن أبي طالب', desc: 'ذو الجناحين في الجنة', isMartyr: true },
  { name: 'عمر بن الخطاب', desc: 'الخليفة الثاني', isMartyr: true },
  { name: 'خديجة بنت خويلد', desc: 'أم المؤمنين', isMartyr: false },
]

export function CompanionsMartyrGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<boolean | null>(null)

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [done])

  const handleAns = (answer: boolean) => {
    setSelected(answer)
    if (answer === martyrs[idx].isMartyr) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < martyrs.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 800)
  }

  if (done) {
    const accuracy = (correct / martyrs.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({ totalPoints: score, correctAnswers: correct, incorrectAnswers: martyrs.length - correct, timeSpent: timer, combo: 1, stars })
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={martyrs.length} accuracy={accuracy} earnedBadges={badges} onRestart={() => { setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0); setSelected(null) }} onBack={() => {}} />
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center"><div className="text-3xl font-extrabold text-primary">{score}</div></div>
        <div className="text-center"><div className="text-2xl font-bold">{idx + 1}/{martyrs.length}</div></div>
        <div className="text-center"><div className="text-3xl font-extrabold text-emerald-600">{timer}s</div></div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8"><div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / martyrs.length) * 100}%` }} /></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center"><div className="text-2xl font-bold text-primary mb-4">{martyrs[idx].name}</div><p className="text-foreground mb-4">{martyrs[idx].desc}</p><p className="text-lg font-semibold">{locale === 'ar' ? 'هل هو من الشهداء؟' : 'Is he a martyr?'}</p></div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleAns(true)} className={`py-6 px-4 rounded-xl font-bold text-xl transition-all ${selected === true ? selected === martyrs[idx].isMartyr ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>{locale === 'ar' ? 'نعم' : 'Yes'}</button>
        <button onClick={() => handleAns(false)} className={`py-6 px-4 rounded-xl font-bold text-xl transition-all ${selected === false ? selected === martyrs[idx].isMartyr ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>{locale === 'ar' ? 'لا' : 'No'}</button>
      </div>
    </div>
  )
}
