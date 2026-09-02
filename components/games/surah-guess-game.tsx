'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const surahs = [
  { name: 'الفاتحة', verse: 'بسم الله الرحمن الرحيم' },
  { name: 'يس', verse: 'يس والقرآن الحكيم' },
  { name: 'الملك', verse: 'تبارك الذي بيده الملك' },
  { name: 'الإخلاص', verse: 'قل هو الله أحد' },
  { name: 'النور', verse: 'سورة أنزلناها وفرضناها' },
]

export function SurahGuessGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  const shuffled = useMemo(() => {
    return [...surahs.map(s => s.name)].sort(() => Math.random() - 0.5)
  // Intentional: reshuffle the options whenever the current question changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [done])

  const handleAns = (name: string) => {
    setSelected(name)
    if (name === surahs[idx].name) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < surahs.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 800)
  }

  if (done) {
    const accuracy = (correct / surahs.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({ totalPoints: score, correctAnswers: correct, incorrectAnswers: surahs.length - correct, timeSpent: timer, combo: 1, stars })
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={surahs.length} accuracy={accuracy} earnedBadges={badges} onRestart={() => { setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0); setSelected(null) }} onBack={() => {}} />
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center"><div className="text-3xl font-extrabold text-primary">{score}</div></div>
        <div className="text-center"><div className="text-2xl font-bold">{idx + 1}/{surahs.length}</div></div>
        <div className="text-center"><div className="text-3xl font-extrabold text-emerald-600">{timer}s</div></div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8"><div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / surahs.length) * 100}%` }} /></div>
      <div className="bg-white dark:bg-background rounded-2xl p-8 mb-8 text-center"><p className="text-foreground text-sm mb-4">{locale === 'ar' ? 'أي سورة يبدأ بهذه الآية؟' : 'Which Surah starts with this verse?'}</p><p className="text-xl italic text-primary font-bold">{surahs[idx].verse}</p></div>
      <div className="grid grid-cols-2 gap-3">{shuffled.map((name, i) => (<button key={i} onClick={() => handleAns(name)} className={`py-4 px-3 rounded-xl font-bold transition-all ${selected === name ? name === surahs[idx].name ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>{name}</button>))}</div>
    </div>
  )
}
