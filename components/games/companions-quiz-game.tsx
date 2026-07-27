'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { GameResults } from './GameResults'

const COMPANIONS = [
  {
    name: 'أبو بكر الصديق',
    desc: 'أول الخلفاء الراشدين، عمره 50 سنة عندما أسلم',
    choices: ['أبو بكر الصديق', 'عمر بن الخطاب', 'عثمان بن عفان'],
  },
  {
    name: 'عمر بن الخطاب',
    desc: 'الخليفة الثاني، قوي الشخصية، اشتهر بالعدل',
    choices: ['عمر بن الخطاب', 'علي بن أبي طالب', 'أبو بكر الصديق'],
  },
  {
    name: 'علي بن أبي طالب',
    desc: 'ابن عم الرسول، الخليفة الرابع، معروف بشجاعته',
    choices: ['علي بن أبي طالب', 'الزبير بن العوام', 'طلحة بن عبيدالله'],
  },
  {
    name: 'خديجة بنت خويلد',
    desc: 'زوجة الرسول، أول من آمن به، أم المؤمنين',
    choices: ['خديجة بنت خويلد', 'عائشة بنت أبي بكر', 'أم سلمة'],
  },
  {
    name: 'بلال بن رباح',
    desc: 'الحبشي، أول مؤذن في الإسلام، معروف بصوته الجميل',
    choices: ['بلال بن رباح', 'عمار بن ياسر', 'سلمان الفارسي'],
  },
]

export function CompanionsQuizGame() {
  const { locale } = useI18n()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const handleAnswer = (answer: string) => {
    if (answered) return
    setSelected(answer)
    setAnswered(true)

    if (answer === COMPANIONS[currentQuestion].name) {
      setScore((s) => s + 12)
    }

    setTimeout(() => {
      if (currentQuestion < COMPANIONS.length - 1) {
        setCurrentQuestion((q) => q + 1)
        setSelected(null)
        setAnswered(false)
      } else {
        setGameOver(true)
      }
    }, 1000)
  }

  if (gameOver) {
    return (
      <GameResults
        gameId="companions-quiz-1"
        score={score}
        maxScore={COMPANIONS.length * 12}
        onRestart={() => {
          setCurrentQuestion(0)
          setScore(0)
          setGameOver(false)
          setSelected(null)
          setAnswered(false)
        }}
      />
    )
  }

  const companion = COMPANIONS[currentQuestion]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm opacity-90">{locale === 'ar' ? 'السؤال' : 'Question'}</p>
            <p className="text-2xl font-bold">
              {currentQuestion + 1} / {COMPANIONS.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">{locale === 'ar' ? 'النقاط' : 'Score'}</p>
            <p className="text-3xl font-bold">{score}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 mb-6 text-center">
        <p className="text-muted-foreground mb-4">
          {locale === 'ar' ? 'من هذا الصحابي؟' : 'Who is this companion?'}
        </p>
        <p className="text-lg italic text-primary mb-6 leading-relaxed">
          "{companion.desc}"
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {companion.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(choice)}
            disabled={answered}
            className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
              selected === choice
                ? choice === companion.name
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-muted hover:bg-primary/10'
            } disabled:opacity-50`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}
