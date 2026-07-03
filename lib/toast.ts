// Simple toast notification system
type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  duration?: number
}

class Toast {
  private toasts: Map<string, NodeJS.Timeout> = new Map()
  private listeners: ((toast: any) => void)[] = []

  subscribe(callback: (toast: any) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notify(type: ToastType, message: string, options?: ToastOptions) {
    const id = Math.random().toString(36)
    const toast = { id, type, message }

    // Notify listeners
    this.listeners.forEach((listener) => listener(toast))

    // Auto-remove after duration
    const timeout = setTimeout(() => {
      this.listeners.forEach((listener) => listener({ id, type, message, removed: true }))
      this.toasts.delete(id)
    }, options?.duration || 3000)

    this.toasts.set(id, timeout)
  }

  success(message: string, options?: ToastOptions) {
    this.notify("success", message, options)
  }

  error(message: string, options?: ToastOptions) {
    this.notify("error", message, options)
  }

  info(message: string, options?: ToastOptions) {
    this.notify("info", message, options)
  }

  warning(message: string, options?: ToastOptions) {
    this.notify("warning", message, options)
  }
}

export const toast = new Toast()
