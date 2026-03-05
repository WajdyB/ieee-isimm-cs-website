"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FolderKanban, UserPlus, Trash2, Users, Calendar, Github, Loader2 } from "lucide-react"
import {
  getProjects,
  getMembers,
  getAvailableProjects,
  createProject,
  updateProject,
  deleteProject,
  type ProjectAssignmentData,
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
  memberId: { toString: () => string } | string
  githubRepo: string
  submittedAt: string
}

interface AvailableProject {
  _id: string
  title: string
  overview: string
  category: string
}

interface Project {
  _id: string
  availableProjectId?: string
  title: string
  overview?: string
  deadline: string
  memberIds: string[]
  submissions?: Submission[]
  created_at: string
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [availableProjects, setAvailableProjects] = useState<AvailableProject[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [assignForm, setAssignForm] = useState<ProjectAssignmentData>({
    availableProjectId: "",
    deadline: "",
    memberIds: [],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [projRes, memRes, availRes] = await Promise.all([
        getProjects(),
        getMembers(),
        getAvailableProjects(),
      ])
      if (projRes.success) setProjects(projRes.data || [])
      if (memRes.success) setMembers(memRes.data || [])
      if (availRes.success) setAvailableProjects(availRes.data || [])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignProject = async () => {
    if (!assignForm.availableProjectId || !assignForm.deadline) {
      toast.error("Please select a project and set a deadline")
      return
    }
    if (!assignForm.memberIds?.length) {
      toast.error("Please assign at least one member")
      return
    }
    try {
      setLoading(true)
      const res = await createProject(assignForm)
      if (res.success) {
        setProjects([res.data, ...projects])
        setShowAssignDialog(false)
        setAssignForm({ availableProjectId: "", deadline: "", memberIds: [] })
        toast.success("Project assigned!")
      } else {
        toast.error(res.message || "Failed to assign project")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to assign project")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProject = async () => {
    if (!selectedProject) return
    try {
      setLoading(true)
      const res = await updateProject(selectedProject._id, {
        deadline: selectedProject.deadline,
        memberIds: selectedProject.memberIds || [],
      })
      if (res.success) {
        setProjects(projects.map((p) => (p._id === selectedProject._id ? res.data : p)))
        setShowEditDialog(false)
        setSelectedProject(null)
        toast.success("Assignment updated!")
      } else {
        toast.error(res.message || "Failed to update")
      }
    } catch (error) {
      toast.error("Failed to update assignment")
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
        toast.success("Assignment removed")
      } else {
        toast.error(res.message || "Failed to delete")
      }
    } catch (error) {
      toast.error("Failed to delete assignment")
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
      return typeof mid === "string" ? mid === memberId : (mid as { toString: () => string }).toString() === memberId
    })

  const getAvailTitle = (id: string) => availableProjects.find((a) => a._id === id)?.title ?? "Unknown project"

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
        <div>
          <h3 className="text-2xl font-bold">Projects Hub</h3>
          <p className="text-sm text-gray-600 mt-0.5">Assign available projects to members from the XP System</p>
        </div>
        <Button
          onClick={() => {
            setAssignForm({ availableProjectId: "", deadline: "", memberIds: [] })
            setShowAssignDialog(true)
          }}
          className="bg-orange-500 hover:bg-orange-600"
          disabled={availableProjects.length === 0}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Project
        </Button>
      </div>

      {availableProjects.length === 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="py-4">
            <p className="text-sm text-amber-800">
              No available projects yet. Add projects in the <strong>Available Projects</strong> tab first.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <FolderKanban className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No assignments yet.</p>
              <p className="text-sm mt-1">Assign an available project to members to get started.</p>
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
                      <CardTitle>{project.title || getAvailTitle(project.availableProjectId || "")}</CardTitle>
                      {project.overview && (
                        <CardDescription className="mt-1 line-clamp-2">{project.overview}</CardDescription>
                      )}
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

      {/* Assign Project Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col overflow-hidden p-0">
          <div className="shrink-0 px-6 py-4 border-b">
            <DialogHeader>
              <DialogTitle>Assign Project to Members</DialogTitle>
              <DialogDescription>
                Choose an available project and assign it to members. They will see it in their dashboard and can submit their work.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label>Available Project *</Label>
              <select
                value={assignForm.availableProjectId}
                onChange={(e) => setAssignForm({ ...assignForm, availableProjectId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a project...</option>
                {availableProjects.map((ap) => (
                  <option key={ap._id} value={ap._id}>
                    {ap.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Deadline *</Label>
              <Input
                type="date"
                value={assignForm.deadline}
                onChange={(e) => setAssignForm({ ...assignForm, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Assign Members *</Label>
              <select
                value=""
                onChange={(e) => {
                  const id = e.target.value
                  if (!id) return
                  const ids = assignForm.memberIds || []
                  if (!ids.includes(id)) {
                    setAssignForm({ ...assignForm, memberIds: [...ids, id] })
                  }
                  e.target.value = ""
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select member to add...</option>
                {members
                  .filter((m) => !assignForm.memberIds?.includes(m._id))
                  .map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.firstName} {m.lastName} ({m.email})
                    </option>
                  ))}
              </select>
              {(assignForm.memberIds?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {assignForm.memberIds?.map((id) => {
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
                            setAssignForm({
                              ...assignForm,
                              memberIds: assignForm.memberIds?.filter((x) => x !== id) || [],
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
          <div className="shrink-0 border-t px-6 py-4 flex justify-end gap-2 bg-gray-50">
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignProject} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Update deadline or assigned members. The project cannot be changed.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Project</p>
                <p className="text-gray-900">{selectedProject.title}</p>
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
                <Label>Assigned Members</Label>
                <select
                  value=""
                  onChange={(e) => {
                    const id = e.target.value
                    if (!id) return
                    toggleMember(selectedProject, id)
                    e.target.value = ""
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
            <DialogTitle>Remove Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this assignment? Members will no longer see it. Submissions are preserved.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="py-2">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold">{selectedProject.title}</p>
                <p className="text-sm text-gray-600">
                  {selectedProject.memberIds?.length || 0} member(s) assigned
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
