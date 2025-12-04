import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export async function readJSON(filename: string) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const data = await fs.readFile(filePath, "utf-8")
    console.log(`[v0] Successfully read ${filename}`)
    return JSON.parse(data)
  } catch (error) {
    console.log(`[v0] File not found: ${filename}, returning empty array`)
    return []
  }
}

export async function writeJSON(filename: string, data: any) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    console.log(`[v0] Successfully wrote to ${filename}`)
    return true
  } catch (error) {
    console.error(`[v0] Error writing to ${filename}:`, error)
    throw error
  }
}

export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
