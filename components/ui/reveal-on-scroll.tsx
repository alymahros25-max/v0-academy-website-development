"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function RevealOnScroll({ children, delay = 0, className = "" }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform,box-shadow] duration-700 ease-out ${
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}
