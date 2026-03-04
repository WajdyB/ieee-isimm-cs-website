"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trophy, Plus, Edit2, Trash2, TrendingUp, Award, Mail, Loader2, Star, Crown, Target, Copy, Check, Key } from "lucide-react"
import { getMembers, createMember, updateMember, deleteMember, addXP, type MemberData } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

interface Member {
  _id: string
  firstName: string
  lastName: string
  email: string
  xp: number
  level: number
  achievements: Achievement[]
  joinDate: string
  lastActivity: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
}

export default function XPManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showXPDialog, setShowXPDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [tempPassword, setTempPassword] = useState<string>("")
  const [newMemberEmail, setNewMemberEmail] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const [newMember, setNewMember] = useState<MemberData>({
    firstName: "",
    lastName: "",
    email: "",
    xp: 0
  })

  const [xpForm, setXpForm] = useState({
    xpToAdd: 0,
    reason: "",
    eventName: ""
  })

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const response = await getMembers()
      if (response.success) {
        setMembers(response.data)
      }
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) {
      setSuccessMessage("Please fill in all required fields")
      setShowSuccessDialog(true)
      return
    }

    try {
      setLoading(true)
      const response = await createMember(newMember)
      
      if (response.success) {
        setTempPassword(response.data.tempPassword)
        setNewMemberEmail(response.data.email)
        setMembers([...members, response.data])
        setShowAddDialog(false)
        setShowPasswordDialog(true)
        setNewMember({ firstName: "", lastName: "", email: "", xp: 0 })
      } else {
        setSuccessMessage(response.message || "Failed to create member")
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error creating member:', error)
      setSuccessMessage("Failed to create member")
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMember = async () => {
    if (!selectedMember) return

    try {
      setLoading(true)
      const response = await updateMember(selectedMember._id, {
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        email: selectedMember.email
      })
      
      if (response.success) {
        loadMembers()
        setShowEditDialog(false)
        setSelectedMember(null)
        setSuccessMessage("Member updated successfully!")
        setShowSuccessDialog(true)
      } else {
        setSuccessMessage(response.message || "Failed to update member")
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error updating member:', error)
      setSuccessMessage("Failed to update member")
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteMember = (member: Member) => {
    setSelectedMember(member)
    setShowDeleteDialog(true)
  }

  const handleDeleteMember = async () => {
    if (!selectedMember) return

    try {
      setLoading(true)
      const response = await deleteMember(selectedMember._id)
      
      if (response.success) {
        setMembers(members.filter(m => m._id !== selectedMember._id))
        setShowDeleteDialog(false)
        setSelectedMember(null)
        setSuccessMessage("Member deleted successfully!")
        setShowSuccessDialog(true)
      } else {
        setSuccessMessage(response.message || "Failed to delete member")
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      setSuccessMessage("Failed to delete member")
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAddXP = async () => {
    if (!selectedMember || !xpForm.xpToAdd) {
      setSuccessMessage("Please enter XP amount")
      setShowSuccessDialog(true)
      return
    }

    try {
      setLoading(true)
      const memberName = selectedMember.firstName
      const response = await addXP(
        selectedMember._id,
        xpForm.xpToAdd,
        xpForm.reason,
        xpForm.eventName
      )
      
      if (response.success) {
        loadMembers()
        setShowXPDialog(false)
        setXpForm({ xpToAdd: 0, reason: "", eventName: "" })
        
        if (response.leveledUp) {
          setSuccessMessage(`🎉 ${memberName} leveled up to Level ${response.newLevel}!`)
        } else {
          setSuccessMessage(`✅ ${xpForm.xpToAdd} XP added successfully to ${memberName}!`)
        }
        setShowSuccessDialog(true)
      } else {
        setSuccessMessage(response.message || "Failed to add XP")
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error adding XP:', error)
      setSuccessMessage("Failed to add XP")
      setShowSuccessDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Trophy className="h-5 w-5 text-orange-600" />
    return <Target className="h-5 w-5 text-gray-400" />
  }

  const getLevelColor = (level: number) => {
    if (level >= 20) return "from-purple-500 to-pink-500"
    if (level >= 10) return "from-orange-500 to-red-500"
    if (level >= 5) return "from-blue-500 to-cyan-500"
    return "from-green-500 to-emerald-500"
  }

  const calculateProgress = (xp: number) => {
    const currentLevelXP = (Math.floor(xp / 100)) * 100
    const nextLevelXP = currentLevelXP + 100
    const progress = ((xp - currentLevelXP) / 100) * 100
    return progress
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
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
    <>
      <Toaster position="top-center" />
      <div className="space-y-6">
        {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{members.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {members.reduce((sum, m) => sum + m.xp, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {members.length > 0 ? (members.reduce((sum, m) => sum + m.level, 0) / members.length).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Top Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {members.length > 0 ? Math.max(...members.map(m => m.level)) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Members Leaderboard</h3>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {members.map((member, index) => (
          <Card key={member._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(index)}
                    <span className="ml-1 font-bold text-gray-600">#{index + 1}</span>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">
                        {member.firstName} {member.lastName}
                      </h4>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getLevelColor(member.level)} text-white text-sm font-bold`}>
                        <Star className="h-3 w-3 mr-1" />
                        Level {member.level}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </span>
                      <span className="font-bold text-orange-600">{member.xp.toLocaleString()} XP</span>
                      <span>{member.achievements?.length || 0} Achievements</span>
                    </div>
                    
                    {/* XP Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress to Level {member.level + 1}</span>
                        <span>{member.xp % 100}/100 XP</span>
                      </div>
                      <Progress value={calculateProgress(member.xp)} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member)
                      setShowXPDialog(true)
                    }}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Add XP
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member)
                      setShowEditDialog(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmDeleteMember(member)}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Achievements */}
              {member.achievements && member.achievements.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.achievements.slice(0, 5).map((achievement) => (
                    <Badge key={achievement.id} variant="secondary" className="bg-orange-100 text-orange-700">
                      {achievement.icon} {achievement.name}
                    </Badge>
                  ))}
                  {member.achievements.length > 5 && (
                    <Badge variant="secondary">+{member.achievements.length - 5} more</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {members.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No members yet. Add your first member to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Create a new member profile. A temporary password will be generated and should be sent to the member via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={newMember.firstName}
                onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={newMember.lastName}
                onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialXP">Initial XP (optional)</Label>
              <Input
                id="initialXP"
                type="number"
                value={newMember.xp}
                onChange={(e) => setNewMember({ ...newMember, xp: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update member information</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={selectedMember.firstName}
                  onChange={(e) => setSelectedMember({ ...selectedMember, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={selectedMember.lastName}
                  onChange={(e) => setSelectedMember({ ...selectedMember, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={selectedMember.email}
                  onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} className="bg-orange-500 hover:bg-orange-600">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add XP Dialog */}
      <Dialog open={showXPDialog} onOpenChange={setShowXPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add XP to {selectedMember?.firstName} {selectedMember?.lastName}</DialogTitle>
            <DialogDescription>
              Reward member with XP points. This will update their level and potentially unlock achievements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="xpAmount">XP Amount *</Label>
              <Input
                id="xpAmount"
                type="number"
                value={xpForm.xpToAdd}
                onChange={(e) => setXpForm({ ...xpForm, xpToAdd: parseInt(e.target.value) || 0 })}
                placeholder="50"
              />
              <p className="text-xs text-gray-500">Suggested: Workshop (50 XP), Event (100 XP), Competition (200 XP)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={xpForm.reason}
                onChange={(e) => setXpForm({ ...xpForm, reason: e.target.value })}
                placeholder="e.g., Attended workshop"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name (optional)</Label>
              <Input
                id="eventName"
                value={xpForm.eventName}
                onChange={(e) => setXpForm({ ...xpForm, eventName: e.target.value })}
                placeholder="e.g., AI Serenity Bootcamp"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowXPDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddXP} className="bg-green-500 hover:bg-green-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Add XP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Display Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <Check className="h-6 w-6" />
              Member Created Successfully!
            </DialogTitle>
            <DialogDescription>
              The member account has been created. Please save these credentials and send them to the member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Email Display */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Email Address</Label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-mono text-sm">{newMemberEmail}</p>
              </div>
            </div>

            {/* Password Display */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Temporary Password</Label>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-orange-600" />
                    <p className="font-mono text-lg font-bold text-orange-900">{tempPassword}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <p className="font-semibold text-amber-900 text-sm mb-1">Important</p>
                  <p className="text-amber-800 text-xs">
                    This password will only be shown once. Make sure to save it and send it to the member via email.
                    The member should change this password after their first login.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              onClick={() => {
                setShowPasswordDialog(false)
                setTempPassword("")
                setNewMemberEmail("")
                setCopied(false)
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="h-6 w-6" />
              Delete Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {selectedMember.firstName} {selectedMember.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedMember.email}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Level {selectedMember.level} • {selectedMember.xp} XP • {selectedMember.achievements?.length || 0} Achievements
                </p>
              </div>
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-900">
                  ⚠️ All member data, including XP, achievements, and activity history will be permanently deleted.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteMember}
              className="bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success/Error Message Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {successMessage.includes("success") || successMessage.includes("🎉") || successMessage.includes("✅") ? (
                <>
                  <Check className="h-6 w-6 text-green-600" />
                  <span className="text-green-700">Success</span>
                </>
              ) : (
                <>
                  <Award className="h-6 w-6 text-orange-600" />
                  <span>Notification</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">{successMessage}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-orange-500 hover:bg-orange-600">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  )
}
