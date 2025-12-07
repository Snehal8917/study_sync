import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const db = await getDatabase()
    const streaksCollection = db.collection("streaks")

    const today = new Date().toISOString().split("T")[0]
    const userStreak = await streaksCollection.findOne({ userId: new ObjectId(payload.id) })

    if (!userStreak) {
      // Create new streak
      const newStreak = {
        userId: new ObjectId(payload.id),
        streak: 1,
        lastCheckIn: today,
        badges: [],
        createdAt: new Date(),
      }
      const result = await streaksCollection.insertOne(newStreak)
      return NextResponse.json({
        ...newStreak,
        id: result.insertedId.toString(),
        userId: newStreak.userId.toString(),
      })
    } else {
      const lastCheckIn = userStreak.lastCheckIn
      const lastDate = new Date(lastCheckIn)
      const currentDate = new Date(today)
      const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        return NextResponse.json({ message: "Already checked in today" }, { status: 200 })
      }

      let newStreakCount = userStreak.streak
      if (daysDiff === 1) {
        newStreakCount += 1
      } else {
        newStreakCount = 1
      }

      const badges = userStreak.badges || []
      const badgeMilestones = [3, 7, 14, 30]
      badgeMilestones.forEach((milestone) => {
        if (newStreakCount === milestone && !badges.includes(milestone)) {
          badges.push(milestone)
        }
      })

      const result = await streaksCollection.findOneAndUpdate(
        { userId: new ObjectId(payload.id) },
        {
          $set: {
            streak: newStreakCount,
            lastCheckIn: today,
            badges,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return NextResponse.json({
        ...result.value,
        id: result.value._id.toString(),
        userId: result.value.userId.toString(),
      })
    }
  } catch (error: any) {
    console.error("[v0] Check-in error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
