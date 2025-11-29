import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON, writeJSON, generateId } from "@/lib/fs"
import { sessionSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const sessions = await readJSON("sessions.json")
    const userSessions = sessions.filter((s: any) => s.userId === payload.id)

    return NextResponse.json({ sessions: userSessions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const body = await request.json()
    const { taskId, duration, notes } = sessionSchema.parse(body)

    const sessions = await readJSON("sessions.json")
    const newSession = {
      id: generateId(),
      userId: payload.id,
      taskId,
      duration,
      notes: notes || "",
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    sessions.push(newSession)
    await writeJSON("sessions.json", sessions)

    return NextResponse.json(newSession, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
