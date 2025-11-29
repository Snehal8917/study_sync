"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { StreakBadge } from "@/components/streak-badge"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface StreakData {
  userId: string
  streak: number
  lastCheckIn: string
  badges: number[]
}

export default function StreakPage() {
  const { token } = useAuth()
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (token) {
      fetchStreak()
    }
  }, [token])

  const fetchStreak = async () => {
    try {
      const response = await axios.get("/api/streak", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStreakData(response.data)
    } catch (error) {
      console.error("Failed to fetch streak:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    setCheckingIn(true)
    setMessage("")
    try {
      const response = await axios.post("/api/streak/check-in", {}, { headers: { Authorization: `Bearer ${token}` } })
      setStreakData(response.data)
      setMessage("Check-in successful! Keep it up!")
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Check-in failed")
    } finally {
      setCheckingIn(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12 text-gray-600">Loading streak data...</div>
      </ProtectedRoute>
    )
  }

  const canCheckIn = streakData?.lastCheckIn !== new Date().toISOString().split("T")[0]

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Streak</h1>

        {streakData && <StreakBadge streak={streakData.streak} badges={streakData.badges} />}

        <Button onClick={handleCheckIn} disabled={!canCheckIn || checkingIn} size="lg" className="w-full">
          {checkingIn ? "Checking in..." : "Check In Today"}
        </Button>

        {message && (
          <div
            className={`p-4 rounded-lg ${message.includes("successful") ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}
          >
            {message}
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="font-semibold text-indigo-900 mb-2">How Streaks Work</h3>
          <ul className="text-sm text-indigo-800 space-y-2">
            <li>• Check in every day to maintain your streak</li>
            <li>• Miss a day and your streak resets</li>
            <li>• Earn badges at 3, 7, 14, and 30 days</li>
            <li>• Use streaks to stay consistent with your studies</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  )
}
