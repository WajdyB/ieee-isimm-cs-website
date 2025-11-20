"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, X, Instagram, Facebook, Heart, Eye, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

type Reel = {
  id: string
  title: string
  videoSrc: string
  thumbnail?: string
  emoji?: string
  highlight?: boolean
  featured?: boolean
}

const reels: Reel[] = [
  {
    id: "4",
    title: "IEEE Xtreme 19",
    videoSrc: "/reels/ieeextreem19.mp4",
    emoji: "🏆",
    featured: true,
  },
  {
    id: "1",
    title: "AI Dragon Path",
    videoSrc: "/reels/ai-dragon-path.mp4",
    emoji: "🐉",
    highlight: true,
  },
  {
    id: "2",
    title: "CODEX Highlights",
    videoSrc: "/reels/codex.mp4",
    emoji: "💻",
  },
  {
    id: "3",
    title: "Haunted Headset",
    videoSrc: "/reels/haunted-headset.mp4",
    emoji: "🎧",
    highlight: true,
  },
  {
    id: "5",
    title: "IEEE Xtreme 18",
    videoSrc: "/reels/ieeextreme18.mp4",
    emoji: "⚡",
  },
  {
    id: "6",
    title: "What is CS?",
    videoSrc: "/reels/what-is-cs.mp4",
    emoji: "🤔",
  },
]

export default function MomentsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  const openReel = (reel: Reel) => {
    setSelectedReel(reel)
    setIsPlaying(false)
    document.body.style.overflow = "hidden"
  }

  const closeReel = () => {
    setSelectedReel(null)
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    document.body.style.overflow = "unset"
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
              Our <span className="text-orange-500">Moments</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Relive the best moments from our events, competitions, and community activities. 
              Experience the energy, passion, and innovation that defines IEEE CS ISIMM.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="https://www.facebook.com/ieee.cs.isimm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <Facebook className="mr-2 h-5 w-5" />
                  Follow on Facebook
                </Button>
              </Link>
              <Link
                href="https://www.instagram.com/ieee.cs.isimm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <Instagram className="mr-2 h-5 w-5" />
                  Follow on Instagram
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reels Grid - Single Horizontal Row */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {reels.map((reel, index) => (
              <div
                key={reel.id}
                onClick={() => openReel(reel)}
                className="animate-on-scroll group cursor-pointer relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-200/50 hover:-rotate-1 flex-shrink-0 w-[280px] md:w-[320px] snap-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Video Container */}
                <div className="relative aspect-[9/16] bg-gray-900 overflow-hidden">
                  <video
                    src={reel.videoSrc}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => {
                      const video = e.currentTarget
                      video.play().catch(() => {})
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget
                      video.pause()
                      video.currentTime = 0
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Highlight Badge */}
                  {reel.highlight && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg flex items-center gap-1 z-10">
                      <Heart className="h-3 w-3 fill-white" />
                      Hot
                    </div>
                  )}

                  {/* Featured Badge */}
                  {reel.featured && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg flex items-center gap-1 z-10">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </div>
                  )}

                  {/* Emoji Badge */}
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full text-2xl shadow-lg z-10">
                    {reel.emoji}
                  </div>

                  {/* Play Button - Always Visible */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/30 backdrop-blur-sm rounded-full p-3 md:p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm md:text-base drop-shadow-lg line-clamp-2">
                      {reel.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Fullscreen Reel - More Creative */}
      {selectedReel && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeReel}
        >
          <div
            className="relative max-w-md w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player with Glow Effect */}
            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] max-h-[85vh]">
              {/* Close Button - Inside video container, top right */}
              <button
                onClick={closeReel}
                className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md p-2.5 rounded-full hover:bg-black/80 transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <video
                ref={videoRef}
                src={selectedReel.videoSrc}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Title and Actions - More Playful */}
            <div className="mt-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{selectedReel.emoji}</span>
                <h2 className="text-3xl font-bold text-white">
                  {selectedReel.title}
                </h2>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="https://www.facebook.com/ieee.cs.isimm"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    <Facebook className="h-5 w-5 mr-2" />
                    Watch on Facebook
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Don't miss out on future moments! Follow us on social media to stay updated with our latest events, 
              competitions, and community activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://www.facebook.com/ieee.cs.isimm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Facebook className="mr-2 h-5 w-5" />
                  Follow on Facebook
                </Button>
              </Link>
              <Link
                href="https://www.instagram.com/ieee.cs.isimm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Instagram className="mr-2 h-5 w-5" />
                  Follow on Instagram
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

