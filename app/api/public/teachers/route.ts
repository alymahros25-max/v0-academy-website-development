import { NextResponse } from "next/server"
import { getTeachers } from "@/lib/data-store"
import staticTeachers from "@/data/teachers.json"

export const dynamic = "force-dynamic"

const hasTeacherShape = (teacher: unknown): teacher is (typeof staticTeachers)[number] => {
  if (!teacher || typeof teacher !== "object") return false
  const candidate = teacher as { name?: unknown; role?: unknown; bio?: unknown; highlights?: unknown }
  return Boolean(
    candidate.name && typeof candidate.name === "object" &&
    candidate.role && typeof candidate.role === "object" &&
    candidate.bio && typeof candidate.bio === "object" &&
    Array.isArray(candidate.highlights)
  )
}

const safeTeachers = (value: unknown) => {
  if (!Array.isArray(value)) return staticTeachers.filter((teacher) => teacher.active !== false)
  const validTeachers = value.filter(hasTeacherShape)
  return (validTeachers.length ? validTeachers : staticTeachers).filter((teacher) => teacher.active !== false)
}

export async function GET() {
  try {
    const teachers = await getTeachers()
    return NextResponse.json(safeTeachers(teachers), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("[v0] Public teachers fallback:", error)
    return NextResponse.json(safeTeachers(staticTeachers), {
      headers: { "Cache-Control": "no-store" },
    })
  }
}
