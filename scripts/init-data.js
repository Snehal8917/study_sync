const fs = require("fs").promises
const path = require("path")

async function initializeData() {
  const dataDir = path.join(process.cwd(), "data")

  try {
    // Create data directory
    await fs.mkdir(dataDir, { recursive: true })
    console.log("[v0] Created data directory")

    // Initialize empty JSON files if they don't exist
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
        console.log(`[v0] ${filename} already exists`)
      } catch {
        await fs.writeFile(filePath, JSON.stringify(initialData, null, 2))
        console.log(`[v0] Created ${filename}`)
      }
    }

    console.log("[v0] Data initialization complete!")
  } catch (error) {
    console.error("[v0] Error initializing data:", error)
    process.exit(1)
  }
}

initializeData()
