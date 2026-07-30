'use client'
import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { calculateStars, earnBadges } from '@/lib/games-engine'
import { audioSystem } from '@/lib/audio-system'
import { GameResults } from './GameResults'

const words = [
  { word: 'بسم', hint: 'بداية كل سورة' },
  { word: 'الله', hint: 'خالق كل شيء' },
  { word: 'رحمن', hint: 'صفة من صفات الله' },
  { word: 'قرآن', hint: 'كتاب الله' },
  { word: 'محمد', hint: 'اسم النبي' },
]

export function WordCompleteGame() {
  const { locale } = useI18n()
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [done])

  const handleSubmit = () => {
    const answer = input.trim()
    if (!answer) return

    if (answer === words[idx].word) {
      audioSystem.playCorrect()
      setFeedback('correct')
      setScore(s => s + 100)
      setCorrect(c => c + 1)
    } else {
      audioSystem.playError()
      setFeedback('incorrect')
    }

    setTimeout(() => {
      if (idx < words.length - 1) {
        setIdx(idx + 1)
        setInput('')
        setFeedback(null)
      } else {
        setDone(true)
      }
    }, 800)
  }

  if (done) {
    const accuracy = (correct / words.length) * 100
    const stars = calculateStars(accuracy)
    const badges = earnBadges({ totalPoints: score, correctAnswers: correct, incorrectAnswers: words.length - correct, timeSpent: timer, combo: 1, stars })
    return <GameResults score={score} stars={stars} timeSpent={timer} correctAnswers={correct} totalQuestions={words.length} accuracy={accuracy} earnedBadges={badges} onRestart={() => { setIdx(0); setScore(0); setCorrect(0); setDone(false); setTimer(0); setInput(''); setFeedback(null) }} onBack={() => {}} />
  }

  const currentWord = words[idx]
  const maskedWord = currentWord.word.split('').map((c, i) => i === 0 ? c : '_').join('')

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-center"><div className="text-3xl font-extrabold text-primary">{score}</div><div className="text-xs text-muted-foreground">{locale === 'ar' ? 'النقاط' : 'Points'}</div></div>
        <div className="text-center"><div className="text-2xl font-bold">{idx + 1}/{words.length}</div><div className="text-xs text-muted-foreground">{locale === 'ar' ? 'السؤال' : 'Question'}</div></div>
        <div className="text-center"><div className="text-3xl font-extrabold text-emerald-600">{timer}s</div><div className="text-xs text-muted-foreground">{locale === 'ar' ? 'الوقت' : 'Time'}</div></div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8"><div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / words.length) * 100}%` }} /></div>
      <div className="bg-white dark:bg-background rounded-2xl border-4 border-white p-12 mb-8 text-center shadow-lg">
        <div className="text-4xl font-bold mb-4 text-primary font-mono tracking-widest">{maskedWord}</div>
        <div className="text-lg font-semibold text-foreground">{locale === 'ar' ? 'التلميح:' : 'Hint:'} {currentWord.hint}</div>
      </div>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} className="w-full p-4 mb-4 border-2 border-primary/30 rounded-xl text-center text-lg font-bold" placeholder={locale === 'ar' ? 'اكتب الكلمة...' : 'Type the word...'} />
      <button onClick={handleSubmit} className={`w-full py-4 rounded-xl font-bold text-white transition-all ${feedback === 'correct' ? 'bg-emerald-500' : feedback === 'incorrect' ? 'bg-red-500' : 'bg-primary hover:bg-primary/90'}`}>{locale === 'ar' ? 'تحقق' : 'Submit'}</button>
    </div>
  )
}
