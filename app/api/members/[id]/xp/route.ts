import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

type Context = { params: Promise<{ id: string }> }

// POST - Add XP to member
export async function POST(request: NextRequest, context: Context) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const memberId = params.id
    
    if (!ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid member ID' },
        { status: 400 }
      )
    }

    const { xpToAdd, reason, eventName } = await request.json()

    if (!xpToAdd || typeof xpToAdd !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Invalid XP value' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    // Get current member data
    const member = await db.collection('members').findOne({ _id: new ObjectId(memberId) })
    
    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      )
    }

    const currentXP = member.xp || 0
    const newXP = currentXP + xpToAdd
    const oldLevel = Math.floor(currentXP / 100) + 1
    const newLevel = Math.floor(newXP / 100) + 1
    const leveledUp = newLevel > oldLevel

    // Add activity to history
    const activity = {
      date: new Date(),
      type: 'xp_gained',
      xpGained: xpToAdd,
      reason: reason || 'XP added by admin',
      eventName: eventName || null,
      totalXP: newXP
    }

    // Check for new achievements
    const newAchievements = checkAchievements(newXP, newLevel, member.achievements || [])

    const updateData: any = {
      xp: newXP,
      level: newLevel,
      lastActivity: new Date(),
      updated_at: new Date(),
      $push: { activityHistory: activity }
    }

    if (newAchievements.length > 0) {
      updateData.$push.achievements = { $each: newAchievements }
    }

    await db.collection('members').updateOne(
      { _id: new ObjectId(memberId) },
      updateData
    )

    const updatedMember = await db.collection('members').findOne({ _id: new ObjectId(memberId) })
    const { password, ...sanitizedMember } = updatedMember!

    return NextResponse.json({
      success: true,
      data: sanitizedMember,
      leveledUp,
      newLevel: leveledUp ? newLevel : null,
      newAchievements,
      message: leveledUp 
        ? `Congratulations! Level up to ${newLevel}!` 
        : `${xpToAdd} XP added successfully`
    })
  } catch (error) {
    console.error('Error adding XP:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add XP',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to check for new achievements
function checkAchievements(xp: number, level: number, currentAchievements: any[]): any[] {
  const achievements = []
  const currentAchievementIds = currentAchievements.map(a => a.id)

  // XP milestones
  const xpMilestones = [
    { id: 'xp_100', name: 'First Steps', description: 'Earned 100 XP', requiredXP: 100, icon: '🎯' },
    { id: 'xp_500', name: 'Getting Started', description: 'Earned 500 XP', requiredXP: 500, icon: '⭐' },
    { id: 'xp_1000', name: 'Committed Member', description: 'Earned 1000 XP', requiredXP: 1000, icon: '🏆' },
    { id: 'xp_2000', name: 'Dedicated', description: 'Earned 2000 XP', requiredXP: 2000, icon: '💎' },
    { id: 'xp_5000', name: 'Legend', description: 'Earned 5000 XP', requiredXP: 5000, icon: '👑' },
  ]

  for (const milestone of xpMilestones) {
    if (xp >= milestone.requiredXP && !currentAchievementIds.includes(milestone.id)) {
      achievements.push({
        ...milestone,
        unlockedAt: new Date()
      })
    }
  }

  // Level milestones
  const levelMilestones = [
    { id: 'level_5', name: 'Rising Star', description: 'Reached Level 5', requiredLevel: 5, icon: '🌟' },
    { id: 'level_10', name: 'Expert', description: 'Reached Level 10', requiredLevel: 10, icon: '🎖️' },
    { id: 'level_20', name: 'Master', description: 'Reached Level 20', requiredLevel: 20, icon: '🏅' },
    { id: 'level_50', name: 'Grandmaster', description: 'Reached Level 50', requiredLevel: 50, icon: '👑' },
  ]

  for (const milestone of levelMilestones) {
    if (level >= milestone.requiredLevel && !currentAchievementIds.includes(milestone.id)) {
      achievements.push({
        ...milestone,
        unlockedAt: new Date()
      })
    }
  }

  return achievements
}
