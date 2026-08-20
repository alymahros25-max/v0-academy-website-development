"use client"

import dynamic from "next/dynamic"

const DeferredLandingVideoStrip = dynamic(() => import("@/components/LandingPageVideoStrip").then((module) => ({ default: module.LandingPageVideoStrip })), { ssr: false })

export function LandingVideoStrip() {
  return <DeferredLandingVideoStrip />
}
