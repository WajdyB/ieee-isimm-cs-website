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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committeeMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-on-scroll"
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="w-full h-80 object-contain object-center group-hover:scale-105 transition-transform duration-300 p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                      <Link
                        href={member.facebook}
                        target="_blank"
                        className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                      >
                        <Facebook className="h-5 w-5 text-white" />
                      </Link>
                      <Link
                        href={`mailto:${member.email}`}
                        className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                      >
                        <Mail className="h-5 w-5 text-white" />
                      </Link>
                      <Link
                        href={member.linkedin}
                        target="_blank"
                        className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors duration-200"
                      >
                        <Linkedin className="h-5 w-5 text-white" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-200">
                    <Link href={member.facebook} target="_blank">
                      {member.name}
                    </Link>
                  </h3>
                  <p className="text-orange-600 font-medium mb-4">{member.position}</p>
                  <div className="flex justify-center space-x-3">
                    <Link
                      href={member.facebook}
                      target="_blank"
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                    >
                      <Facebook className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                    >
                      <Mail className="h-5 w-5" />
                    </Link>
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Leadership Message</h2>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-lg text-gray-600 mb-6 leading-relaxed italic">
              "Our executive committee is committed to fostering a vibrant community of computing enthusiasts and
                professionals. We believe that through collaboration, innovation, and continuous learning, we can shape
                the future of technology and create meaningful impact in our field and society."
              </p>
                <div className="flex items-center justify-center">
                  <Image
                    src={committeeImages.chair.src}
                    alt={committeeImages.chair.alt}
                    width={committeeImages.chair.width}
                    height={committeeImages.chair.height}
                    className={committeeImages.chair.className}
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Nour Touihri</p>
                    <p className="text-orange-600">Chairwoman, CS ISIMM</p>
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
