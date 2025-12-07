import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    console.log("[v0] GET /api/tasks/[id] - id:", id, "token exists:", !!token)

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const db = await getDatabase()
    const tasksCollection = db.collection("tasks")

    const task = await tasksCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(payload.id),
    })

    if (!task) {
      console.log("[v0] Task not found:", id)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    console.log("[v0] Task found:", task._id)
    return NextResponse.json({
      ...task,
      id: task._id.toString(),
      userId: task.userId.toString(),
    })
  } catch (error: any) {
    console.error("[v0] GET task error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch task" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const db = await getDatabase()
    const tasksCollection = db.collection("tasks")

    const updateData: any = { ...validated }
    if (validated.dueDate) {
      updateData.dueDate = new Date(validated.dueDate)
    }

    const result = await tasksCollection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(payload.id),
      },
      { $set: updateData },
      { returnDocument: "after" },
    )

    if (!result.value) {
      console.error("[v0] Task not found - id:", id, "userId:", payload.id)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    console.log("[v0] Task updated successfully")

    return NextResponse.json({
      ...result.value,
      id: result.value._id.toString(),
      userId: result.value.userId.toString(),
    })
  } catch (error: any) {
    console.error("[v0] PUT task error:", error)
    return NextResponse.json({ error: error.message || "Failed to update task" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    console.log("[v0] DELETE /api/tasks/[id] - id:", id, "token exists:", !!token)

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const db = await getDatabase()
    const tasksCollection = db.collection("tasks")

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(payload.id),
    })

    if (result.deletedCount === 0) {
      console.log("[v0] Task not found for deletion:", id)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    console.log("[v0] Task deleted successfully")

    return NextResponse.json({ message: "Task deleted" })
  } catch (error: any) {
    console.error("[v0] DELETE task error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete task" }, { status: 400 })
  }
}
