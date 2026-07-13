import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata-utils'
import PricingPageClient from './client'

export const metadata: Metadata = generatePageMetadata('pricing')

export default function PricingPage() {
  return <PricingPageClient />
}
