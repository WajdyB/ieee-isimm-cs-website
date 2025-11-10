import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
})

const RESEND_ENDPOINT = "https://api.resend.com/emails"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parseResult = contactSchema.safeParse(payload)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          issues: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const data = parseResult.data
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.CONTACT_EMAIL_FROM
    const toEmail = process.env.CONTACT_EMAIL_TO

    if (!apiKey || !fromEmail || !toEmail) {
      console.error("Contact form env vars missing:", {
        hasApiKey: Boolean(apiKey),
        hasFrom: Boolean(fromEmail),
        hasTo: Boolean(toEmail),
      })

      return NextResponse.json(
        {
          success: false,
          message: "Contact form is not configured correctly. Please try again later.",
        },
        { status: 500 },
      )
    }

    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail.split(",").map((email) => email.trim()),
        reply_to: data.email,
        subject: `[CS ISIMM Contact] ${data.subject}`,
        text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
        `,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <hr />
            <p>${data.message.replace(/\n/g, "<br />")}</p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resend API error:", errorText)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send your message. Please try again later.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error while sending your message.",
      },
      { status: 500 },
    )
  }
}


