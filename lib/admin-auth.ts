import { cookies } from "next/headers"
import { createHash } from "crypto"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
const SESSION_COOKIE = "admin_session"
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET

function assertAdminConfig(): void {
  if (!ADMIN_EMAIL?.trim() || !ADMIN_PASSWORD_HASH?.trim() || !SESSION_SECRET?.trim()) {
    throw new Error("Admin authentication is not configured")
  }
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(ADMIN_EMAIL?.trim() && ADMIN_PASSWORD_HASH?.trim() && SESSION_SECRET?.trim())
}

function generateSessionToken(email: string): string {
  assertAdminConfig()
  return createHash("sha256").update(`${email}:${SESSION_SECRET}`).digest("hex")
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    assertAdminConfig()
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE)
    if (!session?.value) return false
    const decoded = Buffer.from(session.value, "base64").toString()
    const separator = decoded.lastIndexOf(":")
    const email = decoded.slice(0, separator)
    const token = decoded.slice(separator + 1)
    return email === ADMIN_EMAIL?.trim().toLowerCase() && token === generateSessionToken(email)
  } catch {
    return false
  }
}

export function verifyCredentials(email: string, password: string): boolean {
  assertAdminConfig()
  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = createHash("sha256").update(password).digest("hex")
  return normalizedEmail === ADMIN_EMAIL!.trim().toLowerCase() && passwordHash === ADMIN_PASSWORD_HASH!.trim()
}

export async function createSession(email: string) {
  assertAdminConfig()
  const token = generateSessionToken(email)
  const sessionValue = Buffer.from(`${email}:${token}`).toString("base64")
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
