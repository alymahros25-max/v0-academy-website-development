import { NextRequest, NextResponse } from "next/server"
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
        return NextResponse.json(newItem)
      }
      case "packages": {
        const packages = await getPackages()
        const newPkg = { ...data, id: Date.now().toString() }
        packages.push(newPkg)
        await setPackages(packages)
        return NextResponse.json(newPkg)
      }
      case "reviews": {
        const reviews = await getReviews()
        const newReview = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
        reviews.push(newReview)
        await setReviews(reviews)
        return NextResponse.json(newReview)
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
        return NextResponse.json(teachers[idx])
      }
      case "packages": {
        const packages = await getPackages()
        const idx = packages.findIndex(p => p.id === id)
        if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
        packages[idx] = { ...packages[idx], ...data }
        await setPackages(packages)
        return NextResponse.json(packages[idx])
      }
      case "reviews": {
        const reviews = await getReviews()
        const idx = reviews.findIndex(r => r.id === id)
        if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
        reviews[idx] = { ...reviews[idx], ...data }
        await setReviews(reviews)
        return NextResponse.json(reviews[idx])
      }
      case "messages": {
        const messages = await getMessages()
        const idx = messages.findIndex(m => m.id === id)
        if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
        messages[idx] = { ...messages[idx], ...data }
        await setMessages(messages)
        return NextResponse.json(messages[idx])
      }
      case "settings": {
        await setSettings(data)
        return NextResponse.json(data)
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
        return NextResponse.json({ success: true })
      }
      case "packages": {
        const packages = await getPackages()
        await setPackages(packages.filter(p => p.id !== id))
        return NextResponse.json({ success: true })
      }
      case "reviews": {
        const reviews = await getReviews()
        await setReviews(reviews.filter(r => r.id !== id))
        return NextResponse.json({ success: true })
      }
      case "messages": {
        const messages = await getMessages()
        await setMessages(messages.filter(m => m.id !== id))
        return NextResponse.json({ success: true })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Admin data error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 })
  }
}
