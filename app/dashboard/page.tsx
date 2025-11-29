"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardSummary } from "@/components/dashboard-summary"
import { ChartCard } from "@/components/chart-card"
import axios from "axios"

interface Task {
  id: string
  title: string
  subject: string
  completed: boolean
  createdAt: string
}

interface Session {
  id: string
  taskId: string
  duration: number
  date: string
}

export default function DashboardPage() {
  const { token, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tasksRes, sessionsRes] = await Promise.all([
        axios.get("/api/tasks", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/sessions", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      setTasks(tasksRes.data.tasks || [])
      setSessions(sessionsRes.data.sessions || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12 text-gray-600">Loading dashboard...</div>
      </ProtectedRoute>
    )
  }

  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = tasks.filter((t) => !t.completed).length
  const totalHours = sessions.reduce((sum, s) => sum + s.duration / 60, 0)

  // Weekly study data
  const weekData: { [key: string]: number } = {}
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dayName = days[date.getDay()]
    weekData[dayName] = 0
  }

  sessions.forEach((session) => {
    const date = new Date(session.date)
    const dayName = days[date.getDay()]
    weekData[dayName] = (weekData[dayName] || 0) + session.duration / 60
  })

  const weeklyData = Object.entries(weekData).map(([name, hours]) => ({
    name,
    hours: Math.round(hours * 10) / 10,
  }))

  // Subject distribution
  const subjectCounts: { [key: string]: number } = {}
  tasks.forEach((task) => {
    subjectCounts[task.subject] = (subjectCounts[task.subject] || 0) + 1
  })

  const subjectData = Object.entries(subjectCounts).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here is your study progress</p>
        </div>

        <DashboardSummary
          totalTasks={tasks.length}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          totalHours={totalHours}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Weekly Study Hours"
            description="Hours studied this week"
            type="bar"
            data={weeklyData}
            dataKey="hours"
          />

          {subjectData.length > 0 && (
            <ChartCard title="Task Distribution" description="Tasks by subject" type="pie" data={subjectData} />
          )}
        </div>

        {tasks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Today's Summary</h3>
            <p className="text-sm text-blue-800">
              You have <strong>{pendingTasks}</strong> pending tasks and have completed{" "}
              <strong>{completedTasks}</strong> so far today. Keep up the momentum!
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
