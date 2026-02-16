"use client"

import { useState, useCallback } from "react"
import { useI18n } from "@/lib/i18n"
import { Trophy, RotateCcw, CheckCircle2, XCircle, ChevronLeft, Star, Sparkles } from "lucide-react"

interface Question {
  question: Record<string, string>
  options: Record<string, string[]>
  correctIndex: number
}

const questions: Question[] = [
  {
    question: { ar: "كم عدد سور القرآن الكريم؟", en: "How many Surahs are in the Quran?", fr: "Combien de sourates dans le Coran?" },
    options: { ar: ["110 سورة", "114 سورة", "120 سورة", "112 سورة"], en: ["110", "114", "120", "112"], fr: ["110", "114", "120", "112"] },
    correctIndex: 1,
  },
  {
    question: { ar: "ما هي أطول سورة في القرآن؟", en: "What is the longest Surah in the Quran?", fr: "Quelle est la plus longue sourate?" },
    options: { ar: ["آل عمران", "البقرة", "النساء", "المائدة"], en: ["Al-Imran", "Al-Baqarah", "An-Nisa", "Al-Ma'idah"], fr: ["Al-Imran", "Al-Baqarah", "An-Nisa", "Al-Ma'idah"] },
    correctIndex: 1,
  },
  {
    question: { ar: "ما هي أقصر سورة في القرآن؟", en: "What is the shortest Surah?", fr: "Quelle est la plus courte sourate?" },
    options: { ar: ["الإخلاص", "الفلق", "الكوثر", "الناس"], en: ["Al-Ikhlas", "Al-Falaq", "Al-Kawthar", "An-Nas"], fr: ["Al-Ikhlas", "Al-Falaq", "Al-Kawthar", "An-Nas"] },
    correctIndex: 2,
  },
  {
    question: { ar: "كم عدد أجزاء القرآن الكريم؟", en: "How many Juz are in the Quran?", fr: "Combien de Juz dans le Coran?" },
    options: { ar: ["25 جزء", "28 جزء", "30 جزء", "32 جزء"], en: ["25", "28", "30", "32"], fr: ["25", "28", "30", "32"] },
    correctIndex: 2,
  },
  {
    question: { ar: "ما اسم السورة التي تسمى قلب القرآن؟", en: "Which Surah is called the heart of the Quran?", fr: "Quelle sourate est le coeur du Coran?" },
    options: { ar: ["الرحمن", "يس", "الملك", "الواقعة"], en: ["Ar-Rahman", "Yaseen", "Al-Mulk", "Al-Waqi'ah"], fr: ["Ar-Rahman", "Yaseen", "Al-Mulk", "Al-Waqi'ah"] },
    correctIndex: 1,
  },
  {
    question: { ar: "في أي سورة وردت آية الكرسي؟", en: "In which Surah is Ayat Al-Kursi?", fr: "Dans quelle sourate se trouve Ayat Al-Kursi?" },
    options: { ar: ["آل عمران", "النساء", "البقرة", "المائدة"], en: ["Al-Imran", "An-Nisa", "Al-Baqarah", "Al-Ma'idah"], fr: ["Al-Imran", "An-Nisa", "Al-Baqarah", "Al-Ma'idah"] },
    correctIndex: 2,
  },
  {
    question: { ar: "كم مرة ذُكر اسم النبي محمد في القرآن؟", en: "How many times is Prophet Muhammad mentioned?", fr: "Combien de fois le Prophete Muhammad est mentionne?" },
    options: { ar: ["3 مرات", "4 مرات", "5 مرات", "6 مرات"], en: ["3", "4", "5", "6"], fr: ["3", "4", "5", "6"] },
    correctIndex: 1,
  },
  {
    question: { ar: "ما هي السورة التي لا تبدأ بالبسملة؟", en: "Which Surah does not start with Bismillah?", fr: "Quelle sourate ne commence pas par Bismillah?" },
    options: { ar: ["الفاتحة", "البقرة", "التوبة", "يوسف"], en: ["Al-Fatiha", "Al-Baqarah", "At-Tawbah", "Yusuf"], fr: ["Al-Fatiha", "Al-Baqarah", "At-Tawbah", "Yusuf"] },
    correctIndex: 2,
  },
  {
    question: { ar: "كم عدد السجدات في القرآن الكريم؟", en: "How many prostrations (Sujud) are in the Quran?", fr: "Combien de prosternations dans le Coran?" },
    options: { ar: ["12 سجدة", "13 سجدة", "14 سجدة", "15 سجدة"], en: ["12", "13", "14", "15"], fr: ["12", "13", "14", "15"] },
    correctIndex: 3,
  },
  {
    question: { ar: "ما هي السورة الملقبة بعروس القرآن؟", en: "Which Surah is called the Bride of the Quran?", fr: "Quelle sourate est la Mariee du Coran?" },
    options: { ar: ["الرحمن", "يس", "الكهف", "مريم"], en: ["Ar-Rahman", "Yaseen", "Al-Kahf", "Maryam"], fr: ["Ar-Rahman", "Yaseen", "Al-Kahf", "Maryam"] },
    correctIndex: 0,
  },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function QuranQuizGame() {
  const { locale } = useI18n()
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleArray(questions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const currentQuestion = shuffledQuestions[currentIndex]
  const totalQuestions = shuffledQuestions.length

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === currentQuestion.correctIndex) {
      setScore((prev) => prev + 10)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setGameOver(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  const restartGame = useCallback(() => {
    setShuffledQuestions(shuffleArray(questions))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setAnswered(false)
    setGameOver(false)
  }, [])

  const getStars = () => {
    const percentage = (score / (totalQuestions * 10)) * 100
    if (percentage >= 90) return 5
    if (percentage >= 70) return 4
    if (percentage >= 50) return 3
    if (percentage >= 30) return 2
    return 1
  }

  return (
    <div className="bg-card rounded-3xl border border-border p-6 lg:p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === "ar" ? "مسابقة قرآنية" : locale === "en" ? "Quran Quiz" : "Quiz coranique"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "ar" ? "اختبر معلوماتك القرآنية" : locale === "en" ? "Test your Quranic knowledge" : "Testez vos connaissances coraniques"}
          </p>
        </div>
        <button
          onClick={restartGame}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          {locale === "ar" ? "إعادة" : "Restart"}
        </button>
      </div>

      {!gameOver ? (
        <>
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {locale === "ar" ? `السؤال ${currentIndex + 1} من ${totalQuestions}` : `Question ${currentIndex + 1} of ${totalQuestions}`}
              </span>
              <span className="text-sm font-bold text-primary">
                {locale === "ar" ? `النقاط: ${score}` : `Score: ${score}`}
              </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-primary/5 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground leading-relaxed">
                {currentQuestion.question[locale]}
              </h3>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-6">
            {currentQuestion.options[locale].map((option, idx) => {
              let optionStyle = "bg-muted/50 border-border text-foreground hover:bg-primary/10 hover:border-primary/30"

              if (answered) {
                if (idx === currentQuestion.correctIndex) {
                  optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-800"
                } else if (idx === selectedAnswer && idx !== currentQuestion.correctIndex) {
                  optionStyle = "bg-red-50 border-red-500 text-red-800"
                } else {
                  optionStyle = "bg-muted/30 border-border text-muted-foreground opacity-60"
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-start transition-all ${optionStyle} ${!answered ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                    answered && idx === currentQuestion.correctIndex
                      ? "bg-emerald-500 text-white"
                      : answered && idx === selectedAnswer
                        ? "bg-red-500 text-white"
                        : "bg-card text-foreground border border-border"
                  }`}>
                    {answered && idx === currentQuestion.correctIndex ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : answered && idx === selectedAnswer ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </button>
              )
            })}
          </div>

          {/* Feedback + Next */}
          {answered && (
            <div className="flex items-center justify-between">
              <p className={`font-bold ${selectedAnswer === currentQuestion.correctIndex ? "text-emerald-600" : "text-red-600"}`}>
                {selectedAnswer === currentQuestion.correctIndex
                  ? (locale === "ar" ? "إجابة صحيحة!" : "Correct!")
                  : (locale === "ar" ? "إجابة خاطئة!" : "Wrong!")}
              </p>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all"
              >
                {currentIndex + 1 >= totalQuestions
                  ? (locale === "ar" ? "عرض النتيجة" : "Show Result")
                  : (locale === "ar" ? "التالي" : "Next")}
                <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Results Screen */
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-6">
            <Trophy className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-3xl font-extrabold text-foreground mb-2">
            {locale === "ar" ? "انتهت المسابقة!" : locale === "en" ? "Quiz Complete!" : "Quiz termine!"}
          </h3>
          <p className="text-xl text-muted-foreground mb-4">
            {locale === "ar"
              ? `حصلت على ${score} من ${totalQuestions * 10} نقطة`
              : `You scored ${score} out of ${totalQuestions * 10} points`}
          </p>
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-8 h-8 ${s <= getStars() ? "text-secondary fill-secondary" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
          <p className="text-foreground font-bold mb-6">
            {getStars() >= 4
              ? (locale === "ar" ? "ما شاء الله! ممتاز جداً!" : "Excellent!")
              : getStars() >= 3
                ? (locale === "ar" ? "أحسنت! جيد جداً!" : "Well done!")
                : (locale === "ar" ? "حاول مرة أخرى للتحسين!" : "Try again to improve!")}
          </p>
          <button
            onClick={restartGame}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all"
          >
            {locale === "ar" ? "حاول مرة أخرى" : "Try Again"}
          </button>
        </div>
      )}
    </div>
  )
}
