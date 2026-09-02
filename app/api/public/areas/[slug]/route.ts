import { NextResponse } from "next/server"
import { getAreaContent, getAreaFaq, getAreaLinks, getAreaPackages } from "@/lib/country-content"

export const revalidate = 0

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const [{ area, packages }, { faq }, { content }, { links }] = await Promise.all([
    getAreaPackages(slug),
    getAreaFaq(slug),
    getAreaContent(slug),
    getAreaLinks(slug),
  ])

  if (!area) {
    return NextResponse.json({ error: "Area not found" }, { status: 404 })
  }

  return NextResponse.json(
    { area, packages, faq, content, links },
    { headers: { "Cache-Control": "no-store" } },
  )
}
