'use client'
import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const VERSE_DATA = [
  {
    id: 1,
    question: "أكمل الآية الكريمة: (إِنَّا أَعْطَيْنَاكَ ...)",
    correctAnswer: "الْكَوْثَرَ",
    options: [
      "الْكَوْثَرَ",
      "الْفَتْحَ",
      "النَّصْرَ",
      "الْحِكْمَةَ"
    ]
  },
  {
    id: 2,
    question: "أكمل الآية الكريمة: (قُلْ هُوَ اللَّهُ ...)",
    correctAnswer: "أَحَدٌ",
    options: [
      "أَحَدٌ",
      "الصَّمَدُ",
      "الْعَظِيمُ",
      "الرَّحْمَنُ"
    ]
  },
  {
    id: 3,
    question: "أكمل الآية الكريمة: (وَالْعَصْرِ * إِنَّ الْإِنْسَانَ لَفِي ...)",
    correctAnswer: "خُسْرٍ",
    options: [
      "خُسْرٍ",
      "نَعِيمٍ",
      "سُرُورٍ",
      "ضَلَالٍ"
    ]
  },
  {
    id: 4,
    question: "أكمل الآية الكريمة: (إِذَا جَاءَ نَصْرُ اللَّهِ وَ...)",
    correctAnswer: "الْفَتْحُ",
    options: [
      "الْفَتْحُ",
      "الْفَرْحُ",
      "الْخَيْرُ",
      "الْفَجْرُ"
    ]
  },
  {
    id: 5,
    question: "أكمل الآية الكريمة: (قُلْ أَعُوذُ بِرَبِّ ...)",
    correctAnswer: "الْفَلَقِ",
    options: [
      "الْفَلَقِ",
      "الْمَلِكِ",
      "الْعَالَمِينَ",
      "الرَّحْمَةِ"
    ]
  }
]

export function VerseMatchingGame() {
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
    return [...VERSE_DATA[idx].options].sort(() => Math.random() - 0.5)
  }, [idx])

  const handleAnswer = (answer: string) => {
    if (selected) return
    setSelected(answer)

    if (answer === VERSE_DATA[idx].correctAnswer) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < VERSE_DATA.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const accuracy = (correct / VERSE_DATA.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers: correct,
      incorrectAnswers: VERSE_DATA.length - correct,
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
        totalQuestions={VERSE_DATA.length}
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
          <div className="text-2xl font-bold">{idx + 1}/{VERSE_DATA.length}</div>
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
          style={{ width: `${((idx + 1) / VERSE_DATA.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-8 mb-8 shadow-lg">
        <p className="text-center text-lg font-bold mb-8 text-foreground leading-relaxed">{VERSE_DATA[idx].question}</p>
        
        <div className="grid grid-cols-1 gap-3">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`py-4 px-4 rounded-xl font-bold text-sm transition-all text-right ${
                selected === option
                  ? option === VERSE_DATA[idx].correctAnswer
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
