"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { TaskCard } from "@/components/task-card"
import { TaskForm } from "@/components/task-form"
import { TaskFilters } from "@/components/task-filters"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import axios from "axios"

interface Task {
  id: string
  title: string
  subject: string
  dueDate?: string
  description?: string
  completed: boolean
}

export default function TasksPage() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [subject, setSubject] = useState("")
  const [completed, setCompleted] = useState<string | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (subject) params.append("subject", subject)
      if (completed !== null) params.append("completed", completed)

      const response = await axios.get(`/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(response.data.tasks)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchTasks()
    }
  }, [token, subject, completed])

  const handleFormSuccess = () => {
    setOpenDialog(false)
    setEditingTask(null)
    fetchTasks()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setOpenDialog(true)
  }

  const handleReset = () => {
    setSubject("")
    setCompleted(null)
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              </DialogHeader>
              <TaskForm token={token || ""} onSuccess={handleFormSuccess} editingTask={editingTask} />
            </DialogContent>
          </Dialog>
        </div>

        <TaskFilters
          subject={subject}
          onSubjectChange={setSubject}
          completed={completed}
          onCompletedChange={setCompleted}
          onReset={handleReset}
        />

        {loading ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} token={token || ""} onUpdate={fetchTasks} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
