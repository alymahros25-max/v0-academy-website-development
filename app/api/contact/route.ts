import { NextResponse } from "next/server"
import { getMessages, setMessages } from "@/lib/data-store"
import fs from "fs/promises"
import path from "path"

async function loadData() {
  try {
    const dataPath = path.join(process.cwd(), "data", "data.json")
    const content = await fs.readFile(dataPath, "utf-8")
    return JSON.parse(content)
  } catch {
    return { contactMessages: [] }
  }
}

async function saveData(data: any) {
  try {
    const dataPath = path.join(process.cwd(), "data", "data.json")
    await fs.mkdir(path.dirname(dataPath), { recursive: true })
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Failed to save data:", error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, subject, language } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || "",
      subject: subject || "Contact Form",
      message,
      language: language || "ar",
      createdAt: new Date().toISOString(),
      read: false,
      replied: false,
    }

    const data = await loadData()
    data.contactMessages = data.contactMessages || []
    data.contactMessages.push(newMessage)
    await saveData(data)

    console.log("[Contact Message Received]", newMessage)

    return NextResponse.json({
      success: true,
      message:
        language === "ar"
          ? "تم إرسال رسالتك بنجاح"
          : language === "fr"
            ? "Votre message a été envoyé avec succès"
            : "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const data = await loadData()
    return NextResponse.json({ messages: data.contactMessages || [] })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ messages: [] })
  }
}
