import { cookies } from "next/headers"
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
const ADMIN_PASSWORD_SCRYPT_HASH = process.env.ADMIN_PASSWORD_SCRYPT_HASH
const SESSION_COOKIE = "admin_session"
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function assertAdminConfig(): void {
  if (!ADMIN_EMAIL?.trim() || (!ADMIN_PASSWORD_SCRYPT_HASH?.trim() && !ADMIN_PASSWORD_HASH?.trim()) || !SESSION_SECRET?.trim()) {
    throw new Error("Admin authentication is not configured")
  }
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(ADMIN_EMAIL?.trim() && (ADMIN_PASSWORD_SCRYPT_HASH?.trim() || ADMIN_PASSWORD_HASH?.trim()) && SESSION_SECRET?.trim())
}

function getSessionVersion(): string {
  assertAdminConfig()
  return createHash("sha256")
    .update(ADMIN_PASSWORD_SCRYPT_HASH?.trim() || ADMIN_PASSWORD_HASH!.trim())
    .digest("hex")
}

function generateSessionToken(email: string, issuedAt: number): string {
  assertAdminConfig()
  return createHmac("sha256", SESSION_SECRET!)
    .update(`${email}:${issuedAt}:${getSessionVersion()}`)
    .digest("hex")
}

export function verifySessionValue(value: string): boolean {
  try {
    assertAdminConfig()
    const decoded = Buffer.from(value, "base64url").toString("utf8")
    const [email, issuedAtText, token] = decoded.split(":")
    const issuedAt = Number(issuedAtText)
    if (!email || !token || !Number.isSafeInteger(issuedAt)) return false
    if (Date.now() - issuedAt > SESSION_TTL_MS || issuedAt > Date.now() + 60_000) return false
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

function verifyScryptPassword(password: string, encodedHash: string): boolean {
  const [scheme, saltHex, hashHex] = encodedHash.split("$")
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false

  try {
    const derivedKey = scryptSync(password, Buffer.from(saltHex, "hex"), 64)
    const expectedKey = Buffer.from(hashHex, "hex")
    return derivedKey.length === expectedKey.length && timingSafeEqual(derivedKey, expectedKey)
  } catch {
    return false
  }
}

export function verifyCredentials(email: string, password: string): boolean {
  assertAdminConfig()
  const normalizedEmail = email.trim().toLowerCase()
  const emailMatches = normalizedEmail === ADMIN_EMAIL!.trim().toLowerCase()
  const passwordMatches = ADMIN_PASSWORD_SCRYPT_HASH
    ? verifyScryptPassword(password, ADMIN_PASSWORD_SCRYPT_HASH.trim())
    : Boolean(ADMIN_PASSWORD_HASH && createHash("sha256").update(password).digest("hex") === ADMIN_PASSWORD_HASH.trim())

  return emailMatches && passwordMatches
}

export function createScryptPasswordHash(password: string): string {
  const salt = randomBytes(16)
  const derivedKey = scryptSync(password, salt, 64)
  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`
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
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
