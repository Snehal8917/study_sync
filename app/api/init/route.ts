import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")

    await fs.mkdir(dataDir, { recursive: true })

    const files = {
      "users.json": [],
      "tasks.json": [],
      "sessions.json": [],
      "streak.json": [],
    }

    for (const [filename, initialData] of Object.entries(files)) {
      const filePath = path.join(dataDir, filename)
      try {
        await fs.access(filePath)
      } catch {
        await fs.writeFile(filePath, JSON.stringify(initialData, null, 2))
        console.log(`[v0] Created ${filename}`)
      }
    }

    return NextResponse.json({ message: "Data initialized successfully" })
  } catch (error: any) {
    console.error("[v0] Init error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
