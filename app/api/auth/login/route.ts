import { type NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/lib/validations"
import { comparePassword } from "@/lib/bcrypt"
import { generateToken } from "@/lib/jwt"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken({ id: user._id.toString(), email: user.email, name: user.name })

    console.log("[v0] User logged in:", email)

    return NextResponse.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    })
  } catch (error: any) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
