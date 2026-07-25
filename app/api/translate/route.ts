import { NextRequest, NextResponse } from "next/server"

// Server-side proxy for Google Translate (gtx client) — no API key required.
// Runs on the server to avoid CORS issues in the browser.
// POST body: { text: string, targetLang: "en" | "fr" }
// Response:  { translated: string }

async function gtxTranslate(text: string, targetLang: "en" | "fr"): Promise<string> {
  if (!text.trim()) return ""
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=ar&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) return text
  const data = (await res.json()) as [string[]][][][]
  const translated = (data?.[0] as [string][])
    ?.map((chunk) => chunk?.[0] ?? "")
    .join("")
  return translated.trim() || text
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = (await req.json()) as {
      text?: string
      targetLang?: string
    }
    if (!text?.trim() || !["en", "fr"].includes(targetLang ?? "")) {
      return NextResponse.json({ translated: text ?? "" })
    }
    const translated = await gtxTranslate(text, targetLang as "en" | "fr")
    return NextResponse.json({ translated })
  } catch {
    return NextResponse.json({ translated: "" }, { status: 500 })
  }
}
