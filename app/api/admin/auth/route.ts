import { NextRequest, NextResponse } from "next/server"
import { verifyCredentials, createSession, destroySession, verifyAdminSession } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    if (!verifyCredentials(email, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession(email)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET() {
  const isAuth = await verifyAdminSession()
  return NextResponse.json({ authenticated: isAuth })
}

export async function DELETE() {
  await destroySession()
  return NextResponse.json({ success: true })
}
