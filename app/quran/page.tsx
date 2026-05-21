import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata-utils'
import QuranPageClient from './client'

export const metadata: Metadata = generatePageMetadata('quran')

export default function QuranPage() {
  return <QuranPageClient />
}
