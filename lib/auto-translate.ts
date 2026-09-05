type SupportedLanguage = "ar" | "en" | "fr"

type TranslationResponse = {
  translated?: unknown
}

const TRANSLATION_TIMEOUT_MS = 10_000

export async function translateText(
  text: string,
  sourceLang: SupportedLanguage = "ar",
  targetLangs: SupportedLanguage[] = ["en", "fr"],
): Promise<Record<string, string>> {
  const result: Record<string, string> = { [sourceLang]: text }
  const targets = targetLangs.filter((targetLang) => targetLang !== sourceLang)

  const translations = await Promise.all(
    targets.map(async (targetLang) => [
      targetLang,
      await fetchTranslation(text, sourceLang, targetLang),
    ] as const),
  )

  for (const [language, translated] of translations) {
    result[language] = translated
  }

  return result
}

async function fetchTranslation(
  text: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage,
): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TRANSLATION_TIMEOUT_MS)

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
      signal: controller.signal,
    })

    if (!response.ok) return text

    const data = (await response.json()) as TranslationResponse
    return typeof data.translated === "string" && data.translated.trim()
      ? data.translated
      : text
  } catch {
    return text
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function translateObject(
  obj: Record<string, unknown>,
  fieldsToTranslate: string[],
  sourceLang: SupportedLanguage = "ar",
): Promise<Record<string, unknown>> {
  const result = { ...obj }

  await Promise.all(
    fieldsToTranslate.map(async (field) => {
      const value = obj[field]
      if (typeof value !== "string" || !value.trim()) return

      const translations = await translateText(value, sourceLang, ["en", "fr"])
      result[`${field}_ar`] = translations.ar
      result[`${field}_en`] = translations.en
      result[`${field}_fr`] = translations.fr
    }),
  )

  return result
}
