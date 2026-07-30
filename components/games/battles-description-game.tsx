'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const BATTLES_DESCRIPTIONS = [
  {
    id: 1,
    question: "ما هي أول معركة فاصلة ينتصر فيها المسلمون وسُميت بـ (يوم الفرقان)؟",
    correctAnswer: "غزوة بدر",
    options: ["غزوة بدر", "غزوة أحد", "غزوة حنين", "غزوة خيبر"]
  },
  {
    id: 2,
    question: "في أي غزوة حفر المسلمون خندقاً لحماية المدينة باقتراح من سلمان الفارسي؟",
    correctAnswer: "غزوة الخندق (الأحزاب)",
    options: ["غزوة الخندق (الأحزاب)", "غزوة بدر", "غزوة تبوك", "غزوة مؤتة"]
  },
  {
    id: 3,
    question: "ما هي الغزوة التي وقعت عند جبل أحد وشهدت ثبات النبي وموقف الرماة؟",
    correctAnswer: "غزوة أحد",
    options: ["غزوة أحد", "غزوة بدر", "غزوة خيبر", "غزوة تبوك"]
  },
  {
    id: 4,
    question: "ما هي الغزوة التي سُميت بغزوة (العُسرة) وخرج فيها المسلمون في حر شديد؟",
    correctAnswer: "غزوة تبوك",
    options: ["غزوة تبوك", "غزوة الخندق", "غزوة بدر", "غزوة حنين"]
  },
  {
    id: 5,
    question: "ما هي الغزوة التي فتح فيها المسلمون حصون اليهود وقاد فيها علي بن أبي طالب الراية؟",
    correctAnswer: "غزوة خيبر",
    options: ["غزوة خيبر", "غزوة أحد", "غزوة بدر", "غزوة مؤتة"]
  }
]

export function BattlesDescriptionGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const shuffledOptions = useMemo(() => {
    return [...BATTLES_DESCRIPTIONS[idx].options].sort(() => Math.random() - 0.5)
  }, [idx])

  const handleAns = (answer: string) => {
    if (selected) return
    setSelected(answer)
    
    if (answer === BATTLES_DESCRIPTIONS[idx].correctAnswer) { 
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }
    
    setTimeout(() => {
      if (idx < BATTLES_DESCRIPTIONS.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const stars = calculateStars((correct / BATTLES_DESCRIPTIONS.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: BATTLES_DESCRIPTIONS.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={BATTLES_DESCRIPTIONS.length} accuracy={(correct/BATTLES_DESCRIPTIONS.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{BATTLES_DESCRIPTIONS.length}</div>
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
          style={{ width: `${((idx + 1) / BATTLES_DESCRIPTIONS.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-8 mb-8 shadow-lg">
        <p className="text-center text-lg font-bold mb-6 text-foreground">{BATTLES_DESCRIPTIONS[idx].question}</p>
        <div className="grid grid-cols-2 gap-3">
          {shuffledOptions.map((option) => (
            <button 
              key={option}
              onClick={() => handleAns(option)} 
              disabled={selected !== null}
              className={`py-4 px-3 rounded-xl font-bold text-sm transition-all ${
                selected === option
                  ? option === BATTLES_DESCRIPTIONS[idx].correctAnswer
                    ? 'bg-emerald-500 text-white scale-105'
                    : 'bg-red-500 text-white scale-95'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95'
              } disabled:opacity-50`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
