import { NextResponse } from "next/server"
import { getPackages } from "@/lib/data-store"

export const revalidate = 0

export async function GET() {
  const packages = await getPackages()
  return NextResponse.json(packages.filter((pkg) => pkg.active !== false), {
    headers: { "Cache-Control": "no-store" },
  })
}
