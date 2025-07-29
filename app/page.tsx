"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Award, Loader2 } from "lucide-react"

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
                Welcome to the IEEE Computer Society ISIMM Student Branch. We are dedicated to
                inspiring, engaging, encouraging, and empowering students in computer science and engineering
                through professional development, networking, and technical excellence opportunities.
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
              <div className="relative">
                <div className="absolute inset-0 bg-orange-200 rounded-3xl transform rotate-6"></div>
                <Image
                  src="/images/home/hero-image.png"
                  alt="CS ISIMM Members"
                  width={600}
                  height={500}
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 animate-on-scroll">
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">25+</h3>
              <p className="text-gray-600">Events Organized</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10+</h3>
              <p className="text-gray-600">Awards Won</p>
            </div>
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
                    zIndex: 1000
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
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                      View Details
                    </Button>
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
