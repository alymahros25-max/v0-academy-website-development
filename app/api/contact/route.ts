import { NextResponse } from "next/server"
import { getMessages, setMessages } from "@/lib/data-store"
import fs from "fs/promises"
import path from "path"
import { z } from "zod"
import { verifyAdminSession } from "@/lib/admin-auth"

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  subject: z.string().trim().max(200).optional().default("Contact Form"),
  language: z.enum(["ar", "en", "fr"]).optional().default("ar"),
}).strict()

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
    const parsed = contactSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid contact form data" }, { status: 400 })
    }
    const { name, email, phone, message, subject, language } = parsed.data

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
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const data = await loadData()
    return NextResponse.json({ messages: data.contactMessages || [] })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ messages: [] })
  }
}
