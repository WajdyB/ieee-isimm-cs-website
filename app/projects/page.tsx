"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink, Users, Sparkles, Layers, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type Project = {
  title: string
  description: string
  images: string[]
  github: string
  vtools: string
  live?: string
}

const projects: Project[] = [
  {
    title: "CS Twinstack Web Application",
    description: `We are thrilled to announce the successful launch of the CS Twinstack Web Application, a landmark project born from the collaborative spirit of the IEEE student branches at ENICAR SB and ISIMM SB. This application represents the culmination of the CS Twinstack Bootcamp, transforming it from a time-bound event into a permanent, scalable educational resource.
                 This project is a testament to the power of collaboration. It was jointly conceived and developed by IEEE CS Chapter ISIMMSB IEEE CS  Chapter Enicar SB`,
    images: [
      "/images/projects/twinstack3.png",
      "/images/projects/twinstack2.png",
      "/images/projects/twinstack1.png",
    ],
    github: "https://github.com/CS-ISIMM-SBC/CS_Twinstack_webapp",
    vtools: "https://events.vtools.ieee.org/m/514969",
    live: "https://cstwinstack.vercel.app/",
  },
  {
    title: "Project Two",
    description: "Another short description about the second project. Replace later with accurate content about features, tech stack, and impact.",
    images: [
      "/projects/project2-1.jpg",
      "/projects/project2-2.jpg",
      "/projects/project2-3.jpg",
    ],
    github: "https://github.com/your-org/project-two",
    vtools: "https://vtools.ieee.org/",
    live: "https://example.com/project-two",
  },
]

export default function ProjectsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {projects.map((project, index) => (
              <article
                key={index}
                onClick={() => setOpenIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setOpenIndex(index)
                }}
                className="animate-on-scroll flex h-full flex-col overflow-visible rounded-2xl border border-orange-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <div className="flex gap-3 overflow-x-auto p-3">
                    {project.images.map((src, idx) => (
                      <div key={idx} className="relative h-40 w-64 shrink-0 overflow-hidden rounded-xl border border-orange-100">
                        <Image
                          src={src}
                          alt={`${project.title} image ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="256px"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{project.title}</h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 flex-wrap xl:flex-nowrap">
                    {project.live && (
                      <Button
                        asChild
                        variant="secondary"
                        className="bg-orange-50 text-orange-700 hover:bg-orange-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={project.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Globe className="mr-2 h-4 w-4" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Github className="mr-2 h-4 w-4" />
                        View Repository
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="bg-orange-50 text-orange-700 hover:bg-orange-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={project.vtools} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        IEEE vTools
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Dialog open={openIndex !== null} onOpenChange={(isOpen) => !isOpen && setOpenIndex(null)}>
            <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden sm:w-[90vw]">
              {openIndex !== null && (
                <div className="space-y-6 overflow-y-auto max-h-[90vh] p-2 sm:p-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left: Gallery */}
                    <div className="relative overflow-hidden rounded-xl border border-orange-100">
                      <div className="flex gap-4 overflow-x-auto p-3 sm:p-4">
                        {projects[openIndex].images.map((src, idx) => (
                          <div
                            key={idx}
                            className="relative shrink-0 overflow-hidden rounded-lg bg-gray-100 h-[32vh] sm:h-[40vh] w-[85vw] sm:w-[70vw] lg:w-full"
                          >
                            <Image
                              src={src}
                              alt={`${projects[openIndex].title} image ${idx + 1}`}
                              fill
                              className="object-contain"
                              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 70vw, 85vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col">
                      <DialogHeader className="p-0">
                        <DialogTitle className="text-2xl">{projects[openIndex].title}</DialogTitle>
                        <DialogDescription asChild>
                          <div className="text-base leading-relaxed mt-2 max-w-prose text-gray-600">
                            {projects[openIndex].description}
                          </div>
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projects[openIndex].live && (
                          <Button asChild variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                            <Link href={projects[openIndex].live!} target="_blank" rel="noopener noreferrer">
                              <Globe className="mr-2 h-4 w-4" />
                              Live Demo
                            </Link>
                          </Button>
                        )}
                        <Button asChild className="bg-orange-500 hover:bg-orange-600">
                          <Link href={projects[openIndex].github} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            View Repository
                          </Link>
                        </Button>
                        <Button asChild variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                          <Link href={projects[openIndex].vtools} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            IEEE vTools
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
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


