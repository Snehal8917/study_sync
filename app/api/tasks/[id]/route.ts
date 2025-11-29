import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON, writeJSON } from "@/lib/fs"
import { taskSchema } from "@/lib/validations"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const tasks = await readJSON("tasks.json")
    const task = tasks.find((t: any) => t.id === id && t.userId === payload.id)

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })

    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const body = await request.json()
    const validated = taskSchema.partial().parse(body)

    const tasks = await readJSON("tasks.json")
    const taskIndex = tasks.findIndex((t: any) => t.id === id && t.userId === payload.id)

    if (taskIndex === -1) return NextResponse.json({ error: "Task not found" }, { status: 404 })

    tasks[taskIndex] = { ...tasks[taskIndex], ...validated }
    await writeJSON("tasks.json", tasks)

    return NextResponse.json(tasks[taskIndex])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    let tasks = await readJSON("tasks.json")
    const taskIndex = tasks.findIndex((t: any) => t.id === id && t.userId === payload.id)

    if (taskIndex === -1) return NextResponse.json({ error: "Task not found" }, { status: 404 })

    tasks = tasks.filter((t: any) => t.id !== id)
    await writeJSON("tasks.json", tasks)

    return NextResponse.json({ message: "Task deleted" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
