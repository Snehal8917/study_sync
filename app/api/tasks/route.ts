import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON, writeJSON, generateId } from "@/lib/fs"
import { taskSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    console.log("[v0] GET /api/tasks - token exists:", !!token)

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    console.log("[v0] Token verified, userId:", payload?.id)

    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const tasks = await readJSON("tasks.json")
    console.log("[v0] All tasks read:", tasks.length)

    const userTasks = tasks.filter((t: any) => t.userId === payload.id)
    console.log("[v0] User tasks filtered:", userTasks.length)

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")
    const completed = searchParams.get("completed")
    const sort = searchParams.get("sort")

    let filtered = userTasks

    if (subject) {
      filtered = filtered.filter((t: any) => t.subject.toLowerCase().includes(subject.toLowerCase()))
    }

    if (completed !== null) {
      filtered = filtered.filter((t: any) => t.completed === (completed === "true"))
    }

    if (sort === "dueDate") {
      filtered.sort((a: any, b: any) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
    }

    console.log("[v0] Returning filtered tasks:", filtered.length)
    return NextResponse.json({ tasks: filtered })
  } catch (error: any) {
    console.error("[v0] GET tasks error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch tasks" }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    console.log("[v0] POST /api/tasks - token exists:", !!token)

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    console.log("[v0] Token verified for creation, userId:", payload?.id)

    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const { title, subject, dueDate, description } = taskSchema.parse(body)

    const tasks = await readJSON("tasks.json")
    console.log("[v0] Read existing tasks:", tasks.length)

    const newTask = {
      id: generateId(),
      userId: payload.id,
      title,
      subject,
      dueDate: dueDate || null,
      description: description || "",
      completed: false,
      createdAt: new Date().toISOString(),
    }

    tasks.push(newTask)
    await writeJSON("tasks.json", tasks)
    console.log("[v0] Task created and saved:", newTask.id)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error: any) {
    console.error("[v0] POST tasks error:", error)
    return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 400 })
  }
}
