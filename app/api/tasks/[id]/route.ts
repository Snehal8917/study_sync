import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON, writeJSON } from "@/lib/fs"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    console.log("[v0] GET /api/tasks/[id] - id:", id, "token exists:", !!token)

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const tasks = await readJSON("tasks.json")
    const task = tasks.find((t: any) => t.id === id && t.userId === payload.id)

    if (!task) {
      console.log("[v0] Task not found:", id)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    console.log("[v0] Task found:", task.id)
    return NextResponse.json(task)
  } catch (error: any) {
    console.error("[v0] GET task error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch task" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    console.log("[v0] PUT /api/tasks/[id] - id:", id, "token exists:", !!token)

    if (!token) {
      console.error("[v0] No token provided")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    console.log("[v0] Token verified, userId:", payload?.id)

    if (!payload) {
      console.error("[v0] Token verification failed")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body for update:", body)

    const updateSchema = z.object({
      title: z.string().min(1).optional(),
      subject: z.string().min(1).optional(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      completed: z.boolean().optional(),
    })

    const validated = updateSchema.parse(body)
    console.log("[v0] Validated update data:", validated)

    const tasks = await readJSON("tasks.json")
    console.log("[v0] Total tasks in file:", tasks.length)

    const taskIndex = tasks.findIndex((t: any) => t.id === id && t.userId === payload.id)

    if (taskIndex === -1) {
      console.error("[v0] Task not found - id:", id, "userId:", payload.id)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    console.log("[v0] Task found at index:", taskIndex)
    const updatedTask = { ...tasks[taskIndex], ...validated }
    console.log("[v0] Updated task:", updatedTask)

    tasks[taskIndex] = updatedTask
    await writeJSON("tasks.json", tasks)
    console.log("[v0] Task saved successfully")

    return NextResponse.json(updatedTask)
  } catch (error: any) {
    console.error("[v0] PUT task error:", error)
    return NextResponse.json({ error: error.message || "Failed to update task" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    console.log("[v0] DELETE /api/tasks/[id] - id:", id, "token exists:", !!token)

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    let tasks = await readJSON("tasks.json")
    console.log("[v0] Total tasks before delete:", tasks.length)

    const taskIndex = tasks.findIndex((t: any) => t.id === id && t.userId === payload.id)

    if (taskIndex === -1) {
      console.log("[v0] Task not found for deletion:", id)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks = tasks.filter((t: any) => t.id !== id)
    await writeJSON("tasks.json", tasks)
    console.log("[v0] Task deleted, remaining tasks:", tasks.length)

    return NextResponse.json({ message: "Task deleted" })
  } catch (error: any) {
    console.error("[v0] DELETE task error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete task" }, { status: 400 })
  }
}
