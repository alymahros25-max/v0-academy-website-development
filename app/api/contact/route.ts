import { NextResponse } from "next/server"
import { DataStore } from "@/lib/data-store"

const dataStore = new DataStore()

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

    const data = await dataStore.loadData()
    data.contactMessages = data.contactMessages || []
    data.contactMessages.push(newMessage)
    await dataStore.saveData(data)

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
    const data = await dataStore.loadData()
    return NextResponse.json({ messages: data.contactMessages || [] })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ messages: [] })
  }
}
