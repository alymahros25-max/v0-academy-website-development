"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WhatsAppDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WhatsAppDialog({ open, onOpenChange }: WhatsAppDialogProps) {
  const { locale } = useI18n()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const options = {
    ar: [
      {
        id: "quran",
        label: "تحفيظ القرآن الكريم",
        message: "مرحبا، أريد معرفة تفاصيل عن برنامج تحفيظ القرآن الكريم",
      },
      {
        id: "arabic",
        label: "تأسيس اللغة العربية",
        message: "مرحبا، أريد معرفة تفاصيل عن برنامج تأسيس اللغة العربية",
      },
      {
        id: "inquiry",
        label: "استفسار عام",
        message: "مرحبا، لدي استفسار بخصوص الأكاديمية",
      },
    ],
    en: [
      {
        id: "quran",
        label: "Quran Memorization",
        message: "Hello, I want to know more about the Quran memorization program",
      },
      {
        id: "arabic",
        label: "Arabic Language",
        message: "Hello, I want to know more about the Arabic language foundation program",
      },
      {
        id: "inquiry",
        label: "General Inquiry",
        message: "Hello, I have a general inquiry about the academy",
      },
    ],
    fr: [
      {
        id: "quran",
        label: "Mémorisation du Coran",
        message: "Bonjour, je veux en savoir plus sur le programme de mémorisation du Coran",
      },
      {
        id: "arabic",
        label: "Langue Arabe",
        message: "Bonjour, je veux en savoir plus sur le programme de langue arabe",
      },
      {
        id: "inquiry",
        label: "Demande Générale",
        message: "Bonjour, j'ai une demande générale concernant l'académie",
      },
    ],
  }

  const currentOptions = options[locale as keyof typeof options]

  const handleSelect = (option: (typeof currentOptions)[0]) => {
    const encodedMessage = encodeURIComponent(option.message)
    // Using wa.me with message to ensure the message is sent with the text parameter
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    onOpenChange(false)
    setSelectedOption(null)
  }

  const titles = {
    ar: "اختر نوع البرنامج",
    en: "Select Program Type",
    fr: "Sélectionnez le type de programme",
  }

  const descriptions = {
    ar: "حتى نتمكن من مساعدتك بشكل أفضل، اختر البرنامج الذي تهتم به",
    en: "To better assist you, please select the program you're interested in",
    fr: "Pour mieux vous aider, veuillez sélectionner le programme qui vous intéresse",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titles[locale as keyof typeof titles]}</DialogTitle>
          <DialogDescription>
            {descriptions[locale as keyof typeof descriptions]}
          </DialogDescription>
        </DialogHeader>
        <div className={`grid gap-3 ${locale === "ar" ? "text-right" : ""}`}>
          {currentOptions.map((option) => (
            <Button
              key={option.id}
              onClick={() => handleSelect(option)}
              variant="outline"
              className="h-auto py-3 px-4 justify-start text-base font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
