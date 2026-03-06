"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const CS_EMAIL = "contact@cs-isimm.org"

export default function ContactFloatingButton() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")

  if (pathname?.startsWith("/admin")) return null

  const handleSend = () => {
    if (!email.trim()) return
    const mailtoBody = content.trim()
      ? `${content.trim()}\n\n---\nSent from: ${email.trim()}`
      : `Sent from: ${email.trim()}`
    const mailto = `mailto:${CS_EMAIL}?body=${encodeURIComponent(mailtoBody)}`
    window.location.href = mailto
    setOpen(false)
    setEmail("")
    setContent("")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all duration-300 hover:bg-orange-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        aria-label="Contact CS team"
      >
        <Mail className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md sm:rounded-xl border-2 border-orange-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Mail className="h-5 w-5 text-orange-500" />
              Contact the CS team
            </DialogTitle>
            <DialogDescription>
              Your message will open in your email client and be sent to {CS_EMAIL}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Your email *</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-content">Message</Label>
              <Textarea
                id="contact-content"
                placeholder="Write your message here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!email.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 h-11"
            >
              <Mail className="h-4 w-4 mr-2" />
              Open email and send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
