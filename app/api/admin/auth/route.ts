import { NextRequest, NextResponse } from "next/server"
import { verifyCredentials, createSession, destroySession, verifyAdminSession, isAdminAuthConfigured } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!isAdminAuthConfigured()) {
      return NextResponse.json({ error: "إعدادات المصادقة غير مكتملة على الخادم" }, { status: 500, headers: { "Cache-Control": "no-store" } })
    }

    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400, headers: { "Cache-Control": "no-store" } })
    }

    if (!verifyCredentials(email, password)) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    await createSession(email)
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    if (error instanceof Error && error.message === "Admin authentication is not configured") {
      return NextResponse.json({ error: "إعدادات المصادقة غير مكتملة على الخادم" }, { status: 500, headers: { "Cache-Control": "no-store" } })
    }
    console.error("[v0] Admin login server error")
    return NextResponse.json({ error: "تعذر تسجيل الدخول حالياً" }, { status: 500, headers: { "Cache-Control": "no-store" } })
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
