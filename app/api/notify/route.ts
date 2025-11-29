import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON } from "@/lib/fs"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const tasks = await readJSON("tasks.json")
    const userTasks = tasks.filter((t: any) => t.userId === payload.id && !t.completed)

    const today = new Date().toISOString().split("T")[0]
    const todayTasks = userTasks.filter((t: any) => {
      if (!t.dueDate) return false
      return t.dueDate.split("T")[0] === today
    })

    const message = `You have ${todayTasks.length} task${todayTasks.length !== 1 ? "s" : ""} due today! Keep focused and get them done.`

    return NextResponse.json({
      message,
      taskCount: todayTasks.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
