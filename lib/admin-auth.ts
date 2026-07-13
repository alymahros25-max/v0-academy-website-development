import { cookies } from "next/headers"
import { createHash } from "crypto"

const ADMIN_EMAIL = "enamel311@gmail.com"
const ADMIN_PASSWORD_HASH = createHash("sha256").update("admin@hafiz2025").digest("hex")
const SESSION_COOKIE = "admin_session"
const SESSION_SECRET = "hafiz-academy-secret-key-2025"

function generateSessionToken(email: string): string {
  return createHash("sha256").update(`${email}:${SESSION_SECRET}:${Date.now()}`).digest("hex")
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session?.value) return false
  try {
    const decoded = Buffer.from(session.value, "base64").toString()
    const [email] = decoded.split(":")
    return email === ADMIN_EMAIL
  } catch {
    return false
  }
}

export function verifyCredentials(email: string, password: string): boolean {
  const passwordHash = createHash("sha256").update(password).digest("hex")
  return email === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH
}

export async function createSession(email: string) {
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
