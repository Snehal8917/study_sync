import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON } from "@/lib/fs"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const streaks = await readJSON("streak.json")
    const userStreak = streaks.find((s: any) => s.userId === payload.id) || {
      userId: payload.id,
      streak: 0,
      lastCheckIn: null,
      badges: [],
    }

    return NextResponse.json(userStreak)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
