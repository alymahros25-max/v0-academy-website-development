import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'الرجاء إدخال نص البحث أو السؤال' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY || process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.warn('[AI] No API key configured')
      return NextResponse.json(
        {
          text: `[محاكاة AI] ${prompt}\n\nملاحظة: لم يتم تكوين مفتاح API. في الإنتاج، سيتم ربط نموذج الذكاء الاصطناعي الفعلي.`,
        },
        { status: 200 }
      )
    }

    // Call Google Generative AI
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `أنت مساعد ذكي متخصص في إدارة الأكاديميات الإسلامية والتعليمية. ساعد المسؤول في: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'عذراً، لم أتمكن من توليد نص في الوقت الحالي'

    return NextResponse.json({ text: aiText })
  } catch (error: any) {
    console.error('[AI Assistant Error]:', error)
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء الاتصال بمحرك الذكاء الاصطناعي',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// Optional: Add GET handler for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Assistant API',
  })
}
