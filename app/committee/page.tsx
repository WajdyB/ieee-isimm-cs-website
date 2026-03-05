"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Mail, Linkedin, Loader2, Users, Calendar } from "lucide-react"
import { getExcomMembers } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface ExcomMember {
  _id: string
  name: string
  position: string
  image?: string | null
  facebook?: string
  email?: string
  linkedin?: string
  order?: number
  mandate?: string | null
}

export default function CommitteePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [allMembers, setAllMembers] = useState<ExcomMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMandate, setSelectedMandate] = useState<string | null>(null)

  const mandates = useMemo(() => {
    const set = new Set<string>()
    allMembers.forEach((m) => {
      const mandate = (m.mandate || "").trim()
      set.add(mandate || "Current")
    })
    return Array.from(set).sort((a, b) => {
      if (a === "Current") return -1
      if (b === "Current") return 1
      const yearA = parseInt(a.split("-")[0], 10) || 0
      const yearB = parseInt(b.split("-")[0], 10) || 0
      return yearB - yearA
    })
  }, [allMembers])

  const committeeMembers = useMemo(() => {
    if (!selectedMandate) return []
    return allMembers
      .filter((m) => ((m.mandate || "").trim() || "Current") === selectedMandate)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  }, [allMembers, selectedMandate])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getExcomMembers()
        if (res.success && res.data) setAllMembers(res.data || [])
      } catch (error) {
        console.error("Error loading excom:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (mandates.length > 0 && selectedMandate === null) {
      setSelectedMandate(mandates[0])
    }
  }, [mandates, selectedMandate])

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
  }, [committeeMembers])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Executive <span className="text-orange-500">Committee</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
            Meet the dedicated leaders driving our technical mission forward and fostering innovation in the computing
            community
            </p>
          </div>
        </div>
      </section>

      {/* Committee Members */}
      <section className="py-20 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="container mx-auto px-4">
          {mandates.length > 1 && !loading && (
            <div className="flex justify-center mb-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-orange-300 bg-white hover:bg-orange-50 text-gray-700 gap-2 px-6 py-6 text-base"
                  >
                    <Calendar className="h-5 w-5" />
                    View mandate: {selectedMandate || "Select"}
                    <span className="ml-1">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuLabel>Choose mandate</DropdownMenuLabel>
                  {mandates.map((m) => (
                    <DropdownMenuItem
                      key={m}
                      onClick={() => setSelectedMandate(m)}
                      className={selectedMandate === m ? "bg-orange-50 text-orange-700 font-medium" : ""}
                    >
                      {m}
                      {selectedMandate === m && " ✓"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
            </div>
          ) : committeeMembers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-600">
                {selectedMandate
                  ? `No committee members for mandate ${selectedMandate}.`
                  : "No committee members to display yet."}
              </p>
              <p className="text-gray-500 mt-2">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {committeeMembers.map((member, index) => (
                <div key={member._id} className="group animate-on-scroll">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={360}
                        height={450}
                        priority={index < 6}
                        className={`absolute inset-0 w-full h-full object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-105 ${member.position === "Vice Chair" ? "scale-90" : ""}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1.5">
                        {member.position}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {(member.facebook || member.linkedin) ? (
                          <Link
                            href={member.facebook || member.linkedin || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange-500 transition-colors duration-200"
                          >
                            {member.name}
                          </Link>
                        ) : (
                          <span>{member.name}</span>
                        )}
                      </h3>
                      <div className="flex justify-center gap-2">
                        {member.facebook && (
                          <Link
                            href={member.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
                          >
                            <Facebook className="h-4 w-4" />
                          </Link>
                        )}
                        {member.email && (
                          <Link
                            href={`mailto:${member.email}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
                          >
                            <Mail className="h-4 w-4" />
                          </Link>
                        )}
                        {member.linkedin && (
                          <Link
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
                          >
                            <Linkedin className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leadership Message */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Leadership Message</h2>
            <div className="relative bg-gradient-to-br from-orange-50 to-white p-8 md:p-10 rounded-2xl border border-orange-100 shadow-lg">
              <span className="absolute top-6 left-6 text-6xl text-orange-200 font-serif leading-none">"</span>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed italic pl-8">
                Our executive committee is committed to fostering a vibrant community of computing enthusiasts and
                professionals. We believe that through collaboration, innovation, and continuous learning, we can shape
                the future of technology and create meaningful impact in our field and society.
              </p>
              {(() => {
                const chair = committeeMembers.find(
                  (m) =>
                    m.position.toLowerCase().includes("chair") &&
                    !m.position.toLowerCase().includes("vice")
                )
                if (!chair) return null
                return (
                  <div className="flex items-center gap-4 pl-8">
                    <Image
                      src={chair.image || "/placeholder.svg"}
                      alt={chair.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-200 ring-offset-2"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{chair.name}</p>
                      <p className="text-orange-600 text-sm font-medium">
                        {chair.position}, CS ISIMM
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Get Involved?</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join our team and help us advance computing excellence in our community. We're always looking for
            passionate individuals to contribute to our technical mission and educational initiatives.
            </p>
            <Link
              href="https://www.facebook.com/ieee.cs.isimm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
