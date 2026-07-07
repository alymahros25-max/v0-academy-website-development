/**
 * Defensive Programming Utilities for Admin Dashboard
 * Provides safe data access patterns to prevent crashes
 */

// Safe array mapping with fallback
export function safeMap<T, R>(
  arr: T[] | null | undefined,
  mapper: (item: T, idx: number) => R | null,
  defaultValue: R[] = []
): R[] {
  try {
    if (!Array.isArray(arr)) return defaultValue
    return arr.map(mapper).filter((item) => item !== null) as R[]
  } catch (e) {
    console.error("[v0] safeMap error:", e)
    return defaultValue
  }
}

// Safe object access with chaining
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const value = path.split(".").reduce((current, key) => current?.[key], obj)
    return value ?? defaultValue
  } catch {
    return defaultValue
  }
}

// Safe JSON parse
export function safeParse<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue
  try {
    return JSON.parse(json) as T
  } catch {
    return defaultValue
  }
}

// Safe type check
export function isValidArray<T>(value: any): value is T[] {
  return Array.isArray(value) && value.length > 0
}

export function isValidObject(value: any): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

// Safe async wrapper
export async function safeAsync<T>(
  fn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    console.error("[v0] Async error:", e)
    return defaultValue
  }
}
