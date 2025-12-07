import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { taskSchema } from "@/lib/validations"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    console.log("[v0] GET /api/tasks - token exists:", !!token)

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    console.log("[v0] Token verified, userId:", payload?.id)

    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const db = await getDatabase()
    const tasksCollection = db.collection("tasks")

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")
    const completed = searchParams.get("completed")
    const sort = searchParams.get("sort")

    const query: any = { userId: new ObjectId(payload.id) }

    if (subject) {
      query.subject = { $regex: subject, $options: "i" }
    }

    if (completed !== null) {
      query.completed = completed === "true"
    }

    let tasks = await tasksCollection.find(query).toArray()
    console.log("[v0] User tasks fetched:", tasks.length)

    if (sort === "dueDate") {
      tasks.sort((a: any, b: any) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
    }

    // Convert ObjectId to string for frontend
    tasks = tasks.map((t) => ({
      ...t,
      id: t._id.toString(),
      userId: t.userId.toString(),
    }))

    console.log("[v0] Returning filtered tasks:", tasks.length)
    return NextResponse.json({ tasks })
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

    const db = await getDatabase()
    const tasksCollection = db.collection("tasks")

    const newTask = {
      userId: new ObjectId(payload.id),
      title,
      subject,
      dueDate: dueDate ? new Date(dueDate) : null,
      description: description || "",
      completed: false,
      createdAt: new Date(),
    }

    const result = await tasksCollection.insertOne(newTask)
    console.log("[v0] Task created with ID:", result.insertedId)

    return NextResponse.json(
      {
        ...newTask,
        id: result.insertedId.toString(),
        userId: newTask.userId.toString(),
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] POST tasks error:", error)
    return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 400 })
  }
}
