import { cookies } from "next/headers"
import { createHash, createHmac, timingSafeEqual } from "crypto"

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

function generateSessionToken(email: string, issuedAt: number): string {
  assertAdminConfig()
  return createHmac("sha256", SESSION_SECRET!).update(`${email}:${issuedAt}`).digest("hex")
}

export function verifySessionValue(value: string): boolean {
  try {
    assertAdminConfig()
    const decoded = Buffer.from(value, "base64url").toString("utf8")
    const [email, issuedAtText, token] = decoded.split(":")
    const issuedAt = Number(issuedAtText)
    if (!email || !token || !Number.isSafeInteger(issuedAt)) return false
    if (Date.now() - issuedAt > 7 * 24 * 60 * 60 * 1000 || issuedAt > Date.now() + 60_000) return false
    const expected = generateSessionToken(email, issuedAt)
    return email === ADMIN_EMAIL?.trim().toLowerCase() && token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return Boolean(session?.value && verifySessionValue(session.value))
}

export function verifyCredentials(email: string, password: string): boolean {
  assertAdminConfig()
  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = createHash("sha256").update(password).digest("hex")
  return normalizedEmail === ADMIN_EMAIL!.trim().toLowerCase() && passwordHash === ADMIN_PASSWORD_HASH!.trim()
}

export async function createSession(email: string) {
  assertAdminConfig()
  const issuedAt = Date.now()
  const token = generateSessionToken(email, issuedAt)
  const sessionValue = Buffer.from(`${email}:${issuedAt}:${token}`).toString("base64url")
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
