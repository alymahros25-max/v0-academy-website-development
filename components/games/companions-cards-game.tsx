'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const COMPANIONS_DATA = [
  {
    id: 1,
    question: "من هو الصحابي الملقب بـ (أبو بكر الصديق) وما هي أبرز صفاته؟",
    correctAnswer: "أول الخلفاء الراشدين ورفيق النبي في الهجرة",
    options: [
      "أول الخلفاء الراشدين ورفيق النبي في الهجرة",
      "أول من أذن في الإسلام",
      "لقب بسيف الله المسلول",
      "أمين هذه الأمة"
    ]
  },
  {
    id: 2,
    question: "من هو الصحابي الملقب بـ (فاروق الأمة)؟",
    correctAnswer: "عمر بن الخطاب رضي الله عنه",
    options: [
      "عمر بن الخطاب رضي الله عنه",
      "عثمان بن عفان رضي الله عنه",
      "علي بن أبي طالب رضي الله عنه",
      "خالد بن الوليد رضي الله عنه"
    ]
  },
  {
    id: 3,
    question: "من هو الصحابي الملقب بـ (ذو النورين)؟",
    correctAnswer: "عثمان بن عفان رضي الله عنه",
    options: [
      "عثمان بن عفان رضي الله عنه",
      "أبو عبيدة بن الجراح رضي الله عنه",
      "بلال بن رباح رضي الله عنه",
      "سعد بن أبي وقاص رضي الله عنه"
    ]
  },
  {
    id: 4,
    question: "من هو مؤذن الرسول صلى الله عليه وسلم والأول في الأذان؟",
    correctAnswer: "بلال بن رباح رضي الله عنه",
    options: [
      "بلال بن رباح رضي الله عنه",
      "عبد الله بن مسعود رضي الله عنه",
      "أبو هريرة رضي الله عنه",
      "سلمان الفارسي رضي الله عنه"
    ]
  },
  {
    id: 5,
    question: "من هو الصحابي الملقب بـ (سيف الله المسلول)؟",
    correctAnswer: "خالد بن الوليد رضي الله عنه",
    options: [
      "خالد بن الوليد رضي الله عنه",
      "حمزة بن عبد المطلب رضي الله عنه",
      "الزبير بن العوام رضي الله عنه",
      "طلحة بن عبيد الله رضي الله عنه"
    ]
  }
]

export function CompanionsCardsGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(t)
  }, [done])

  const shuffledOptions = useMemo(() => {
    return [...COMPANIONS_DATA[idx].options].sort(() => Math.random() - 0.5)
  }, [idx])

  const handleAnswer = (answer: string) => {
    if (selected) return
    setSelected(answer)

    if (answer === COMPANIONS_DATA[idx].correctAnswer) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < COMPANIONS_DATA.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const accuracy = (correct / COMPANIONS_DATA.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers: correct,
      incorrectAnswers: COMPANIONS_DATA.length - correct,
      timeSpent: timer,
      combo: 1,
      stars
    })

    return (
      <GameResults
        score={score}
        stars={stars}
        timeSpent={timer}
        correctAnswers={correct}
        totalQuestions={COMPANIONS_DATA.length}
        accuracy={accuracy}
        earnedBadges={badges}
        onRestart={() => {
          setIdx(0)
          setScore(0)
          setCorrect(0)
          setDone(false)
          setTimer(0)
          setSelected(null)
        }}
        onBack={() => {}}
      />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{COMPANIONS_DATA.length}</div>
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
          style={{ width: `${((idx + 1) / COMPANIONS_DATA.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-8 mb-8 shadow-lg">
        <p className="text-center text-lg font-bold mb-8 text-foreground">{COMPANIONS_DATA[idx].question}</p>
        
        <div className="grid grid-cols-1 gap-3">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`py-4 px-4 rounded-xl font-bold text-sm transition-all text-right ${
                selected === option
                  ? option === COMPANIONS_DATA[idx].correctAnswer
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
