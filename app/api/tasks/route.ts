import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON, writeJSON, generateId } from "@/lib/fs"
import { taskSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const tasks = await readJSON("tasks.json")
    const userTasks = tasks.filter((t: any) => t.userId === payload.id)

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

    return NextResponse.json({ tasks: filtered })
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
    const { title, subject, dueDate, description } = taskSchema.parse(body)

    const tasks = await readJSON("tasks.json")
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

    return NextResponse.json(newTask, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
