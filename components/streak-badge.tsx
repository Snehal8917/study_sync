"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Flame, Trophy } from "lucide-react"

interface StreakBadgeProps {
  streak: number
  badges: number[]
}

export function StreakBadge({ streak, badges }: StreakBadgeProps) {
  const getBadgeIcon = (milestone: number) => {
    return (
      <div key={milestone} className="text-center">
        <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-xs font-semibold">{milestone} Day Badge</p>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-4xl font-bold text-orange-600">{streak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Keep it going! Check in daily to maintain your streak.</p>
        </div>

        {badges.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-4">Earned Badges</p>
            <div className="grid grid-cols-2 gap-4">{badges.map((badge) => getBadgeIcon(badge))}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
