"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Mail, Linkedin } from "lucide-react"
import { getCommitteeMembers, committeeImages } from "@/lib/images"

export default function CommitteePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const committeeMembers = getCommitteeMembers()

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {committeeMembers.map((member, index) => (
              <div
                key={index}
                className="group animate-on-scroll"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  {/* Portrait - refined aspect ratio, face-focused */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={360}
                      height={450}
                      className={`absolute inset-0 w-full h-full object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-105 ${member.position === "Vice Chair" ? "scale-90" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1.5">
                      {member.position}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      <Link
                        href={member.facebook}
                        target="_blank"
                        className="hover:text-orange-500 transition-colors duration-200"
                      >
                        {member.name}
                      </Link>
                    </h3>
                    <div className="flex justify-center gap-2">
                      <Link
                        href={member.facebook}
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
                      >
                        <Facebook className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`mailto:${member.email}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
                      >
                        <Mail className="h-4 w-4" />
                      </Link>
                      <Link
                        href={member.linkedin}
                        target="_blank"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors duration-200"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <div className="flex items-center gap-4 pl-8">
                <Image
                  src={committeeImages.chair.src}
                  alt={committeeImages.chair.alt}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-200 ring-offset-2"
                />
                <div>
                  <p className="font-bold text-gray-900">Yosr Hadj Ali</p>
                  <p className="text-orange-600 text-sm font-medium">Chairwoman, CS ISIMM</p>
                </div>
              </div>
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
