import { type NextRequest, NextResponse } from "next/server"
import { readJSON, writeJSON } from "@/lib/fs"

const QUOTE_API = "https://api.quotable.io/random"
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function GET(request: NextRequest) {
  try {
    const quotes = await readJSON("quotes.json")

    if (quotes.length > 0 && quotes[0].cachedAt) {
      const cacheAge = Date.now() - new Date(quotes[0].cachedAt).getTime()
      if (cacheAge < CACHE_DURATION) {
        return NextResponse.json(quotes[0])
      }
    }

    const response = await fetch(QUOTE_API)
    const quote = await response.json()

    quote.cachedAt = new Date().toISOString()
    await writeJSON("quotes.json", [quote])

    return NextResponse.json(quote)
  } catch (error: any) {
    const fallbackQuotes = [
      { content: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
      { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { content: "Your limitation, it's only your imagination.", author: "Steve Jobs" },
    ]

    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    return NextResponse.json(random)
  }
}
