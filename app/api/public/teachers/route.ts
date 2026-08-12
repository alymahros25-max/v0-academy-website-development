import { NextResponse } from "next/server"
import { getTeachers } from "@/lib/data-store"
import staticTeachers from "@/data/teachers.json"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const teachers = await getTeachers()
    return NextResponse.json(teachers.filter((teacher) => teacher.active !== false), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("[v0] Public teachers fallback:", error)
    return NextResponse.json(staticTeachers.filter((teacher) => teacher.active !== false), {
      headers: { "Cache-Control": "no-store" },
    })
  }
}
