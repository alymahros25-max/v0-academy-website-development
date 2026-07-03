'use client'

import { useState } from 'react'
import { Send, Loader, Copy, AlertCircle } from 'lucide-react'

export default function AIAssistantPanel() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      setError('الرجاء إدخال نصاً')
      return
    }

    setLoading(true)
    setError(null)
    setResult('')

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في الحصول على الرد')
      }

      setResult(data.text || '')
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع')
      setResult('')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-xl border border-primary/20 shadow-sm"
      dir="rtl"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
            <span>🤖</span> مساعد الأكاديمية الذكي
          </h3>
          <p className="text-sm text-muted-foreground">
            توليد المقالات والمحتوى بسرعة فوراً
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-900 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="space-y-3 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثال: اكتب مقالاً عن فوائد تعلم التجويد للأطفال..."
            className="flex-1 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition font-semibold flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                جاري...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                توليد
              </>
            )}
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2">
          {[
            'اكتب مقالاً عن التجويد',
            'اشرح أهمية حفظ القرآن',
            'اكتب وصف لدورة تعليمية',
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="text-xs px-3 py-1.5 bg-card border border-border rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div className="space-y-3">
          <div className="relative">
            <div className="bg-card border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
                {result}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 left-2 p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition"
              title="نسخ"
            >
              <Copy className="w-4 h-4" />
              {copied && <span className="text-xs ml-1">تم النسخ!</span>}
            </button>
          </div>

          <div className="flex gap-2 text-xs text-muted-foreground">
            <p>💡 يمكنك نسخ المحتوى أو تعديله قبل الحفظ</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>أدخل طلبك أعلاه وسيقوم الذكاء الاصطناعي بصياغة المحتوى المطلوب فوراً</p>
        </div>
      )}
    </div>
  )
}
