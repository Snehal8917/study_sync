import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUri = process.env.MONGODB_URI
console.log("MONGODB_URI:", mongoUri);

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    const db = client.db(process.env.MONGODB_DB_NAME || "studysync")

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
    }

    if (!collectionNames.includes("tasks")) {
      await db.createCollection("tasks")
      await db.collection("tasks").createIndex({ userId: 1 })
    }

    if (!collectionNames.includes("sessions")) {
      await db.createCollection("sessions")
      await db.collection("sessions").createIndex({ userId: 1 })
    }

    if (!collectionNames.includes("streaks")) {
      await db.createCollection("streaks")
      await db.collection("streaks").createIndex({ userId: 1 }, { unique: true })
    }

    cachedClient = client
    cachedDb = db

    console.log("[v0] Connected to MongoDB Atlas")
    return { client, db }
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    throw error
  }
}

export async function getDatabase() {
  if (!cachedDb) {
    const { db } = await connectToDatabase()
    return db
  }
  return cachedDb
}
