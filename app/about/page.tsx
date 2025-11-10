"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Target, Eye, Heart, Users, Lightbulb, Globe } from "lucide-react"
import { aboutImages, getGalleryImages } from "@/lib/images"

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const galleryImages = getGalleryImages()

  // Debug: Log the number of images loaded
  console.log('Gallery images loaded:', galleryImages.length)

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
              About <span className="text-orange-500">CS ISIMM</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
               Discover our journey, mission, and commitment to advancing computing excellence
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-orange-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To advance the theory, practice, and application of computer and information processing science and
                technology. We strive to foster professional growth, technical excellence, and innovation among
                computing professionals and students through educational programs, networking opportunities, and
                collaborative projects that bridge academia and industry.
              </p>
              <div className="flex items-center mb-6">
                <Eye className="h-8 w-8 text-orange-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the leading force in computing innovation and education, creating a community where students and
                professionals collaborate to solve real-world challenges through technology. We envision a future where
                our members are at the forefront of technological advancement, driving positive change in society.
              </p>
            </div>
            <div className="animate-on-scroll">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-200 rounded-3xl transform -rotate-6"></div>
                <Image
                  src={aboutImages.mission.src}
                  alt={aboutImages.mission.alt}
                  width={aboutImages.mission.width}
                  height={aboutImages.mission.height}
                  className={aboutImages.mission.className}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Innovation",
                description:
                  "We foster creativity and encourage innovative thinking to solve complex computing challenges.",
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Building strong partnerships between students, faculty, and industry professionals.",
              },
              {
                icon: Lightbulb,
                title: "Technical Excellence",
                description: "Pursuing the highest standards in computing education and professional development.",
              },
              {
                icon: Globe,
                title: "Global Impact",
                description: "Contributing to technological advancement that benefits society worldwide.",
              },
              {
                icon: Target,
                title: "Continuous Learning",
                description: "Promoting lifelong learning and adaptation to emerging technologies and methodologies.",
              },
              {
                icon: Eye,
                title: "Ethical Computing",
                description:
                  "Advocating for responsible and ethical practices in computing and technology development.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-on-scroll"
              >
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Photo Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey in Pictures</h2>
            <p className="text-xl text-gray-600">Moments that define our community and achievements</p>
            <p className="text-sm text-gray-500 mt-2">Showing {galleryImages.length} images</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg animate-on-scroll bg-gray-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-orange-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="font-semibold">{image.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Be part of a dynamic network of computing professionals and students who are shaping the future of
              technology. Together, we can push the boundaries of what's possible in computing and create innovative
              solutions for tomorrow's challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://www.facebook.com/ieee.cs.isimm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Get Involved
              </Link>
              <Link
                href="https://www.facebook.com/ieee.cs.isimm"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
