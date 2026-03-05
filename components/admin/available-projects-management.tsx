"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Globe,
  Smartphone,
  Cpu,
  Clock,
  FileText,
} from "lucide-react"
import {
  getAvailableProjects,
  createAvailableProject,
  updateAvailableProject,
  deleteAvailableProject,
  uploadSpecificationBook,
  type AvailableProjectData,
  type AvailableProjectCategory,
} from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

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
  updated_at: string
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

export default function AvailableProjectsManagement() {
  const [projects, setProjects] = useState<AvailableProject[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<AvailableProject | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<AvailableProject | null>(null)
  const [form, setForm] = useState<AvailableProjectData & { _id?: string }>({
    category: "web_development",
    title: "",
    overview: "",
    technologies: "",
    domain: "",
    estimatedTime: "",
    specificationBook: "",
  })
  const [uploadingSpec, setUploadingSpec] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await getAvailableProjects()
      if (res.success) setProjects(res.data || [])
    } catch (error) {
      console.error("Error loading available projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditingProject(null)
    setForm({
      category: "web_development",
      title: "",
      overview: "",
      technologies: "",
      domain: "",
      estimatedTime: "",
      specificationBook: "",
    })
    setShowDialog(true)
  }

  const openEdit = (p: AvailableProject) => {
    setEditingProject(p)
    setForm({
      category: p.category,
      title: p.title,
      overview: p.overview,
      technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies || "",
      domain: p.domain || "",
      estimatedTime: p.estimatedTime || "",
      specificationBook: p.specificationBook || "",
      _id: p._id,
    })
    setShowDialog(true)
  }

  const handleSpecUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed")
      return
    }
    try {
      setUploadingSpec(true)
      const res = await uploadSpecificationBook(file)
      if (res.success && res.url) {
        setForm({ ...form, specificationBook: res.url })
        toast.success("Specification book uploaded")
      } else {
        toast.error(res.message || "Upload failed")
      }
    } catch (error) {
      toast.error("Failed to upload PDF")
    } finally {
      setUploadingSpec(false)
      e.target.value = ""
    }
  }

  const handleSave = async () => {
    if (!form.title || !form.overview) {
      toast.error("Title and overview are required")
      return
    }
    try {
      const techs =
        typeof form.technologies === "string"
          ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
          : form.technologies || []

      const payload: AvailableProjectData = {
        category: form.category,
        title: form.title,
        overview: form.overview,
        technologies: techs,
        domain: form.domain,
        estimatedTime: form.estimatedTime,
        specificationBook: form.specificationBook || "",
      }

      if (editingProject) {
        const res = await updateAvailableProject(editingProject._id, payload)
        if (res.success) {
          setProjects((prev) => prev.map((p) => (p._id === editingProject._id ? res.data : p)))
          toast.success("Project updated!")
        } else toast.error(res.message || "Failed to update")
      } else {
        const res = await createAvailableProject(payload)
        if (res.success) {
          setProjects((prev) => [res.data, ...prev])
          toast.success("Project added!")
        } else toast.error(res.message || "Failed to create")
      }
      setShowDialog(false)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const confirmDelete = (p: AvailableProject) => {
    setProjectToDelete(p)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return
    try {
      const res = await deleteAvailableProject(projectToDelete._id)
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id))
        toast.success("Project deleted")
        setShowDeleteDialog(false)
        setProjectToDelete(null)
      } else toast.error(res.message || "Failed to delete")
    } catch (error) {
      toast.error("Failed to delete project")
    }
  }

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Projects members can browse and apply to work on. Shown on the member dashboard and main projects page.
        </p>
        <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-2 border-orange-200">
          <CardContent className="py-12 text-center">
            <FolderKanban className="h-12 w-12 mx-auto text-orange-300 mb-4" />
            <p className="text-gray-600 mb-2">No available projects yet</p>
            <p className="text-sm text-gray-500 mb-4">Add projects for members to discover and work on.</p>
            <Button onClick={openAdd} variant="outline" className="border-orange-500 text-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => {
            const Icon = CATEGORY_ICONS[p.category]
            return (
              <Card key={p._id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-sm font-medium">
                          <Icon className="h-3 w-3" />
                          {CATEGORY_LABELS[p.category]}
                        </span>
                        {p.estimatedTime && (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            {p.estimatedTime}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-lg text-gray-900">{p.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.overview}</p>
                      {p.domain && (
                        <p className="text-xs text-gray-500 mt-1">Domain: {p.domain}</p>
                      )}
                      {p.technologies && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(Array.isArray(p.technologies) ? p.technologies : []).map((t, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600"
                        onClick={() => confirmDelete(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-lg">
          <div className="shrink-0 border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add Available Project"}</DialogTitle>
              <DialogDescription>
                Projects appear on the member dashboard and main projects page under &quot;Upcoming Projects&quot;.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as AvailableProjectCategory })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="web_development">Web Development</option>
                  <option value="mobile_development">Mobile Development</option>
                  <option value="software_engineering">Software Engineering</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Project title"
                />
              </div>
              <div className="space-y-2">
                <Label>Overview *</Label>
                <Textarea
                  value={form.overview}
                  onChange={(e) => setForm({ ...form, overview: e.target.value })}
                  placeholder="Brief project description and goals"
                  rows={4}
                  className="resize-y min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <Input
                    value={typeof form.technologies === "string" ? form.technologies : (form.technologies || []).join(", ")}
                    onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                    placeholder="React, Node.js (comma-separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Input
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    placeholder="e.g., Education, Healthcare"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Estimated Time</Label>
                <Input
                  value={form.estimatedTime}
                  onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                  placeholder="e.g., 2-3 weeks, 1 month"
                />
              </div>
              <div className="space-y-2">
                <Label>Specification Book</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={handleSpecUpload}
                      disabled={uploadingSpec}
                      className="flex-1"
                    />
                    {uploadingSpec && <Loader2 className="h-4 w-4 animate-spin text-orange-600" />}
                  </div>
                  <p className="text-xs text-gray-500">PDF format only, max 20MB</p>
                  {form.specificationBook && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600 shrink-0" />
                      <a
                        href={form.specificationBook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-800 hover:underline truncate"
                      >
                        View specification book
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-red-600 hover:text-red-700"
                        onClick={() => setForm({ ...form, specificationBook: "" })}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 border-t px-6 py-4 flex justify-end gap-2 bg-gray-50">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
              {editingProject ? "Save" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          {projectToDelete && (
            <div className="py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold">{projectToDelete.title}</p>
                <p className="text-sm text-gray-600">{CATEGORY_LABELS[projectToDelete.category]}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
