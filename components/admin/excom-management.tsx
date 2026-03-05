"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Loader2, Upload, Users, Calendar } from "lucide-react"
import {
  getExcomMembers,
  createExcomMember,
  updateExcomMember,
  deleteExcomMember,
  uploadImages,
  type ExcomMemberData,
} from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { toast } from "sonner"

interface ExcomMember {
  _id: string
  name: string
  position: string
  image?: string | null
  facebook?: string
  email?: string
  linkedin?: string
  order?: number
  mandate?: string | null
  created_at: string
  updated_at: string
}

const POSITION_OPTIONS = [
  "Chairman",
  "Chairwoman",
  "Vice Chair",
  "Treasurer",
  "Secretary",
  "HR Manager",
  "Webmaster",
  "Marketing Manager",
  "Other",
]

const COMMON_MANDATES = ["2025-2026", "2024-2025", "2023-2024", "2022-2023", "2021-2022"]

export default function ExcomManagement() {
  const [members, setMembers] = useState<ExcomMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<ExcomMember | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<ExcomMember | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [form, setForm] = useState<ExcomMemberData & { _id?: string; customPosition?: string }>({
    name: "",
    position: "Chairwoman",
    image: null,
    facebook: "",
    email: "",
    linkedin: "",
    order: 0,
    mandate: "",
    customPosition: "",
  })
  const [mandateFilter, setMandateFilter] = useState<string>("all")

  const mandates = useMemo(() => {
    const set = new Set<string>()
    members.forEach((m) => {
      if (m.mandate && m.mandate.trim()) set.add(m.mandate.trim())
    })
    return Array.from(set).sort((a, b) => {
      const yearA = parseInt(a.split("-")[0], 10) || 0
      const yearB = parseInt(b.split("-")[0], 10) || 0
      return yearB - yearA
    })
  }, [members])

  const filteredMembers = useMemo(() => {
    if (mandateFilter === "all") return members
    return members.filter((m) => (m.mandate || "").trim() === mandateFilter)
  }, [members, mandateFilter])

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const res = await getExcomMembers()
      if (res.success) setMembers(res.data || [])
    } catch (error) {
      console.error("Error loading excom:", error)
      toast.error("Failed to load excom members")
    } finally {
      setLoading(false)
    }
  }

  const openAdd = (presetMandate?: string) => {
    setEditingMember(null)
    const defaultMandate = presetMandate || (mandateFilter !== "all" ? mandateFilter : "")
    setForm({
      name: "",
      position: "Chairwoman",
      image: null,
      facebook: "",
      email: "",
      linkedin: "",
      order: members.length,
      mandate: defaultMandate,
      customPosition: "",
    })
    setShowDialog(true)
  }

  const openEdit = (m: ExcomMember) => {
    setEditingMember(m)
    const isPresetPosition = POSITION_OPTIONS.slice(0, -1).includes(m.position)
    setForm({
      name: m.name,
      position: isPresetPosition ? m.position : "Other",
      image: m.image || null,
      facebook: m.facebook || "",
      email: m.email || "",
      linkedin: m.linkedin || "",
      order: m.order ?? 0,
      mandate: m.mandate || "",
      _id: m._id,
      customPosition: isPresetPosition ? "" : m.position,
    })
    setShowDialog(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed")
      return
    }
    try {
      setUploadingImage(true)
      const res = await uploadImages([file])
      if (res.success && res.files?.length > 0) {
        setForm({ ...form, image: res.files[0].url })
        toast.success("Photo uploaded")
      } else {
        toast.error(res.message || "Upload failed")
      }
    } catch (error) {
      toast.error("Failed to upload photo")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  const removeImage = () => {
    setForm({ ...form, image: null })
  }

  const handleSave = async () => {
    const actualPosition = form.position === "Other" ? (form.customPosition || "").trim() : form.position
    if (!form.name || !actualPosition) {
      toast.error(form.position === "Other" && !(form.customPosition || "").trim()
        ? "Please enter a custom position"
        : "Name and position are required")
      return
    }
    try {
      const payload: ExcomMemberData = {
        name: form.name,
        position: actualPosition,
        image: form.image || null,
        facebook: form.facebook || "",
        email: form.email || "",
        linkedin: form.linkedin || "",
        order: typeof form.order === "number" ? form.order : 0,
        mandate: form.mandate || null,
      }

      if (editingMember) {
        const res = await updateExcomMember(editingMember._id, payload)
        if (res.success) {
          setMembers((prev) =>
            prev.map((m) => (m._id === editingMember._id ? { ...m, ...res.data } : m))
          )
          toast.success("Member updated!")
        } else {
          toast.error(res.message || "Failed to update")
        }
      } else {
        const res = await createExcomMember(payload)
        if (res.success) {
          setMembers((prev) => [res.data, ...prev])
          toast.success("Member added!")
        } else {
          toast.error(res.message || "Failed to add")
        }
      }
      setShowDialog(false)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const confirmDelete = (m: ExcomMember) => {
    setMemberToDelete(m)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!memberToDelete) return
    try {
      const res = await deleteExcomMember(memberToDelete._id)
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m._id !== memberToDelete._id))
        toast.success("Member removed")
        setShowDeleteDialog(false)
        setMemberToDelete(null)
      } else {
        toast.error(res.message || "Failed to delete")
      }
    } catch (error) {
      toast.error("Failed to delete member")
    }
  }

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Manage executive committee members for current and previous mandates. Add members for each mandate—they appear on the /committee page with a mandate selector.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <Label className="text-sm font-medium">Filter by mandate:</Label>
            <select
              value={mandateFilter}
              onChange={(e) => setMandateFilter(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="all">All mandates</option>
              {mandates.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={() => openAdd()} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
          {mandates.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Quick add for:</span>
              {mandates.slice(0, 3).map((m) => (
                <Button
                  key={m}
                  variant="outline"
                  size="sm"
                  onClick={() => openAdd(m)}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  {m}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {members.length === 0 ? (
        <Card className="border-dashed border-2 border-orange-200">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-orange-300 mb-4" />
            <p className="text-gray-600 mb-2">No excom members yet</p>
            <p className="text-sm text-gray-500 mb-4">Add members to display on the Executive Committee page.</p>
            <Button onClick={() => openAdd()} variant="outline" className="border-orange-500 text-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add First Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMembers.length === 0 && mandateFilter !== "all" ? (
            <Card className="border-dashed border-orange-200">
              <CardContent className="py-8 text-center">
                <p className="text-gray-600 mb-4">No members for mandate &quot;{mandateFilter}&quot;.</p>
                <Button variant="outline" className="border-orange-500 text-orange-600" onClick={() => openAdd(mandateFilter)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add first member for {mandateFilter}
                </Button>
              </CardContent>
            </Card>
          ) : (
          filteredMembers.map((m) => (
            <Card key={m._id} className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Users className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg text-gray-900">{m.name}</h4>
                    <p className="text-orange-600 font-medium text-sm">{m.position}</p>
                    {m.email && (
                      <p className="text-xs text-gray-500 truncate">{m.email}</p>
                    )}
                    {m.mandate && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                        {m.mandate}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => openEdit(m)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600"
                      onClick={() => confirmDelete(m)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-2 border-orange-200 shadow-2xl shadow-orange-900/10 sm:rounded-2xl bg-white [&>button]:right-4 [&>button]:top-4 [&>button]:text-white [&>button]:hover:bg-white/20 [&>button]:rounded-full">
          {/* Header */}
          <div className="shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 pr-14 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingMember ? "Edit Excom Member" : "Add Excom Member"}
                </DialogTitle>
                <DialogDescription className="text-orange-100 text-sm mt-0.5">
                  Photo and social links are optional but recommended
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Scrollable form body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {/* Photo section */}
              <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-5">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Profile Photo</Label>
                <div className="flex items-center gap-5">
                  <label className="relative block shrink-0 cursor-pointer">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-white border-2 border-orange-200 shadow-sm ring-2 ring-orange-100">
                      {form.image ? (
                        <>
                          <Image src={form.image} alt="" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-orange-300 gap-1">
                          <Upload className="h-10 w-10" />
                          <span className="text-xs font-medium">Add photo</span>
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-600">
                      {form.image ? "Photo added. Click the preview to change." : "Click the box or drag a photo. JPG, PNG up to 10MB."}
                    </p>
                    {form.image && (
                      <Button type="button" variant="outline" size="sm" onClick={removeImage} className="border-red-200 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                    {uploadingImage && <Loader2 className="h-5 w-5 animate-spin text-orange-600" />}
                  </div>
                </div>
              </div>

              {/* Basic info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-orange-500" />
                  Basic Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <select
                      value={form.position}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          position: e.target.value,
                          customPosition: e.target.value === "Other" ? form.customPosition || "" : "",
                        })
                      }
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {POSITION_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {form.position === "Other" && (
                      <Input
                        value={form.customPosition || ""}
                        onChange={(e) => setForm({ ...form, customPosition: e.target.value })}
                        placeholder="Enter your custom position"
                        className="h-11 mt-2"
                      />
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Mandate (e.g. 2025-2026) *</Label>
                    <Input
                      value={form.mandate || ""}
                      onChange={(e) => setForm({ ...form, mandate: e.target.value })}
                      placeholder="2025-2026"
                      list="excom-mandate-suggestions"
                      className="h-11"
                    />
                    <datalist id="excom-mandate-suggestions">
                      {[...new Set([...COMMON_MANDATES, ...mandates])].map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                    <p className="text-xs text-gray-500">Format YYYY-YYYY for current or previous mandates</p>
                  </div>
                </div>
              </div>

              {/* Contact links */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-orange-500" />
                  Contact & Social
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="member@ieee.org"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook URL</Label>
                    <Input
                      type="url"
                      value={form.facebook}
                      onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input
                      type="url"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Display order */}
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.order ?? 0}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                  placeholder="0"
                  className="h-11 w-24"
                />
                <p className="text-xs text-gray-500">Lower numbers appear first in the list</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t bg-gray-50 px-6 py-4 flex justify-end gap-2 sm:rounded-b-2xl">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 px-6">
              {editingMember ? "Update Member" : "Add Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {memberToDelete?.name} from the executive committee? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
