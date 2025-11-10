"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Please enter at least 2 characters." })
    .max(80, { message: "Name should be under 80 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z
    .string()
    .min(3, { message: "Subject should be at least 3 characters." })
    .max(120, { message: "Subject should be under 120 characters." }),
  message: z
    .string()
    .min(10, { message: "Tell us a bit more (minimum 10 characters)." })
    .max(2000, { message: "Message should be under 2000 characters." }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState<string>("")

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setStatus("loading")
      setStatusMessage("")

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please try again.")
      }

      setStatus("success")
      setStatusMessage("Thanks! Your message landed in our inbox. We'll get back to you shortly.")
      form.reset()
    } catch (error) {
      console.error("Contact form submission failed:", error)
      setStatus("error")
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your message. Please try again.",
      )
    } finally {
      setTimeout(() => {
        setStatus("idle")
      }, 6000)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Let’s Build Something <span className="text-orange-500">Together</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Share your ideas, partnership proposals, or questions. The IEEE Computer Society ISIMM team checks this inbox daily.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-orange-100 bg-gray-50 p-8 shadow-lg animate-on-scroll">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-gray-900">Send us a message</h2>
              <p className="mt-3 text-gray-600">
                We typically reply within 2–3 working days.
              </p>
            </div>

            {status !== "idle" && statusMessage ? (
              <Alert variant={status === "success" ? "default" : "destructive"} className="mb-6">
                <AlertTitle>{status === "success" ? "Submitted" : "Heads up"}</AlertTitle>
                <AlertDescription>{statusMessage}</AlertDescription>
              </Alert>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <User className="h-4 w-4 text-orange-500" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            autoComplete="name"
                            className="focus:border-orange-500 focus:ring-orange-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Mail className="h-4 w-4 text-orange-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
                            className="focus:border-orange-500 focus:ring-orange-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MessageCircle className="h-4 w-4 text-orange-500" />
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What would you like to talk about?"
                          className="focus:border-orange-500 focus:ring-orange-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your idea, collaboration request, or question."
                          rows={6}
                          className="focus:border-orange-500 focus:ring-orange-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  )
}


