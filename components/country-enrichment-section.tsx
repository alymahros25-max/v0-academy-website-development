import type { CSSProperties } from "react"
import { BookOpenText, Clock3, MapPin } from "lucide-react"
import type { AreaCity, AreaTheme, AreaTimezone } from "@/lib/country-content"

type CountryStyle = CSSProperties & Record<`--${string}`, string>

const HEX_COLOR = /^#[0-9a-f]{6}$/i

function safeHex(value: string | null | undefined, fallback: string) {
  return value && HEX_COLOR.test(value) ? value : fallback
}

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16)
  return { red: (value >> 16) & 255, green: (value >> 8) & 255, blue: value & 255 }
}

function hexToHslTriplet(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let hue = 0
  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6)
    else if (max === g) hue = 60 * ((b - r) / delta + 2)
    else hue = 60 * ((r - g) / delta + 4)
  }
  if (hue < 0) hue += 360
  const lightness = (max + min) / 2
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`
}

function contrastTriplet(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255
  return luminance > 0.62 ? "214 35% 15%" : "0 0% 100%"
}

function mixWithWhite(hex: string, whiteRatio = 0.88) {
  const { red, green, blue } = hexToRgb(hex)
  const mix = (channel: number) => Math.round(channel * (1 - whiteRatio) + 255 * whiteRatio)
  return `#${[mix(red), mix(green), mix(blue)].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
}

export function getCountryThemeStyle(theme: AreaTheme | null | undefined): CountryStyle | undefined {
  if (!theme) return undefined
  const primary = safeHex(theme.primary_color, "#5680A8")
  const secondary = safeHex(theme.secondary_color, "#9AB5D2")
  const accent = safeHex(theme.accent_color, "#DDBB85")
  const background = safeHex(theme.background_color, "#FAF8F4")
  const text = safeHex(theme.text_color, "#1A1A1A")

  return {
    "--country-primary": primary,
    "--country-secondary": secondary,
    "--country-accent": accent,
    "--country-background": background,
    "--country-text": text,
    "--primary": hexToHslTriplet(primary),
    "--primary-foreground": contrastTriplet(primary),
    "--secondary": hexToHslTriplet(mixWithWhite(secondary)),
    "--secondary-foreground": hexToHslTriplet(text),
    "--accent": hexToHslTriplet(accent),
    "--accent-foreground": contrastTriplet(accent),
    "--background": hexToHslTriplet(background),
    "--foreground": hexToHslTriplet(text),
    "--ring": hexToHslTriplet(primary),
  }
}

export function CountryEnrichmentSection({
  countryName,
  theme,
  cities,
  timezones,
}: {
  countryName: string
  theme: AreaTheme | null
  cities: AreaCity[]
  timezones: AreaTimezone[]
}) {
  if (!theme && cities.length === 0 && timezones.length === 0) return null

  return (
    <section className="content-auto border-y border-border bg-secondary/35 px-5 py-16 sm:px-8" aria-labelledby="country-coverage-title">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="saudi-eyebrow justify-center"><MapPin size={17} /> تغطية محلية وهوية مستقلة</p>
          <h2 id="country-coverage-title" className="mt-4 text-3xl font-bold">خدمة أونلاين تناسب العائلات في {countryName}</h2>
          <p className="mt-4 leading-8 text-muted-foreground">تعرّف على المدن التي نخدمها، واضبط الموعد حسب توقيتك، واقرأ فائدة قرآنية موجزة ومختلفة لهذه الصفحة.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3"><MapPin className="text-primary" /><div><h3 className="text-xl font-bold">مدن ومناطق نخدمها أونلاين</h3><p className="text-sm text-muted-foreground">يمكن حضور الحصص من أي مدينة، وهذه أمثلة للتغطية المحلية.</p></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {cities.map((city) => <div key={city.id} className="rounded-xl border border-border bg-background/70 p-4"><p className="font-bold text-foreground">{city.name_ar}</p><p className="mt-1 text-sm text-muted-foreground">{city.name_en}{city.region_name ? ` · ${city.region_name}` : ""}</p></div>)}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3"><Clock3 className="text-primary" /><div><h3 className="text-xl font-bold">المناطق الزمنية</h3><p className="text-sm text-muted-foreground">تُستخدم لتنسيق المواعيد بوضوح.</p></div></div>
              <div className="mt-5 grid gap-2">
                {timezones.map((timezone) => <div key={timezone.id} className={`rounded-xl border px-4 py-3 ${timezone.is_primary ? "border-primary bg-primary/5" : "border-border bg-background/70"}`}><div className="flex items-center justify-between gap-3"><span className="font-semibold">{timezone.label_ar}</span>{timezone.is_primary && <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">الأساسي</span>}</div><code className="mt-1 block text-left text-xs text-muted-foreground" dir="ltr">{timezone.timezone_name}</code></div>)}
              </div>
            </article>

            {theme?.quran_fact_title_ar && theme.quran_fact_body_ar && <article className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm"><div className="flex items-center gap-3"><BookOpenText className="text-primary" /><div><h3 className="text-xl font-bold">{theme.quran_fact_title_ar}</h3><p className="text-sm text-muted-foreground">معلومة قرآنية مختارة لصفحة {countryName}</p></div></div><blockquote className="mt-5 border-r-4 border-primary pr-4 leading-8 text-foreground">{theme.quran_fact_body_ar}</blockquote>{theme.quran_fact_reference_ar && <p className="mt-4 text-xs font-semibold text-muted-foreground">المرجع: {theme.quran_fact_reference_ar}</p>}</article>}
          </div>
        </div>
      </div>
    </section>
  )
}
