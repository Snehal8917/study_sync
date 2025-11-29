import { type NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations"
import { readJSON, writeJSON, generateId } from "@/lib/fs"
import { hashPassword } from "@/lib/bcrypt"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    const users = await readJSON("users.json")

    if (users.some((u: any) => u.email === email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const userId = generateId()

    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      theme: "light",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    await writeJSON("users.json", users)

    const token = generateToken({ id: userId, email, name })

    return NextResponse.json(
      {
        token,
        user: { id: userId, name, email },
      },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
