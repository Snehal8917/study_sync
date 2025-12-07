import { type NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations"
import { hashPassword } from "@/lib/bcrypt"
import { generateToken } from "@/lib/jwt"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const userId = new ObjectId()

    const newUser = {
      _id: userId,
      name,
      email,
      password: hashedPassword,
      theme: "light",
      createdAt: new Date(),
    }

    await usersCollection.insertOne(newUser)

    // Generate token
    const token = generateToken({ id: userId.toString(), email, name })

    console.log("[v0] User registered successfully:", email)

    return NextResponse.json(
      {
        token,
        user: { id: userId.toString(), name, email },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
