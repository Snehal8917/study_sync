"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { SessionForm } from "@/components/session-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Clock } from "lucide-react"
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
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTaskTitle = (taskId: string) => {
    return tasks.find((t) => t.id === taskId)?.title || "Deleted Task"
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Study Sessions</h1>
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
                <p className="text-sm text-gray-600">Create a task first to log sessions.</p>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{sessions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalHours}h</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0}m
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No sessions logged yet. Start tracking your study time!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((session) => (
                <Card key={session.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{getTaskTitle(session.taskId)}</p>
                        <p className="text-sm text-gray-600">{session.duration} minutes</p>
                        {session.notes && <p className="text-sm text-gray-500 mt-2">{session.notes}</p>}
                      </div>
                      <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
