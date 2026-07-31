"use client"

import { useState, useMemo, memo, useCallback } from "react"
import { useI18n } from "@/lib/i18n"
import { Trophy, RotateCcw, CheckCircle2, XCircle, ChevronLeft, Star, Sparkles, Lightbulb } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const PROPHET_LIFE_QUIZ: Question[] = [
  {
    id: 1,
    question: "ما هو النسب الكامل للنبي صلى الله عليه وسلم حتى عدنان؟",
    options: ["محمد بن عبد الله بن عبد المطلب بن هاشم بن عبد مناف", "محمد بن عبد المطلب بن هاشم بن قصي بن كلاب", "محمد بن عبد الله بن هاشم بن عبد المطلب بن قصي", "محمد بن عبد الله بن عبد المطلب بن قصي بن هاشم"],
    correctAnswer: 0,
    explanation: "ينتهي نسب النبي صلى الله عليه وسلم الشريف إلى عدنان من ولد إسماعيل بن إبراهيم عليهما السلام، وهاشم هو الذي يعود إليه نسب القرشيين التكريمي."
  },
  {
    id: 2,
    question: "من هي المرضعة التي أرضعت النبي صلى الله عليه وسلم في بادية بني سعد؟",
    options: ["ثويبة مولاة أبي لهب", "حليمة السعدية", "أم أيمن", "شفاء أم عبد الرحمن"],
    correctAnswer: 1,
    explanation: "كان من عادة عرب مكة إرسال أبنائهم للبادية لنقاء هوائها وفصاحة لسان أهلها، وقد حلّت البركة على بيت حليمة السعدية ورضيعها منذ قدوم النبي."
  },
  {
    id: 3,
    question: "كم كان عمر النبي صلى الله عليه وسلم عندما توفيت أمه آمنة بنت وهب؟",
    options: ["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات"],
    correctAnswer: 1,
    explanation: "توفيت أمه آمنة في طريق عودتها من المدينة (الأبواء)، فكفله بعد ذلك جده عبد المطلب وحاطه برعايته وعطفه."
  },
  {
    id: 4,
    question: "من هي آخر زوجات النبي صلى الله عليه وسلم وفاةً؟",
    options: ["عائشة بنت أبي بكر", "أم سلمة (هند بنت أبي أمية)", "سودة بنت زمعة", "ميمونة بنت الحارث"],
    correctAnswer: 1,
    explanation: "توفيت أم المؤمنين أم سلمة رضي الله عنها سنة 61 هجرية، وكانت من أرجح النساء عقلاً ورأياً وتجلت حكَمْتها في صلح الحديبية."
  },
  {
    id: 5,
    question: "كم عدد أبناء وبنات النبي صلى الله عليه وسلم جميعاً ومن هي أم معظمهم؟",
    options: ["6 أبناء - أمهم عائشة", "7 أبناء - أمهم خديجة (عدا إبراهيم)", "5 أبناء - أمهم مارية القبطية", "8 أبناء - أمهم سودة بنت زمعة"],
    correctAnswer: 1,
    explanation: "رزق النبي بـ 3 ذكور (القاسم، عبد الله، إبراهيم) و 4 إناث (زينب، رقية، أم كلثوم، فاطمة)، وكلهم من خديجة رضي الله عنها باستثناء إبراهيم من مارية القبطية."
  },
  {
    id: 6,
    question: "من هي ابنته التي لقبت بـ 'أم أبيها' و 'سيدة نساء أهل الجنة'؟",
    options: ["رقية رضي الله عنها", "زينب رضي الله عنها", "فاطمة الزهراء رضي الله عنها", "أم كلثوم رضي الله عنها"],
    correctAnswer: 2,
    explanation: "لقبت فاطمة بـ 'أم أبيها' لشدة عنايتها ورعايتها بأبيها النبي صلى الله عليه وسلم بعد وفاة أمها خديجة."
  },
  {
    id: 7,
    question: "من هي زوجة النبي صلى الله عليه وسلم التي كانت تسمى 'أُم المساكين' لشدة كرمها؟",
    options: ["زينب بنت خزيمة", "زينب بنت جحش", "جويرية بنت الحارث", "صفية بنت حيي"],
    correctAnswer: 0,
    explanation: "سميت زينب بنت خزيمة بـ 'أم المساكين' في الجاهلية والإسلام لكثرة إطعامها للمساكين وصدقتها عليهم، ولم تلبث عند النبي إلا أشهراً قليلة حتى توفيت."
  },
  {
    id: 8,
    question: "ما هو الحلف الذي شهده النبي صلى الله عليه وسلم قبل البعثة وقال عنه 'لو دُعيت به في الإسلام لأجبت'؟",
    options: ["حلف الفضول", "حلف المطيبين", "حلف الأحابيش", "حلف العقبة"],
    correctAnswer: 0,
    explanation: "حلف الفضول كان معاهدة لنصرة المظلوم في مكة وأخذ الحق له مهما كان ضعيفاً، وهو دليل على القيم الأخلاقية العالية قبل الإسلام."
  },
  {
    id: 9,
    question: "من هو ابن النبي صلى الله عليه وسلم الذي كانت أمه مارية القبطية؟",
    options: ["القاسم", "عبد الله", "إبراهيم", "الطاهر"],
    correctAnswer: 2,
    explanation: "ولد إبراهيم بالمدينة المنورة وتوفي صغيراً، وبكى عليه النبي وقال: 'إن العين تدمع والقلب يحزن ولا نقول إلا ما يرضي ربنا'."
  },
  {
    id: 10,
    question: "كم كان سن النبي صلى الله عليه وسلم عندما نزل عليه الوحي لأول مرة في غار حراء؟",
    options: ["35 سنة", "40 سنة", "43 سنة", "45 سنة"],
    correctAnswer: 1,
    explanation: "نزل جبريل عليه السلام بأول آيات سورة العلق (اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ) وكان عمر النبي حينها أربعين سنة."
  }
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const ProphetLifeQuiz = memo(function ProphetLifeQuiz() {
  const { locale } = useI18n()
  const [shuffledQuestions] = useState(() => shuffleArray(PROPHET_LIFE_QUIZ))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const currentQuestion = shuffledQuestions[currentIndex]
  const totalQuestions = shuffledQuestions.length

  const handleAnswer = useCallback((index: number) => {
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === shuffledQuestions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 10)
    }
  }, [currentIndex, shuffledQuestions])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setGameOver(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }, [currentIndex, totalQuestions])

  const restartGame = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setAnswered(false)
    setGameOver(false)
  }

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
            {locale === "ar" ? "حياة النبي" : locale === "en" ? "Prophet's Life" : "Vie du Prophète"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "ar" ? "تعلم عن نسبه وزوجاته وأولاده" : "Learn about his lineage, wives, and children"}
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
                {currentQuestion.question}
              </h3>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              let optionStyle = "bg-muted/50 border-border text-foreground hover:bg-primary/10 hover:border-primary/30"

              if (answered) {
                if (idx === currentQuestion.correctAnswer) {
                  optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-100"
                } else if (idx === selectedAnswer && idx !== currentQuestion.correctAnswer) {
                  optionStyle = "bg-red-50 border-red-500 text-red-800 dark:bg-red-950 dark:border-red-700 dark:text-red-100"
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
                    answered && idx === currentQuestion.correctAnswer
                      ? "bg-emerald-500 text-white"
                      : answered && idx === selectedAnswer
                        ? "bg-red-500 text-white"
                        : "bg-card text-foreground border border-border"
                  }`}>
                    {answered && idx === currentQuestion.correctAnswer ? (
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

          {/* Explanation Box */}
          {answered && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-lg p-4 mb-6 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-1">
                  {locale === "ar" ? "معلومة مهمة:" : "Important Info:"}
                </p>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Feedback + Next */}
          {answered && (
            <div className="flex items-center justify-between">
              <p className={`font-bold ${selectedAnswer === currentQuestion.correctAnswer ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {selectedAnswer === currentQuestion.correctAnswer
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
            {locale === "ar" ? "انتهت المسابقة!" : "Quiz Complete!"}
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
})
