import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(payload.id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, theme: user.theme },
    })
  } catch (error: any) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
