import { NextResponse } from "next/server"
import { getReviews } from "@/lib/data-store"

export const revalidate = 0

export async function GET() {
  const reviews = await getReviews()
  return NextResponse.json(
    reviews.filter((review) => review.active !== false),
    { headers: { "Cache-Control": "no-store" } },
  )
}
