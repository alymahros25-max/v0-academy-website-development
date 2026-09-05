import { NextRequest, NextResponse } from "next/server"

// Server-side proxy for Google Translate (gtx client) — no API key required.
// Runs on the server to avoid CORS issues in the browser.
// POST body: { text: string, sourceLang: "ar", targetLang: "en" | "fr" }
// Response:  { translated: string }

async function gtxTranslate(text: string, sourceLang: "ar" | "en" | "fr", targetLang: "en" | "fr"): Promise<string> {
  if (!text.trim()) return ""
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10_000)
  let res: Response
  try {
    res = await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
  if (!res.ok) return text
  const data = (await res.json()) as Array<Array<[string, string]>>
  const translated = data?.[0]
    ?.map((chunk) => chunk?.[0] ?? "")
    .join("")
  return translated.trim() || text
}

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang = "ar", targetLang } = (await req.json()) as {
      text?: string
      sourceLang?: string
      targetLang?: string
    }
    if (
      !text?.trim() ||
      text.length > 10_000 ||
      !["ar", "en", "fr"].includes(sourceLang) ||
      !["en", "fr"].includes(targetLang ?? "")
    ) {
      return NextResponse.json({ translated: text ?? "" })
    }
    const translated = await gtxTranslate(text, sourceLang as "ar" | "en" | "fr", targetLang as "en" | "fr")
    return NextResponse.json({ translated })
  } catch {
    return NextResponse.json({ translated: "" }, { status: 500 })
  }
}
