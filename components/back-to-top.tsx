"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronUp } from "lucide-react"

export default function BackToTop() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener("scroll", toggleVisible)
    toggleVisible()
    return () => window.removeEventListener("scroll", toggleVisible)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (pathname?.startsWith("/admin")) return null
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all duration-300 hover:bg-orange-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      aria-label="Back to top"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  )
}
