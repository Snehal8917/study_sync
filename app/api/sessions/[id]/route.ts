import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDatabase()
    const sessionsCollection = db.collection("sessions")

    const result = await sessionsCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(payload.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    console.log("[v0] Session deleted successfully")
    return NextResponse.json({ message: "Session deleted successfully" })
  } catch (error: any) {
    console.error("[v0] Delete session error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete session" }, { status: 400 })
  }
}
