import { NextResponse } from "next/server"
import { getTeachers } from "@/lib/data-store"

export const dynamic = "force-dynamic"

export async function GET() {
  const teachers = await getTeachers()
  return NextResponse.json(teachers.filter((teacher) => teacher.active !== false), {
    headers: { "Cache-Control": "no-store" },
  })
}
