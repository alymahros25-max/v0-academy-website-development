import { NextResponse } from "next/server"

// In-memory store for contact messages (for admin dashboard)
// In production, this would be stored in a database
const messages: Array<{
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
  read: boolean
}> = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || "",
      message,
      createdAt: new Date().toISOString(),
      read: false,
    }

    messages.push(newMessage)

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ messages })
}
