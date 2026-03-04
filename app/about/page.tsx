"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Target, Eye, Heart, Users, Lightbulb, Globe, Rocket, TrendingUp, Award, Network, CheckCircle2 } from "lucide-react"
import { aboutImages } from "@/lib/images"

export default function AboutPage() {
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
              <div className="relative max-w-md mx-auto">
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


      {/* Strategic Roadmap */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Strategic <span className="text-orange-500">Roadmap</span>
            </h2>
            <p className="text-xl text-gray-600">From vision to impact - our journey of growth and innovation</p>
          </div>

          {/* Strategic Phases */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-600"></div>
            
            <div className="space-y-12">
              {[
                {
                  phase: "Phase 1",
                  title: "Foundation & Community",
                  icon: Users,
                  color: "from-orange-400 to-orange-500",
                  goals: [
                    "Build an active community of 50+ members",
                    "Establish strong leadership and organizational structure",
                    "Create a welcoming environment for all skill levels"
                  ],
                  status: "completed",
                  alignment: "left"
                },
                {
                  phase: "Phase 2",
                  title: "Skills & Knowledge",
                  icon: Lightbulb,
                  color: "from-orange-500 to-orange-600",
                  goals: [
                    "Organize technical workshops and bootcamps",
                    "Provide hands-on training in emerging technologies",
                    "Foster peer-to-peer learning and mentorship"
                  ],
                  status: "in-progress",
                  alignment: "right"
                },
                {
                  phase: "Phase 3",
                  title: "Innovation & Projects",
                  icon: Rocket,
                  color: "from-orange-600 to-red-500",
                  goals: [
                    "Launch collaborative projects solving real problems",
                    "Participate in hackathons and competitions",
                    "Build innovative prototypes and applications"
                  ],
                  status: "in-progress",
                  alignment: "left"
                },
                {
                  phase: "Phase 4",
                  title: "Recognition & Growth",
                  icon: Award,
                  color: "from-orange-600 to-red-600",
                  goals: [
                    "Win awards and recognition at national level",
                    "Expand partnerships with industry leaders",
                    "Become a model IEEE CS chapter"
                  ],
                  status: "upcoming",
                  alignment: "right"
                },
                {
                  phase: "Phase 5",
                  title: "Impact & Legacy",
                  icon: TrendingUp,
                  color: "from-red-500 to-red-600",
                  goals: [
                    "Create lasting impact in tech community",
                    "Mentor next generation of tech leaders",
                    "Contribute to technological advancement in Tunisia"
                  ],
                  status: "upcoming",
                  alignment: "left"
                }
              ].map((phase, index) => (
                <div 
                  key={index} 
                  className={`relative animate-on-scroll ${phase.alignment === "right" ? "lg:ml-auto" : ""} lg:w-1/2 ${phase.alignment === "right" ? "lg:pl-16" : "lg:pr-16"}`}
                >
                  {/* Timeline Node */}
                  <div className={`hidden lg:flex absolute top-8 ${phase.alignment === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"} w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} shadow-lg items-center justify-center z-10 ring-4 ring-white`}>
                    <phase.icon className="h-7 w-7 text-white flex-shrink-0" />
                  </div>

                  {/* Content Card */}
                  <div className={`group relative bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 border-2 ${
                    phase.status === "completed" ? "border-green-300 bg-green-50/50" :
                    phase.status === "in-progress" ? "border-orange-300" : "border-gray-200"
                  } hover:border-orange-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
                    
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                      phase.status === "completed" ? "bg-green-100 text-green-700" :
                      phase.status === "in-progress" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {phase.status === "completed" ? "✓ Achieved" : phase.status === "in-progress" ? "⚡ In Progress" : "🎯 Upcoming"}
                    </div>

                    {/* Mobile Icon */}
                    <div className={`lg:hidden inline-flex p-4 rounded-xl bg-gradient-to-br ${phase.color} mb-4 shadow-lg`}>
                      <phase.icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-sm font-bold text-orange-600 uppercase tracking-wide">{phase.phase}</span>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-orange-600 transition-colors">
                          {phase.title}
                        </h3>
                      </div>
                    </div>

                    <ul className="space-y-3 mt-4">
                      {phase.goals.map((goal, goalIndex) => (
                        <li key={goalIndex} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle2 className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                            phase.status === "completed" ? "text-green-600" : "text-orange-500"
                          }`} />
                          <span className="leading-relaxed">{goal}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Progress Indicator */}
                    {phase.status === "in-progress" && (
                      <div className="mt-6 pt-6 border-t border-orange-200">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-semibold text-gray-700">Progress</span>
                          <span className="font-bold text-orange-600">70%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
