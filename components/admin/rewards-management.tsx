"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Gift, Plus, Edit2, Trash2, Loader2, Zap } from "lucide-react"
import {
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  type RewardData,
} from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Reward {
  _id: string
  requiredXP: number
  title: string
  description: string
  icon: string
  order: number
  created_at: string
  updated_at: string
}

export default function RewardsManagement() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [rewardsLoading, setRewardsLoading] = useState(true)
  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null)
  const [rewardForm, setRewardForm] = useState<RewardData & { _id?: string }>({
    requiredXP: 500,
    title: "",
    description: "",
    icon: "🎁",
    order: 0,
  })

  useEffect(() => {
    loadRewards()
  }, [])

  const loadRewards = async () => {
    try {
      setRewardsLoading(true)
      const res = await getRewards()
      if (res.success) {
        setRewards(res.data || [])
      }
    } catch (error) {
      console.error("Error loading rewards:", error)
      toast.error("Failed to load rewards")
    } finally {
      setRewardsLoading(false)
    }
  }

  const openAddReward = () => {
    setEditingReward(null)
    setRewardForm({
      requiredXP: 500,
      title: "",
      description: "",
      icon: "🎁",
      order: rewards.length,
    })
    setShowRewardDialog(true)
  }

  const openEditReward = (reward: Reward) => {
    setEditingReward(reward)
    setRewardForm({
      requiredXP: reward.requiredXP,
      title: reward.title,
      description: reward.description || "",
      icon: reward.icon || "🎁",
      order: reward.order ?? 0,
      _id: reward._id,
    })
    setShowRewardDialog(true)
  }

  const handleSaveReward = async () => {
    if (!rewardForm.title || typeof rewardForm.requiredXP !== "number") {
      toast.error("Title and Required XP are required")
      return
    }
    try {
      if (editingReward) {
        const res = await updateReward(editingReward._id, {
          requiredXP: rewardForm.requiredXP,
          title: rewardForm.title,
          description: rewardForm.description,
          icon: rewardForm.icon,
          order: rewardForm.order,
        })
        if (res.success) {
          setRewards((prev) =>
            prev.map((r) => (r._id === editingReward._id ? { ...r, ...res.data } : r))
          )
          toast.success("Reward updated!")
        } else toast.error(res.message || "Failed to update")
      } else {
        const res = await createReward({
          requiredXP: rewardForm.requiredXP,
          title: rewardForm.title,
          description: rewardForm.description,
          icon: rewardForm.icon,
          order: rewardForm.order,
        })
        if (res.success) {
          setRewards((prev) => [...prev, res.data].sort((a, b) => a.requiredXP - b.requiredXP))
          toast.success("Reward added!")
        } else toast.error(res.message || "Failed to create")
      }
      setShowRewardDialog(false)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const confirmDeleteReward = (reward: Reward) => {
    setRewardToDelete(reward)
    setShowDeleteDialog(true)
  }

  const handleDeleteReward = async () => {
    if (!rewardToDelete) return
    try {
      const res = await deleteReward(rewardToDelete._id)
      if (res.success) {
        setRewards((prev) => prev.filter((r) => r._id !== rewardToDelete._id))
        toast.success("Reward deleted")
        setShowDeleteDialog(false)
        setRewardToDelete(null)
      } else toast.error(res.message || "Failed to delete")
    } catch (error) {
      toast.error("Failed to delete reward")
    }
  }

  const getRewardTierColor = (xp: number) => {
    if (xp >= 2000) return { gradient: "from-purple-500 to-pink-500", border: "border-l-purple-500" }
    if (xp >= 1000) return { gradient: "from-orange-500 to-red-500", border: "border-l-orange-500" }
    if (xp >= 500) return { gradient: "from-blue-500 to-cyan-500", border: "border-l-blue-500" }
    return { gradient: "from-green-500 to-emerald-500", border: "border-l-green-500" }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Define rewards based on XP thresholds. Example: 500 XP = discount on next event.
        </p>
        <Button onClick={openAddReward} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Reward
        </Button>
      </div>

      {rewardsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : rewards.length === 0 ? (
        <Card className="border-dashed border-2 border-orange-200">
          <CardContent className="py-12 text-center">
            <Gift className="h-12 w-12 mx-auto text-orange-300 mb-4" />
            <p className="text-gray-600 mb-2">No rewards yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Add rewards like discounts, swag, or priority registration for members who reach certain XP thresholds.
            </p>
            <Button onClick={openAddReward} variant="outline" className="border-orange-500 text-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add First Reward
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rewards.map((reward) => (
            <Card
              key={reward._id}
              className={`overflow-hidden border-l-4 hover:shadow-lg transition-all ${getRewardTierColor(reward.requiredXP).border}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${getRewardTierColor(reward.requiredXP).gradient} flex items-center justify-center text-2xl text-white shadow-lg`}
                    >
                      {reward.icon || "🎁"}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{reward.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{reward.description || "—"}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold">
                          <Zap className="h-3 w-3 mr-1" />
                          {reward.requiredXP.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditReward(reward)}
                      className="border-orange-300 text-orange-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDeleteReward(reward)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Reward Dialog */}
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingReward ? "Edit Reward" : "Add Reward"}
            </DialogTitle>
            <DialogDescription>
              Define the XP threshold and reward. Members will see which rewards they've unlocked.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requiredXP">Required XP *</Label>
              <Input
                id="requiredXP"
                type="number"
                min={0}
                value={rewardForm.requiredXP}
                onChange={(e) =>
                  setRewardForm({ ...rewardForm, requiredXP: parseInt(e.target.value) || 0 })
                }
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={rewardForm.title}
                onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                placeholder="e.g., 20% discount on next event"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={rewardForm.description}
                onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                placeholder="e.g., Show this at registration to claim your discount"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (emoji)</Label>
              <Input
                id="icon"
                value={rewardForm.icon}
                onChange={(e) => setRewardForm({ ...rewardForm, icon: e.target.value })}
                placeholder="🎁"
                maxLength={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRewardDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReward} className="bg-orange-500 hover:bg-orange-600">
              {editingReward ? "Save Changes" : "Add Reward"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Reward Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reward? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {rewardToDelete && (
            <div className="py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold">{rewardToDelete.title}</p>
                <p className="text-sm text-gray-600">{rewardToDelete.requiredXP} XP</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteReward}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
