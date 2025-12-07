import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const db = await getDatabase()
    const streaksCollection = db.collection("streaks")

    let userStreak = await streaksCollection.findOne({ userId: new ObjectId(payload.id) })

    if (!userStreak) {
      userStreak = {
        userId: new ObjectId(payload.id),
        streak: 0,
        lastCheckIn: null,
        badges: [],
      }
    }

    return NextResponse.json({
      ...userStreak,
      id: userStreak._id?.toString(),
      userId: userStreak.userId.toString(),
    })
  } catch (error: any) {
    console.error("[v0] Get streak error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
