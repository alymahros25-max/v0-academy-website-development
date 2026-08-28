"use client"

import { useI18n } from "@/lib/i18n"
import useSWR from "swr"
import { BlogSection } from "@/components/BlogSection"
import type { PublicContent } from "@/lib/public-content"
import { localizedContent } from "@/lib/public-content"

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((res) => res.json())

export default function BlogPage() {
  const { t, dir, locale } = useI18n()
  const { data: content } = useSWR<Record<string, PublicContent>>("/api/cms/content?keys=blog_title,blog_description", fetcher)

  return (
    <div dir={dir} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-primary/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {localizedContent(content?.blog_title, locale, t("blog.title"))}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {localizedContent(content?.blog_description, locale, t("blog.desc"))}
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <BlogSection />
        </div>
      </section>
    </div>
  )
}
