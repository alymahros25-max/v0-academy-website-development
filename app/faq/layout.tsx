import type { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata-utils"

export const metadata: Metadata = generatePageMetadata("faq")

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
