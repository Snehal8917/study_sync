import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export async function readJSON(filename: string) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function writeJSON(filename: string, data: any) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error)
  }
}

export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
