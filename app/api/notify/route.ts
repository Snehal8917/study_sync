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
    const tasksCollection = db.collection("tasks")

    const today = new Date().toISOString().split("T")[0]

    const todayTasks = await tasksCollection
      .find({
        userId: new ObjectId(payload.id),
        completed: false,
        dueDate: {
          $gte: new Date(today),
          $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
        },
      })
      .toArray()

    const message = `You have ${todayTasks.length} task${todayTasks.length !== 1 ? "s" : ""} due today! Keep focused and get them done.`

    return NextResponse.json({
      message,
      taskCount: todayTasks.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[v0] Notify error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
