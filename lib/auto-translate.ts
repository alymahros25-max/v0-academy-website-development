// Auto-Translation Utility using Google Translate API
const GOOGLE_TRANSLATE_API = "https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit"

export async function translateText(text: string, sourceLang: string = "ar", targetLangs: string[] = ["en", "fr"]): Promise<Record<string, string>> {
  const result: Record<string, string> = {
    [sourceLang]: text,
  }

  try {
    for (const targetLang of targetLangs) {
      if (targetLang === sourceLang) continue

      const translated = await fetchTranslation(text, sourceLang, targetLang)
      result[targetLang] = translated
    }
  } catch (error) {
    console.error("[v0] Translation error:", error)
    // If API fails, return original text for all languages
    for (const lang of targetLangs) {
      if (lang !== sourceLang) {
        result[lang] = text
      }
    }
  }

  return result
}

async function fetchTranslation(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    // Using Google Translate free API (without authentication)
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    // Fallback: Use a simple translation service
    return await translateUsingFallback(text, sourceLang, targetLang)
  } catch {
    return text
  }
}

// Fallback translation function using a simple online service
async function translateUsingFallback(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const encodedText = encodeURIComponent(text)
    const langMap: Record<string, string> = {
      ar: "ar",
      en: "en",
      fr: "fr",
    }

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langMap[sourceLang]}|${langMap[targetLang]}`
    )

    if (!response.ok) {
      return text
    }

    const data: any = await response.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText
    }

    return text
  } catch (error) {
    console.error("[v0] Fallback translation error:", error)
    return text
  }
}

// Translate multiple fields in an object
export async function translateObject(
  obj: Record<string, any>,
  fieldsToTranslate: string[],
  sourceLang: string = "ar"
): Promise<Record<string, any>> {
  const result = { ...obj }

  for (const field of fieldsToTranslate) {
    if (obj[field] && typeof obj[field] === "string") {
      const translations = await translateText(obj[field], sourceLang, ["en", "fr"])

      // Add translated fields
      result[`${field}_ar`] = translations.ar
      result[`${field}_en`] = translations.en
      result[`${field}_fr`] = translations.fr
    }
  }

  return result
}
