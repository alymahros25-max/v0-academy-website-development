"use client"

import { useI18n } from "@/lib/i18n"
import { BlogSection } from "@/components/BlogSection"

export default function BlogPage() {
  const { t, dir } = useI18n()

  return (
    <div dir={dir} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-primary/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("blog.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("blog.desc")}
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
