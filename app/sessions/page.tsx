"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { SessionForm } from "@/components/session-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Clock, TrendingUp, BarChart3, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Session {
  id: string
  taskId: string
  duration: number
  notes: string
  date: string
}

interface Task {
  id: string
  title: string
  subject: string
}

export default function SessionsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sessionsRes, tasksRes] = await Promise.all([
        axios.get("/api/sessions", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/tasks", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      setSessions(sessionsRes.data.sessions || [])
      setTasks(tasksRes.data.tasks || [])
    } catch (error: any) {
      console.error("[v0] Failed to fetch data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load study sessions",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTaskTitle = (taskId: string) => {
    return tasks.find((t) => t.id === taskId)?.title || "Task (deleted)"
  }

  const getTaskSubject = (taskId: string) => {
    return tasks.find((t) => t.id === taskId)?.subject || ""
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm("Delete this session?")) return

    try {
      await axios.delete(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast({
        title: "Deleted",
        description: "Study session removed",
      })
      fetchData()
    } catch (error: any) {
      console.error("[v0] Delete session error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to delete session",
      })
    }
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const avgMinutes = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0

  const sessionsByDate = sessions.reduce(
    (acc, session) => {
      const date = new Date(session.date).toLocaleDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(session)
      return acc
    },
    {} as Record<string, Session[]>,
  )

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Study Sessions</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Log your study time for tasks to track productivity and build streaks
            </p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Log Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Study Session</DialogTitle>
              </DialogHeader>
              {tasks.length > 0 ? (
                <SessionForm
                  token={token || ""}
                  tasks={tasks}
                  onSuccess={() => {
                    setOpenDialog(false)
                    fetchData()
                  }}
                />
              ) : (
                <div className="text-center py-4 space-y-2">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-600">Create a task first to log sessions.</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{sessions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalHours}h</p>
              <p className="text-xs text-gray-500 mt-1">{totalMinutes} minutes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Average Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{avgMinutes}m</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2 animate-spin" />
            <p>Loading study sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No sessions logged yet</p>
            <p className="text-sm mt-1">Start tracking your study time to see your progress!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(sessionsByDate)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, dateSessions]) => (
                <div key={date} className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">{date}</h3>
                  <div className="space-y-2">
                    {dateSessions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((session) => (
                        <Card key={session.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <p className="font-semibold">{getTaskTitle(session.taskId)}</p>
                                    <p className="text-xs text-gray-500 mt-1">{getTaskSubject(session.taskId)}</p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-lg text-blue-600">{session.duration}m</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(session.date).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                                {session.notes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                                    {session.notes}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSession(session.id)}
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
