import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { readJSON, writeJSON } from "@/lib/fs"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    let sessions = await readJSON("sessions.json")
    const sessionIndex = sessions.findIndex((s: any) => s.id === id && s.userId === payload.id)

    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    sessions = sessions.filter((s: any) => s.id !== id)
    await writeJSON("sessions.json", sessions)

    return NextResponse.json({ message: "Session deleted successfully" })
  } catch (error: any) {
    console.error("[v0] Delete session error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete session" }, { status: 400 })
  }
}
