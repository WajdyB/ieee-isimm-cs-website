"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, TrendingUp, Calendar, LogOut, Crown, Target, Zap, Gift } from "lucide-react"
import { getMembers, getMember } from "@/lib/api"
import Link from "next/link"
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

export default function MemberDashboard() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [allMembers, setAllMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [rank, setRank] = useState(0)

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
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
              ← Back to Website
            </Link>
            <Button variant="outline" onClick={handleLogout} className="border-orange-500 text-orange-600">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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
    </div>
    </>
  )
}
