"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, TrendingUp, Calendar, LogOut, Crown, Target, Zap, Gift, Key, Eye, EyeOff, Loader2, FolderKanban, Github, ExternalLink } from "lucide-react"
import { getMembers, getMember, changeMemberPassword, getProjects, submitProject } from "@/lib/api"
import Link from "next/link"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Member {
  _id: string
  firstName: string
  lastName: string
  email: string
  xp: number
  level: number
  achievements: Achievement[]
  activityHistory: Activity[]
  joinDate: string
  lastActivity: string
  rewards: Reward[]
  rewardsRedeemed: string[]
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
}

interface Activity {
  date: string
  type: string
  xpGained: number
  reason: string
  eventName?: string
  totalXP: number
}

interface Reward {
  id: string
  name: string
  description: string
  requiredLevel: number
  icon: string
}

interface ProjectSubmission {
  memberId: unknown
  githubRepo: string
  submittedAt: string
}

interface HubProject {
  _id: string
  title: string
  description: string
  deadline: string
  memberIds: string[]
  submissions?: ProjectSubmission[]
}

export default function MemberDashboard() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [allMembers, setAllMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [rank, setRank] = useState(0)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [myProjects, setMyProjects] = useState<HubProject[]>([])
  const [submittingProjectId, setSubmittingProjectId] = useState<string | null>(null)
  const [githubRepoInput, setGithubRepoInput] = useState<Record<string, string>>({})

  useEffect(() => {
    loadMemberData()
  }, [])

  const loadMemberData = async () => {
    try {
      setLoading(true)
      
      // Get member data from localStorage
      const memberDataStr = localStorage.getItem('memberData')
      if (!memberDataStr) {
        router.push('/member/login')
        return
      }

      const memberData = JSON.parse(memberDataStr)
      
      // Fetch fresh member data
      const memberResponse = await getMember(memberData._id)
      if (memberResponse.success) {
        setMember(memberResponse.data)
      }

      // Fetch all members for ranking
      const membersResponse = await getMembers()
      if (membersResponse.success) {
        setAllMembers(membersResponse.data)
        const memberRank = membersResponse.data.findIndex((m: Member) => m._id === memberData._id) + 1
        setRank(memberRank)
      }

      // Fetch projects assigned to this member
      const projectsResponse = await getProjects(memberData._id)
      if (projectsResponse.success) {
        setMyProjects(projectsResponse.data || [])
      }
    } catch (error) {
      console.error('Error loading member data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('memberData')
    router.push('/member/login')
  }

  const handleChangePassword = async () => {
    if (!member) return

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    try {
      setChangingPassword(true)
      const response = await changeMemberPassword(member._id, passwordForm.currentPassword, passwordForm.newPassword)
      
      if (response.success) {
        toast.success("Password changed successfully!")
        setShowPasswordDialog(false)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(response.message || "Failed to change password")
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error("Failed to change password. Please try again.")
    } finally {
      setChangingPassword(false)
    }
  }

  const handleSubmitProject = async (projectId: string) => {
    if (!member) return
    const repo = githubRepoInput[projectId]?.trim()
    if (!repo || !repo.startsWith("https://github.com/")) {
      toast.error("Please enter a valid GitHub repository URL")
      return
    }
    try {
      setSubmittingProjectId(projectId)
      const res = await submitProject(projectId, member._id, repo)
      if (res.success) {
        setMyProjects((prev) =>
          prev.map((p) => (p._id === projectId ? res.data : p))
        )
        setGithubRepoInput((prev) => ({ ...prev, [projectId]: "" }))
        toast.success("Submission received!")
      } else {
        toast.error(res.message || "Failed to submit")
      }
    } catch (error) {
      toast.error("Failed to submit")
    } finally {
      setSubmittingProjectId(null)
    }
  }

  const getMySubmission = (project: HubProject) =>
    project.submissions?.find((s) => {
      const mid = s.memberId
      if (!mid) return false
      const str = typeof mid === "string" ? mid : (mid as { toString: () => string }).toString()
      return str === member?._id
    })

  const calculateProgress = (xp: number) => {
    const currentLevelXP = (Math.floor(xp / 100)) * 100
    const progress = ((xp - currentLevelXP) / 100) * 100
    return progress
  }

  const getNextLevelXP = (xp: number) => {
    const currentLevelXP = (Math.floor(xp / 100)) * 100
    return currentLevelXP + 100
  }

  const getLevelColor = (level: number) => {
    if (level >= 20) return "from-purple-500 to-pink-500"
    if (level >= 10) return "from-orange-500 to-red-500"
    if (level >= 5) return "from-blue-500 to-cyan-500"
    return "from-green-500 to-emerald-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-orange-600 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
              ← Back to Website
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(true)} className="border-orange-500 text-orange-600">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-orange-500 text-orange-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-orange-600">{member.firstName}!</span>
          </h1>
          <p className="text-gray-600">Track your progress and achievements in the CS ISIMM community</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8" />
                <div className="text-right">
                  <p className="text-sm opacity-90">Your Level</p>
                  <p className="text-3xl font-bold">{member.level}</p>
                </div>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-sm font-bold mt-2`}>
                <Zap className="h-3 w-3 mr-1" />
                {member.xp % 100}/100 XP to next level
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Trophy className="h-8 w-8 text-orange-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total XP</p>
                  <p className="text-3xl font-bold text-orange-600">{member.xp.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Rank</p>
                  <p className="text-3xl font-bold text-blue-600">#{rank}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Award className="h-8 w-8 text-purple-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-600">Achievements</p>
                  <p className="text-3xl font-bold text-purple-600">{member.achievements?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Level Progress</CardTitle>
                <CardDescription>Keep earning XP to level up!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-6 rounded-2xl bg-gradient-to-r ${getLevelColor(member.level)} text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-90">Current Level</p>
                        <p className="text-4xl font-bold">{member.level}</p>
                      </div>
                      <Star className="h-16 w-16 opacity-50" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{member.xp} XP</span>
                        <span>{getNextLevelXP(member.xp)} XP</span>
                      </div>
                      <Progress value={calculateProgress(member.xp)} className="h-3 bg-white bg-opacity-30" />
                      <p className="text-sm opacity-90">
                        {100 - (member.xp % 100)} XP needed for Level {member.level + 1}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-600" />
                  Achievements ({member.achievements?.length || 0})
                </CardTitle>
                <CardDescription>Unlock achievements by earning XP and leveling up</CardDescription>
              </CardHeader>
              <CardContent>
                {member.achievements && member.achievements.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {member.achievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className="p-4 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                            <p className="text-xs text-gray-500">
                              Unlocked: {formatDate(achievement.unlockedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No achievements yet. Keep earning XP to unlock them!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest XP gains and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                {member.activityHistory && member.activityHistory.length > 0 ? (
                  <div className="space-y-3">
                    {member.activityHistory.slice(0, 10).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.reason}</p>
                          {activity.eventName && (
                            <p className="text-sm text-gray-600">{activity.eventName}</p>
                          )}
                          <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-700">
                            +{activity.xpGained} XP
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Total: {activity.totalXP}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No activity yet. Start participating in events!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projects Hub */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FolderKanban className="h-5 w-5 mr-2 text-orange-600" />
                  My Projects
                </CardTitle>
                <CardDescription>Projects assigned to you. Submit your GitHub repo before the deadline.</CardDescription>
              </CardHeader>
              <CardContent>
                {myProjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FolderKanban className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No projects assigned yet. Stay tuned for new challenges!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myProjects.map((project) => {
                      const submission = getMySubmission(project)
                      const deadline = new Date(project.deadline)
                      const isPastDeadline = new Date() > deadline
                      const canSubmit = !isPastDeadline

                      return (
                        <div
                          key={project._id}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-200 transition-colors"
                        >
                          <h4 className="font-bold text-gray-900 mb-1">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {formatDate(project.deadline)}
                            {isPastDeadline && (
                              <span className="ml-2 text-red-600 font-medium">(Passed)</span>
                            )}
                          </p>
                          {submission ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <span className="text-sm text-green-700 font-medium">Submitted</span>
                              <a
                                href={submission.githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-orange-600 hover:underline text-sm"
                              >
                                <Github className="h-4 w-4" />
                                View Repo
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          ) : canSubmit ? (
                            <div className="flex gap-2">
                              <Input
                                placeholder="https://github.com/username/repo"
                                value={githubRepoInput[project._id] || ""}
                                onChange={(e) =>
                                  setGithubRepoInput((prev) => ({
                                    ...prev,
                                    [project._id]: e.target.value,
                                  }))
                                }
                                className="flex-1 text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleSubmitProject(project._id)}
                                disabled={submittingProjectId === project._id}
                                className="bg-orange-500 hover:bg-orange-600 shrink-0"
                              >
                                {submittingProjectId === project._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Submit"
                                )}
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Submission deadline has passed</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Leaderboard & Info */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Top 10 members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allMembers.slice(0, 10).map((m, index) => (
                    <div 
                      key={m._id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        m._id === member._id ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                        {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                        {index === 2 && <Trophy className="h-5 w-5 text-orange-600" />}
                        {index > 2 && <span className="font-bold text-gray-400">#{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${m._id === member._id ? 'text-orange-700' : 'text-gray-900'}`}>
                          {m.firstName} {m.lastName}
                          {m._id === member._id && <span className="ml-2 text-xs">(You)</span>}
                        </p>
                        <p className="text-sm text-gray-600">Level {m.level} • {m.xp} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Member Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{member.firstName} {member.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">{formatDate(member.joinDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Activity</p>
                  <p className="font-semibold">{formatDate(member.lastActivity)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Motivation Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Keep Growing! 🚀</h3>
                <p className="text-sm opacity-90">
                  Attend events, participate in workshops, and contribute to projects to earn more XP and climb the leaderboard!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-orange-600" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Update your password. Make sure to use a strong password with at least 6 characters.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password *</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  disabled={changingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={changingPassword}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  disabled={changingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={changingPassword}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  disabled={changingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={changingPassword}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-800">
                <strong>Password Requirements:</strong> At least 6 characters long
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPasswordDialog(false)
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                setShowCurrentPassword(false)
                setShowNewPassword(false)
                setShowConfirmPassword(false)
              }}
              disabled={changingPassword}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangePassword}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={changingPassword}
            >
              {changingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
