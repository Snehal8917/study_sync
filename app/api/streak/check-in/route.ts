import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON, writeJSON } from "@/lib/fs"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const streaks = await readJSON("streak.json")
    const userStreakIndex = streaks.findIndex((s: any) => s.userId === payload.id)

    const today = new Date().toISOString().split("T")[0]
    let userStreak = userStreakIndex >= 0 ? streaks[userStreakIndex] : null

    if (!userStreak) {
      userStreak = {
        userId: payload.id,
        streak: 1,
        lastCheckIn: today,
        badges: [],
      }
      streaks.push(userStreak)
    } else {
      const lastCheckIn = userStreak.lastCheckIn
      const lastDate = new Date(lastCheckIn)
      const currentDate = new Date(today)
      const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        return NextResponse.json({ message: "Already checked in today" }, { status: 200 })
      } else if (daysDiff === 1) {
        userStreak.streak += 1
      } else {
        userStreak.streak = 1
      }

      userStreak.lastCheckIn = today

      // Award badges
      const badgeMilestones = [3, 7, 14, 30]
      badgeMilestones.forEach((milestone) => {
        if (userStreak.streak === milestone && !userStreak.badges.includes(milestone)) {
          userStreak.badges.push(milestone)
        }
      })

      streaks[userStreakIndex] = userStreak
    }

    await writeJSON("streak.json", streaks)
    return NextResponse.json(userStreak, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
