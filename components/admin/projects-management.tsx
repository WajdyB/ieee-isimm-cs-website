"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FolderKanban, Plus, Trash2, Users, Calendar, Github, Loader2 } from "lucide-react"
import {
  getProjects,
  getMembers,
  createProject,
  updateProject,
  deleteProject,
  type ProjectData,
} from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Member {
  _id: string
  firstName: string
  lastName: string
  email: string
  xp: number
}

interface Submission {
  memberId: { toString: () => string }
  githubRepo: string
  submittedAt: string
}

interface Project {
  _id: string
  title: string
  description: string
  deadline: string
  memberIds: string[]
  submissions?: Submission[]
  created_at: string
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<ProjectData>({
    title: "",
    description: "",
    deadline: "",
    memberIds: [],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [projRes, memRes] = await Promise.all([getProjects(), getMembers()])
      if (projRes.success) setProjects(projRes.data)
      if (memRes.success) setMembers(memRes.data)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.deadline) {
      toast.error("Please fill in title, description, and deadline")
      return
    }
    try {
      setLoading(true)
      const res = await createProject(newProject)
      if (res.success) {
        setProjects([res.data, ...projects])
        setShowAddDialog(false)
        setNewProject({ title: "", description: "", deadline: "", memberIds: [] })
        toast.success("Project created!")
      } else {
        toast.error(res.message || "Failed to create project")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProject = async () => {
    if (!selectedProject) return
    try {
      setLoading(true)
      const res = await updateProject(selectedProject._id, {
        title: selectedProject.title,
        description: selectedProject.description,
        deadline: selectedProject.deadline,
        memberIds: selectedProject.memberIds || [],
      })
      if (res.success) {
        setProjects(projects.map((p) => (p._id === selectedProject._id ? res.data : p)))
        setShowEditDialog(false)
        setSelectedProject(null)
        toast.success("Project updated!")
      } else {
        toast.error(res.message || "Failed to update")
      }
    } catch (error) {
      toast.error("Failed to update project")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return
    try {
      setLoading(true)
      const res = await deleteProject(selectedProject._id)
      if (res.success) {
        setProjects(projects.filter((p) => p._id !== selectedProject._id))
        setShowDeleteDialog(false)
        setSelectedProject(null)
        toast.success("Project deleted")
      } else {
        toast.error(res.message || "Failed to delete")
      }
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setLoading(false)
    }
  }

  const toggleMember = (project: Project, memberId: string) => {
    const ids = project.memberIds || []
    const newIds = ids.includes(memberId)
      ? ids.filter((id) => id !== memberId)
      : [...ids, memberId]
    setSelectedProject({ ...project, memberIds: newIds })
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const getMemberName = (memberId: string) => {
    const m = members.find((x) => x._id === memberId)
    return m ? `${m.firstName} ${m.lastName}` : "Unknown"
  }

  const getSubmission = (project: Project, memberId: string) =>
    project.submissions?.find((s) => {
      const mid = s.memberId
      if (!mid) return false
      return typeof mid === 'string' ? mid === memberId : (mid as { toString: () => string }).toString() === memberId
    })

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
        <h3 className="text-2xl font-bold">Projects Hub</h3>
        <Button onClick={() => setShowAddDialog(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No projects yet. Create one to assign to members.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            const memberIds = project.memberIds || []
            return (
              <Card key={project._id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProject({ ...project })
                          setShowEditDialog(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedProject(project)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Deadline: {formatDate(project.deadline)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      {memberIds.length} member(s)
                    </span>
                  </div>
                  {memberIds.length > 0 && (
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <p className="text-xs font-medium text-gray-500 mb-2">Assigned members & submissions</p>
                      <div className="space-y-1 text-sm">
                        {memberIds.map((mid) => {
                          const sub = getSubmission(project, mid)
                          return (
                            <div key={mid} className="flex items-center justify-between">
                              <span>{getMemberName(mid)}</span>
                              {sub ? (
                                <a
                                  href={sub.githubRepo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-orange-600 hover:underline"
                                >
                                  <Github className="h-3 w-3" />
                                  Submitted
                                </a>
                              ) : (
                                <span className="text-gray-400">Pending</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Add Project Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>Create a project. You can assign members now or later.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Project description and requirements"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Assign Members (optional)</Label>
              <select
                value=""
                onChange={(e) => {
                  const id = e.target.value
                  if (!id) return
                  const ids = newProject.memberIds || []
                  if (!ids.includes(id)) {
                    setNewProject({ ...newProject, memberIds: [...ids, id] })
                  }
                  e.target.value = ""
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select member to add...</option>
                {members
                  .filter((m) => !newProject.memberIds?.includes(m._id))
                  .map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.firstName} {m.lastName} ({m.email})
                    </option>
                  ))}
              </select>
              {(newProject.memberIds?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.memberIds?.map((id) => {
                    const m = members.find((x) => x._id === id)
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-800 text-sm"
                      >
                        {m ? `${m.firstName} ${m.lastName}` : id}
                        <button
                          type="button"
                          onClick={() =>
                            setNewProject({
                              ...newProject,
                              memberIds: newProject.memberIds?.filter((x) => x !== id) || [],
                            })
                          }
                          className="hover:text-orange-600 ml-1"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}
              {members.length === 0 && (
                <p className="text-sm text-gray-500 py-1">No members yet. Create members in XP System first.</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details and assigned members</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={selectedProject.title}
                  onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={
                    selectedProject.deadline
                      ? new Date(selectedProject.deadline).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) => setSelectedProject({ ...selectedProject, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Members (optional)</Label>
                <select
                  value=""
                  onChange={(e) => {
                    const id = e.target.value
                    if (!id) return
                    toggleMember(selectedProject, id)
                    e.target.value = ""
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select member to add...</option>
                  {members
                    .filter((m) => !selectedProject.memberIds?.includes(m._id))
                    .map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.firstName} {m.lastName} ({m.email})
                      </option>
                    ))}
                </select>
                {(selectedProject.memberIds?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProject.memberIds?.map((id) => {
                      const m = members.find((x) => x._id === id)
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-800 text-sm"
                        >
                          {m ? `${m.firstName} ${m.lastName}` : id}
                          <button
                            type="button"
                            onClick={() => toggleMember(selectedProject, id)}
                            className="hover:text-orange-600 ml-1"
                            aria-label="Remove"
                          >
                            ×
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProject} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProject?.title}"? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
