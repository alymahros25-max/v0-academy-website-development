'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

export interface QuizQuestion {
  question: string | React.ReactNode
  options: string[]
  correct: string
}

export interface UniversalQuizGameProps {
  title: string
  titleAr: string
  questions: QuizQuestion[]
  gradient: string
}

export function UniversalQuizGame({ title, titleAr, questions, gradient }: UniversalQuizGameProps) {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [shuffled, setShuffled] = useState<string[]>([])

  useEffect(() => {
    setShuffled([...questions[idx].options].sort(() => Math.random() - 0.5))
  }, [idx, questions])

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [done])

  const handleAnswer = (answer: string) => {
    setSelected(answer)
    if (answer === questions[idx].correct) {
      audioSystem.playCorrect()
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
    }

    setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 500)
  }

  if (done) {
    const accuracy = (correct / questions.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({
      totalPoints: score,
      correctAnswers: correct,
      incorrectAnswers: questions.length - correct,
      timeSpent: timer,
      combo: 1,
      stars,
    })
    return (
      <GameResults
        score={score}
        stars={stars}
        timeSpent={timer}
        correctAnswers={correct}
        totalQuestions={questions.length}
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

  const currentQuestion = questions[idx]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{idx + 1}/{questions.length}</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'السؤال' : 'Question'}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-emerald-600">{timer}s</div>
          <div className="text-xs text-muted-foreground">{locale === 'ar' ? 'الوقت' : 'Time'}</div>
        </div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className={`bg-gradient-to-br ${gradient} rounded-2xl border-4 border-white p-8 mb-8 shadow-lg`}>
        <div className="text-white text-xl font-bold text-center">
          {typeof currentQuestion.question === 'string' ? currentQuestion.question : currentQuestion.question}
        </div>
      </div>

      <div className="space-y-3">
        {shuffled.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            disabled={selected !== null}
            className={`w-full py-4 px-4 rounded-xl font-bold text-sm transition-all ${
              selected === option
                ? option === currentQuestion.correct
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
  )
}
