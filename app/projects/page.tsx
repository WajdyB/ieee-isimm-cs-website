"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink, Users, Sparkles, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Project = {
  title: string
  description: string
  image: string
  github: string
  live?: string
  tech: string[]
  role: string
  year: string
}

const projects: Project[] = [
  {
    title: "AI Serenity Companion",
    description:
      "Description here",
    image: "/images/placeholder.jpg",
    github: "https://github.com/",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    role: "Product Squad · 6 members",
    year: "2024",
  },
  {
    title: "Open Source Starter Kit",
    description:
      "Description here",
    image: "/images/placeholder.jpg",
    github: "https://github.com/",
    tech: ["Next.js", "Supabase", "Radix UI"],
    role: "Platform Guild · 4 members",
    year: "2023",
  },
  {
    title: "CS Hack Liveboard",
    description:
      "Description here",
    image: "/images/placeholder.jpg",
    github: "https://github.com/",
    tech: ["Next.js", "WebSockets", "MongoDB", "Shadcn UI"],
    role: "Hackathon Ops · 5 members",
    year: "2022",
  },
]

export default function ProjectsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
              Turning Ideas into <span className="text-orange-500">Impactful Products</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Explore the technical initiatives crafted by the IEEE Computer Society ISIMM students. Each project solves a real challenge,
              prototypes new technology, or powers our flagship events.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Innovation First",
                description: "Rapid prototyping with an emphasis on AI, developer tooling, and community platforms.",
              },
              {
                icon: Layers,
                title: "Full-Stack Craft",
                description: "From UI polish to scalable backends, we ship production-ready experiences.",
              },
              {
                icon: Users,
                title: "Collaborative Teams",
                description: "Cross-functional squads of developers, designers, and product leads working in sync.",
              },
            ].map((highlight, index) => (
              <div
                key={highlight.title}
                className="animate-on-scroll rounded-2xl border border-orange-100 bg-orange-50/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <highlight.icon className="h-10 w-10 text-orange-600" />
                <h3 className="mt-4 text-2xl font-semibold text-gray-900">{highlight.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Projects</h2>
            <p className="mt-4 text-lg text-gray-600">
              A snapshot of the engineering work we deliver every season. Dive into the codebases and remix them for your own clubs.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="animate-on-scroll flex h-full flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-3 text-sm font-medium text-white">
                    <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">{project.year}</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">{project.role}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{project.title}</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tech.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild className="bg-orange-500 hover:bg-orange-600">
                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Repository
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Let’s Build the Next Chapter Together</h2>
            <p className="mt-6 text-xl opacity-90 leading-relaxed">
              Whether you want to collaborate, reuse our code, or invite us to mentor your community, we’re always eager to connect with fellow
              builders.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                <Link href="https://www.facebook.com/ieee.cs.isimm" target="_blank" rel="noopener noreferrer">
                  Follow Us
                </Link>
              </Button>
              <Button asChild size="lg"  variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                <Link href="https://github.com/" target="_blank" rel="noopener noreferrer">
                  Explore GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


