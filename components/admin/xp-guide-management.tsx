"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Save, Loader2 } from "lucide-react"
import { getXPGuide, updateXPGuide } from "@/lib/api"
import { toast } from "sonner"

const DEFAULT_GUIDE_PLACEHOLDER = `# XP Scoring Rules

## How to Earn XP
- **Event Attendance**: 50-100 XP per event
- **Workshop Participation**: 75-150 XP
- **Competition/Hackathon**: 200-500 XP
- **Project Submission**: 100-200 XP
- **Leadership/Organizing**: 150-300 XP

## Level System
- Every 100 XP = 1 Level
- Level 1 starts at 0 XP

## Achievements
Unlock automatic achievements at XP milestones (100, 500, 1K, 2K, 5K) and level milestones (5, 10, 20, 50).

---
*Customize these rules to match your chapter's scoring system.*`

export default function XPGuideManagement() {
  const [guideContent, setGuideContent] = useState("")
  const [guideLoading, setGuideLoading] = useState(true)
  const [guideSaving, setGuideSaving] = useState(false)

  useEffect(() => {
    loadGuide()
  }, [])

  const loadGuide = async () => {
    try {
      setGuideLoading(true)
      const res = await getXPGuide()
      if (res.success && res.data) {
        setGuideContent(res.data.content || "")
      }
    } catch (error) {
      console.error("Error loading XP guide:", error)
      toast.error("Failed to load XP guide")
    } finally {
      setGuideLoading(false)
    }
  }

  const handleSaveGuide = async () => {
    try {
      setGuideSaving(true)
      const res = await updateXPGuide(guideContent)
      if (res.success) {
        toast.success("XP guide updated successfully! Members will see the new rules.")
      } else {
        toast.error(res.message || "Failed to save guide")
      }
    } catch (error) {
      console.error("Error saving guide:", error)
      toast.error("Failed to save XP guide")
    } finally {
      setGuideSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            XP Guide — Scoring Rules
          </CardTitle>
          <CardDescription>
            Write the rules of your XP system. Use markdown for formatting (headings, bullet lists, bold). This is what members see when they open the guide in their dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {guideLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <>
              <Textarea
                value={guideContent}
                onChange={(e) => setGuideContent(e.target.value)}
                placeholder={DEFAULT_GUIDE_PLACEHOLDER}
                className="min-h-[320px] font-mono text-sm resize-y"
              />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleSaveGuide}
                  disabled={guideSaving}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {guideSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Guide
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
