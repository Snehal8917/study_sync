import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { sessionSchema } from "@/lib/validations"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const db = await getDatabase()
    const sessionsCollection = db.collection("sessions")

    const sessions = await sessionsCollection
      .find({ userId: new ObjectId(payload.id) })
      .sort({ date: -1 })
      .toArray()

    const formattedSessions = sessions.map((s) => ({
      ...s,
      id: s._id.toString(),
      userId: s.userId.toString(),
      taskId: s.taskId.toString(),
    }))

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error: any) {
    console.error("[v0] Get sessions error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch sessions" }, { status: 400 })
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

    const db = await getDatabase()
    const tasksCollection = db.collection("tasks")
    const sessionsCollection = db.collection("sessions")

    const task = await tasksCollection.findOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(payload.id),
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found or does not belong to you" }, { status: 404 })
    }

    const newSession = {
      userId: new ObjectId(payload.id),
      taskId: new ObjectId(taskId),
      duration,
      notes: notes || "",
      date: new Date(),
      createdAt: new Date(),
    }

    const result = await sessionsCollection.insertOne(newSession)

    console.log("[v0] Session created with ID:", result.insertedId)

    return NextResponse.json(
      {
        ...newSession,
        id: result.insertedId.toString(),
        userId: newSession.userId.toString(),
        taskId: newSession.taskId.toString(),
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Create session error:", error)
    const errorMessage = error.errors?.[0]?.message || error.message || "Failed to create session"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
