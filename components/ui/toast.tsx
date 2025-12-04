"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { TaskCard } from "@/components/task-card"
import { TaskForm } from "@/components/task-form"
import { TaskFilters } from "@/components/task-filters"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Sparkles, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [subject, setSubject] = useState("")
  const [completed, setCompleted] = useState<string | null>(null)

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("[v0] Initializing data...")
        const response = await fetch("/api/init")
        if (response.ok) {
          console.log("[v0] Data initialized successfully")
        }
      } catch (error) {
        console.error("[v0] Error initializing data:", error)
      }
    }

    initializeData()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      console.log("[v0] Fetching tasks with token:", !!token)
      const params = new URLSearchParams()
      if (subject) params.append("subject", subject)
      if (completed !== null) params.append("completed", completed)

      const response = await fetch(`/api/tasks?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] Fetch response status:", response.status)

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Tasks fetched:", data)
      setTasks(data.tasks || [])
    } catch (error: any) {
      console.error("[v0] Failed to fetch tasks:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasks",
      })
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
    toast({
      title: "Success",
      description: editingTask ? "Task updated" : "Task created",
    })
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setOpenDialog(true)
  }

  const handleReset = () => {
    setSubject("")
    setCompleted(null)
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const activeTasks = tasks.filter((t) => !t.completed)
  const showHelpTip = tasks.length > 0 && activeTasks.length === 0 && completedCount > 0

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {completedCount} of {tasks.length} completed
            </p>
            {tasks.length > 0 && (
              <div className="mt-2 bg-gray-200 dark:bg-gray-700 h-2 rounded-full w-48">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)} className="w-full md:w-auto">
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

        {tasks.length === 0 && !loading && (
          <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200 ml-2">
              <strong>How to use StudySync:</strong> Click the "Add Task" button to create your first task. Then click
              the circle icon next to any task to mark it as complete!
            </AlertDescription>
          </Alert>
        )}

        {showHelpTip && (
          <Alert className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200 ml-2">
              Great job! All tasks are completed. Create new ones to continue your study streak!
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <div className="animate-spin mb-3">
              <Sparkles className="w-8 h-8 mx-auto" />
            </div>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <div className="mb-4">
              <Sparkles className="w-16 h-16 mx-auto opacity-30" />
            </div>
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm mt-1">Create your first task to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeTasks.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Active Tasks</h2>
                <div className="space-y-3">
                  {activeTasks.map((task) => (
                    <TaskCard key={task.id} task={task} token={token || ""} onUpdate={fetchTasks} onEdit={handleEdit} />
                  ))}
                </div>
              </div>
            )}

            {completedCount > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  Completed ({completedCount})
                </h2>
                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.completed)
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        token={token || ""}
                        onUpdate={fetchTasks}
                        onEdit={handleEdit}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
