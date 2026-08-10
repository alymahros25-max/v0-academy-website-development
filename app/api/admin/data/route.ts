import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { verifyAdminSession } from "@/lib/admin-auth"
import {
  getTeachers, setTeachers,
  getPackages, setPackages,
  getReviews, setReviews,
  getMessages, setMessages,
  getSettings, setSettings,
} from "@/lib/data-store"

async function authGuard() {
  const isAuth = await verifyAdminSession()
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

function revalidateForType(type: string) {
  const paths = type === "packages" ? ["/", "/quran", "/arabic", "/admin"] : ["/", "/admin"]
  for (const path of paths) revalidatePath(path)
  revalidateTag(`admin-${type}`, "max")
  revalidateTag("site-content", "max")
}

export async function GET(request: NextRequest) {
  const authError = await authGuard()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  try {
    switch (type) {
      case "teachers":
        return NextResponse.json(await getTeachers())
      case "packages":
        return NextResponse.json(await getPackages())
      case "reviews":
        return NextResponse.json(await getReviews())
      case "messages":
        return NextResponse.json(await getMessages())
      case "settings":
        return NextResponse.json(await getSettings())
      case "stats": {
        const messages = await getMessages()
        const teachers = await getTeachers()
        const reviews = await getReviews()
        return NextResponse.json({
          totalMessages: messages.length,
          unreadMessages: messages.filter(m => !m.read).length,
          totalTeachers: teachers.filter(t => t.active).length,
          totalReviews: reviews.filter(r => r.active).length,
        })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Admin data error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await authGuard()
  if (authError) return authError

  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case "teachers": {
        const teachers = await getTeachers()
        const newItem = { ...data, id: Date.now().toString() }
        teachers.push(newItem)
        await setTeachers(teachers)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data: newItem })
      }
      case "packages": {
        const packages = await getPackages()
        const newPkg = { ...data, id: Date.now().toString() }
        packages.push(newPkg)
        await setPackages(packages)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data: newPkg })
      }
      case "reviews": {
        const reviews = await getReviews()
        const newReview = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
        reviews.push(newReview)
        await setReviews(reviews)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data: newReview })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Admin data error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authError = await authGuard()
  if (authError) return authError

  try {
    const body = await request.json()
    const { type, id, data } = body

    switch (type) {
      case "teachers": {
        const teachers = await getTeachers()
        const idx = teachers.findIndex(t => t.id === id)
        if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
        teachers[idx] = { ...teachers[idx], ...data }
        await setTeachers(teachers)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data: teachers[idx] })
      }
      case "packages": {
        const packages = await getPackages()
        const idx = packages.findIndex(p => p.id === id)
        if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
        packages[idx] = { ...packages[idx], ...data }
        await setPackages(packages)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data: packages[idx] })
      }
      case "reviews": {
        const reviews = await getReviews()
        const idx = reviews.findIndex(r => r.id === id)
        if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
        reviews[idx] = { ...reviews[idx], ...data }
        await setReviews(reviews)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data: reviews[idx] })
      }
      case "messages": {
        const messages = await getMessages()
        const idx = messages.findIndex(m => m.id === id)
        if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
        messages[idx] = { ...messages[idx], ...data }
        await setMessages(messages)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data: messages[idx] })
      }
      case "settings": {
        await setSettings(data)
        revalidateForType(type)
        return NextResponse.json({ saved: true, data })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Admin data error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await authGuard()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    if (!type || !id) return NextResponse.json({ error: "Type and ID required" }, { status: 400 })

    switch (type) {
      case "teachers": {
        const teachers = await getTeachers()
        await setTeachers(teachers.filter(t => t.id !== id))
        revalidateForType(type)
        return NextResponse.json({ saved: true, deletedId: id })
      }
      case "packages": {
        const packages = await getPackages()
        await setPackages(packages.filter(p => p.id !== id))
        revalidateForType(type)
        return NextResponse.json({ saved: true, deletedId: id })
      }
      case "reviews": {
        const reviews = await getReviews()
        await setReviews(reviews.filter(r => r.id !== id))
        revalidateForType(type)
        return NextResponse.json({ saved: true, deletedId: id })
      }
      case "messages": {
        const messages = await getMessages()
        await setMessages(messages.filter(m => m.id !== id))
        revalidateForType(type)
        return NextResponse.json({ saved: true, deletedId: id })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Admin data error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 })
  }
}
