'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const BIOGRAPHY_EVENTS = [
  {
    id: 1,
    question: "أين ولد النبي محمد صلى الله عليه وسلم؟",
    correctAnswer: "في مكة المكرمة",
    options: ["في مكة المكرمة", "في المدينة المنورة", "في الطائف", "في القدس"]
  },
  {
    id: 2,
    question: "ما الحدث العظيم الذي حدث في عام الفيل؟",
    correctAnswer: "مولد النبي صلى الله عليه وسلم",
    options: ["مولد النبي صلى الله عليه وسلم", "الهجرة إلى المدينة", "نزول القرآن", "فتح مكة"]
  },
  {
    id: 3,
    question: "كم كان عمر النبي صلى الله عليه وسلم عندما نزل عليه الوحي أول مرة؟",
    correctAnswer: "40 سنة",
    options: ["40 سنة", "25 سنة", "30 سنة", "50 سنة"]
  },
  {
    id: 4,
    question: "إلى أين كانت هجرة المسلمين الأولى والرئيسية التي بدأ منها التقويم الهجري؟",
    correctAnswer: "إلى المدينة المنورة",
    options: ["إلى المدينة المنورة", "إلى الحبشة", "إلى الشام", "إلى اليمن"]
  },
  {
    id: 5,
    question: "ما هي آخر حجة حَجَّها النبي صلى الله عليه وسلم وودّع فيها المسلمين؟",
    correctAnswer: "حجة الوداع",
    options: ["حجة الوداع", "حجة الفتح", "حجة الإيمان", "حجة البلاغ"]
  }
]

export function SiraEventsGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  
  useEffect(() => { const t = setInterval(() => setTimer(t => t + 1), 1000); return () => clearInterval(t) }, [done])

  const shuffledOptions = useMemo(() => {
    return [...BIOGRAPHY_EVENTS[idx].options].sort(() => Math.random() - 0.5)
  }, [idx])

  const handleAns = (answer: string) => {
    if (selected) return
    setSelected(answer)
    
    if (answer === BIOGRAPHY_EVENTS[idx].correctAnswer) { 
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }
    
    setTimeout(() => {
      if (idx < BIOGRAPHY_EVENTS.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const stars = calculateStars((correct / BIOGRAPHY_EVENTS.length) * 100)
    const badges = earnBadges({totalPoints: score, correctAnswers: correct, incorrectAnswers: BIOGRAPHY_EVENTS.length - correct, timeSpent: timer, combo: 1, stars})
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={BIOGRAPHY_EVENTS.length} accuracy={(correct/BIOGRAPHY_EVENTS.length)*100} earnedBadges={badges} onRestart={() => {setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0)}} onBack={() => {}} />
  }
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{BIOGRAPHY_EVENTS.length}</div>
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
          style={{ width: `${((idx + 1) / BIOGRAPHY_EVENTS.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-8 mb-8 shadow-lg">
        <p className="text-center text-lg font-bold mb-6 text-foreground">{BIOGRAPHY_EVENTS[idx].question}</p>
        <div className="grid grid-cols-2 gap-3">
          {shuffledOptions.map((option) => (
            <button 
              key={option}
              onClick={() => handleAns(option)} 
              disabled={selected !== null}
              className={`py-4 px-3 rounded-xl font-bold text-sm transition-all ${
                selected === option
                  ? option === BIOGRAPHY_EVENTS[idx].correctAnswer
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
