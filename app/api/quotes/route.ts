import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

const QUOTE_API = "https://api.quotable.io/random"
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const quotesCollection = db.collection("quotes")

    // Check cache
    const cachedQuote = await quotesCollection.findOne({})

    if (cachedQuote) {
      const cacheAge = Date.now() - new Date(cachedQuote.cachedAt).getTime()
      if (cacheAge < CACHE_DURATION) {
        return NextResponse.json({ content: cachedQuote.content, author: cachedQuote.author })
      }
    }

    // Fetch new quote
    const response = await fetch(QUOTE_API)
    const quote = await response.json()

    // Save to cache
    await quotesCollection.deleteMany({})
    await quotesCollection.insertOne({
      content: quote.content,
      author: quote.author,
      cachedAt: new Date(),
    })

    return NextResponse.json({ content: quote.content, author: quote.author })
  } catch (error: any) {
    console.error("[v0] Quote fetch error:", error)

    // Return fallback quote
    const fallbackQuotes = [
      { content: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
      { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { content: "Your limitation, it's only your imagination.", author: "Unknown" },
    ]

    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    return NextResponse.json(random)
  }
}
