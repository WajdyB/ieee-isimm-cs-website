"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Brain, Code, Shield, Smartphone, Database, Cpu, Loader2, Users, Award, Calendar, TrendingUp } from "lucide-react"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  attendees: number
  images: string[]
  created_at: string
  updated_at: string
}

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

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

  // Load recent events from database
  useEffect(() => {
    const loadRecentEvents = async () => {
      try {
        setLoading(true)
        console.log('Loading events from API...')
        
        // Test if API is reachable
        const testResponse = await fetch('/api/test')
        console.log('Test API Response:', await testResponse.json())
        
        const response = await fetch('/api/events')
        console.log('API Response status:', response.status)
        
        const data = await response.json()
        console.log('API Response data:', data)
        
        if (data.success && data.data) {
          console.log('Events loaded successfully:', data.data.length, 'events')
          const recent = data.data.slice(0, 3)
          setRecentEvents(recent)
        } else {
          console.error('Failed to load events:', data.message)
          setRecentEvents([])
        }
      } catch (error) {
        console.error('Error loading recent events:', error)
        setRecentEvents([])
      } finally {
        setLoading(false)
      }
    }
    
    loadRecentEvents()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Empowering <span className="text-orange-500">Students</span> in Computer Science
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              The IEEE Computer Society ISIMM Student Chapter is an official student chapter of the IEEE
              Computer Society, operating within the global network of the Institute of Electrical and Electronics
              Engineers (IEEE).
              We are a student led technical community dedicated to advancing computing knowledge, fostering
              innovation, and supporting professional development. Through technical events, workshops, and
              collaborative projects, we connect students with the international IEEE ecosystem and prepare future
              technology leaders to contribute to the advancement of computing and society.

              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  <Link href="/about">
                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <Link href="/events">View Events</Link>
                </Button>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-orange-200 rounded-3xl transform rotate-6"></div>
                <Image
                  src="/images/home/hero-image.png"
                  alt="CS ISIMM Members"
                  width={400}
                  height={350}
                  className="relative rounded-3xl shadow-2xl object-contain w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We <span className="text-orange-500">Explore</span>
            </h2>
            <p className="text-xl text-gray-600">Dive into cutting-edge technologies and innovative solutions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Artificial Intelligence",
                description: "Exploring machine learning, deep learning, and AI applications",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: Code,
                title: "Web Development",
                description: "Building modern, responsive web applications and platforms",
                gradient: "from-orange-500 to-yellow-500",
              },
              {
                icon: Shield,
                title: "Cybersecurity",
                description: "Protecting systems and learning ethical hacking techniques",
                gradient: "from-orange-600 to-orange-700",
              },
              {
                icon: Smartphone,
                title: "Mobile Development",
                description: "Creating cross-platform mobile apps with modern frameworks",
                gradient: "from-orange-500 to-amber-500",
              },
              {
                icon: Database,
                title: "Data Science",
                description: "Analyzing data and extracting meaningful insights",
                gradient: "from-orange-600 to-red-600",
              },
              {
                icon: Cpu,
                title: "Competitive Programming",
                description: "Sharpening problem-solving skills through coding challenges",
                gradient: "from-orange-500 to-orange-600",
              },
            ].map((area, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-on-scroll"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${area.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <area.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {area.description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CS ISIMM in Numbers */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              CS ISIMM in <span className="text-orange-500">Numbers</span>
            </h2>
            <p className="text-xl text-gray-600">Our impact and achievements at a glance</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                value: "+40",
                label: "Active Members",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Award,
                value: "+3",
                label: "Awards",
                color: "from-orange-500 to-yellow-500",
              },
              {
                icon: Calendar,
                value: "+30",
                label: "Events Yearly",
                color: "from-orange-600 to-orange-700",
              },
              {
                icon: TrendingUp,
                value: "+100",
                label: "Participants Reached",
                color: "from-orange-500 to-amber-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-on-scroll group"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-lg font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Preview */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              To advance the theory, practice, and application of computer and information processing science and
              technology. We foster professional growth, technical excellence, and innovation among computing
              professionals and students through educational programs, networking opportunities, and collaborative
              projects.
            </p>
            <Button asChild variant="secondary" size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              <Link href="/about">
                Discover Our Story <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Events Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recent Events</h2>
            <p className="text-xl text-gray-600">Stay updated with our latest activities and achievements</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <div
                  key={event._id}
                  className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 animate-on-scroll"
                  style={{ 
                    display: 'block', 
                    visibility: 'visible', 
                    opacity: 1,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.images[0] || '/images/placeholder.jpg'}
                      alt={event.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2 text-sm">
                      {formatDate(event.date)} • {event.location}
                    </p>
                    <p className="text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // No events state
              <div className="w-full text-center py-12">
                <p className="text-gray-500 text-lg">No recent events found</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
