"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FolderKanban,
  Globe,
  Smartphone,
  Cpu,
  Clock,
  ArrowLeft,
  Loader2,
  FileText,
  X,
} from "lucide-react"
import { getAvailableProjects, type AvailableProjectCategory } from "@/lib/api"

interface AvailableProject {
  _id: string
  category: AvailableProjectCategory
  title: string
  overview: string
  technologies: string[]
  domain: string
  estimatedTime: string
  specificationBook?: string
  created_at: string
}

const CATEGORY_LABELS: Record<AvailableProjectCategory, string> = {
  web_development: "Web Development",
  mobile_development: "Mobile Development",
  software_engineering: "Software Engineering",
}

const CATEGORY_ICONS: Record<AvailableProjectCategory, typeof Globe> = {
  web_development: Globe,
  mobile_development: Smartphone,
  software_engineering: Cpu,
}

const CATEGORY_COLORS: Record<AvailableProjectCategory, string> = {
  web_development: "bg-blue-100 text-blue-800 border-blue-200",
  mobile_development: "bg-green-100 text-green-800 border-green-200",
  software_engineering: "bg-purple-100 text-purple-800 border-purple-200",
}

export default function MemberAvailableProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<AvailableProject[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<AvailableProjectCategory | "all">("all")
  const [selectedProject, setSelectedProject] = useState<AvailableProject | null>(null)

  const openModal = (project: AvailableProject) => {
    setSelectedProject(project)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = "unset"
  }

  useEffect(() => {
    const memberData = localStorage.getItem("memberData")
    if (!memberData) {
      router.push("/member/login")
      return
    }
    loadProjects()
  }, [router])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    if (selectedProject) {
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await getAvailableProjects()
      if (res.success) setProjects(res.data || [])
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/member/dashboard"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available <span className="text-orange-600">Projects</span>
          </h1>
          <p className="text-gray-600">
            Browse projects you can work on. Pick one that matches your skills and interests.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            All
          </Button>
          {(Object.keys(CATEGORY_LABELS) as AvailableProjectCategory[]).map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
              className={filter === cat ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderKanban className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects available</h3>
              <p className="text-gray-600">Check back later for new opportunities.</p>
              <Link href="/member/dashboard">
                <Button variant="outline" className="mt-4 border-orange-500 text-orange-600">
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              const Icon = CATEGORY_ICONS[project.category]
              const techs = Array.isArray(project.technologies) ? project.technologies : []
              return (
                <Card
                  key={project._id}
                  onClick={() => openModal(project)}
                  className="overflow-hidden border-l-4 border-l-orange-500 hover:shadow-xl transition-all cursor-pointer"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={`${CATEGORY_COLORS[project.category]} shrink-0`}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {CATEGORY_LABELS[project.category]}
                      </Badge>
                      {project.estimatedTime && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          {project.estimatedTime}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{project.overview}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.domain && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Domain:</span> {project.domain}
                      </p>
                    )}
                    {project.specificationBook && (
                      <a
                        href={project.specificationBook}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        View specification book
                      </a>
                    )}
                    {techs.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {techs.map((t, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-gray-400/80 backdrop-blur-sm p-2 rounded-full hover:bg-gray-300/80 transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-800" />
              </button>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-12">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={`${CATEGORY_COLORS[selectedProject.category]} shrink-0`}
                  >
                    {(() => {
                      const Icon = CATEGORY_ICONS[selectedProject.category]
                      return (
                        <>
                          <Icon className="h-3 w-3 mr-1" />
                          {CATEGORY_LABELS[selectedProject.category]}
                        </>
                      )
                    })()}
                  </Badge>
                  {selectedProject.estimatedTime && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {selectedProject.estimatedTime}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
                  {selectedProject.overview}
                </p>

                <div className="space-y-4">
                  {selectedProject.domain && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">Domain</h3>
                      <p className="text-gray-600">{selectedProject.domain}</p>
                    </div>
                  )}

                  {Array.isArray(selectedProject.technologies) &&
                    selectedProject.technologies.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map((t, i) => (
                            <Badge key={i} variant="secondary">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedProject.specificationBook && (
                    <div>
                      <a
                        href={selectedProject.specificationBook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        View specification book
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
