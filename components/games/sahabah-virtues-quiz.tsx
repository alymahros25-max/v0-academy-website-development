"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Trophy, RotateCcw, CheckCircle2, XCircle, ChevronLeft, Star, Sparkles, Lightbulb } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const SAHABAH_VIRTUES_QUIZ: Question[] = [
  {
    id: 1,
    question: "من هو الصحابي الذي نزل جبريل عليه السلام على صورته في كثير من الأحيان؟",
    options: ["دحية الكلبي", "مصعب بن عمير", "عثمان بن عفان", "المقداد بن الأسود"],
    correctAnswer: 0,
    explanation: "كان دحية الكلبي رضي الله عنه من أجمل الصحابة صورة وشكلاً، وكان جبريل يتشبه بصورته عند نزوله بالوحي أحياناً."
  },
  {
    id: 2,
    question: "من هو الصحابي الجليل الملقب بـ 'حبر الأمة وترجمان القرآن'؟",
    options: ["عبد الله بن مسعود", "عبد الله بن عباس", "عبد الله بن عمر", "عبد الله بن عمرو بن العاص"],
    correctAnswer: 1,
    explanation: "دعا له النبي صلى الله عليه وسلم بقوله: 'اللهم فقهه في الدين وعلمه التأويل'، فأصبح مرجع الصحابة والتابعين في تفسير القرآن."
  },
  {
    id: 3,
    question: "من هو الصحابي الذي اشترى بئر روما وتبرع بها للمسلمين وجَهَّز جيش العسرة؟",
    options: ["أبو بكر الصديق", "عبد الرحمن بن عوف", "عثمان بن عفان", "طلحة بن عبيد الله"],
    correctAnswer: 2,
    explanation: "ضرب عثمان بن عفان أروع الأمثلة في الإنفاق في سبيل الله، وقال عنه النبي يوم جيش العسرة: 'ما ضرّ عثمان ما عمل بعد اليوم'."
  },
  {
    id: 4,
    question: "من هو الصحابي الذي أطلق عليه النبي صلى الله عليه وسلم لقب 'حواريّ الرسول'؟",
    options: ["الزبير بن العوام", "طلحة بن عبيد الله", "سعد بن أبي وقاص", "سعيد بن زيد"],
    correctAnswer: 0,
    explanation: "قال النبي صلى الله عليه وسلم: 'إن لكل نبي حوارياً، وحواريَّ الزبير بن العوام'، والحواري هو الناصر والمخلص."
  },
  {
    id: 5,
    question: "من هو الصحابي الذي تستحي منه الملائكة كما أخبر النبي صلى الله عليه وسلم؟",
    options: ["أبو بكر الصديق", "عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب"],
    correctAnswer: 2,
    explanation: "عرف عثمان بن عفان بقلة كلامه وشدة حياءه وعظم أدبه، حتى قال عنه النبي: 'ألا أستحي من رجل تستحي منه الملائكة'."
  },
  {
    id: 6,
    question: "من هو أول من أطلق سهماً في سبيل الله في الإسلام؟",
    options: ["سعد بن أبي وقاص", "خالد بن الوليد", "حمزة بن عبد المطلب", "أبو دجانة"],
    correctAnswer: 0,
    explanation: "سعد بن أبي وقاص هو أحد العشرة المبشرين بالجنة، وكان النبي يفتخر به ويقول: 'هذا خالي فليرني امرؤ خاله'."
  },
  {
    id: 7,
    question: "من هو الصحابي الذي قال عنه النبي صلى الله عليه وسلم 'أعلم أمتي بالحلال والحرام'؟",
    options: ["معاذ بن جبل", "أبي بن كعب", "زيد بن ثابت", "أبو الدرداء"],
    correctAnswer: 0,
    explanation: "كان معاذ بن جبل إماماً في العلم والفقيه الشاب الذي بعثه النبي إلى اليمن ليعلم الناس الدين والأحكام."
  },
  {
    id: 8,
    question: "من هو الصحابي الملقب بـ 'سفير الإسلام' والذي أرسله النبي للمدينة قبل الهجرة؟",
    options: ["مصعب بن عمير", "جعفر بن أبي طالب", "عثمان بن مظعون", "الأرقم بن أبي الأرقم"],
    correctAnswer: 0,
    explanation: "ترك مصعب نعيم مكة ورفاهيتها وذهب للمدينة داعياً للإسلام، فاستطاع بحسن أخلاقه أن يدخل الإسلام إلى معظم بيوت الأوس والخزرج."
  },
  {
    id: 9,
    question: "من هو الصحابي الذي غسلته الملائكة عند استشهاده في غزوة أحد؟",
    options: ["حنظلة بن أبي عامر", "حمزة بن عبد المطلب", "مصعب بن عمير", "عبد الله بن حرام"],
    correctAnswer: 0,
    explanation: "خرج حنظلة رضي الله عنه للجهاد في أحد فور سماعه المنادي وهو جُنُب، فاستشهد وغسلته الملائكة بين السماء والأرض."
  },
  {
    id: 10,
    question: "من هو الصحابي الذي اقترح على النبي صلى الله عليه وسلم حفر الخندق في غزوة الأحزاب؟",
    options: ["سلمان الفارسي", "عمار بن ياسر", "أبو ذر الغفاري", "حذيفة بن اليمان"],
    correctAnswer: 0,
    explanation: "كان حفر الخندق خطة عسكرية مكينة أخذ بها النبي من مشورة سلمان الفارسي برأيه الثاقب المستفاد من خبرة الفارس."
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

export function SahabahVirtuesQuiz() {
  const { locale } = useI18n()
  const [shuffledQuestions] = useState(() => shuffleArray(SAHABAH_VIRTUES_QUIZ))
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
    if (index === currentQuestion.correctAnswer) {
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
            {locale === "ar" ? "مناقب الصحابة" : locale === "en" ? "Sahabah Virtues" : "Vertus des Sahaba"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "ar" ? "تعلم عن مواقف وفضائل الصحابة الكرام" : "Learn about the virtues and stories of the Sahaba"}
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
}
