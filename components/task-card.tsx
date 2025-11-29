"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Trash2, Edit2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Task {
  id: string
  title: string
  subject: string
  dueDate?: string
  description?: string
  completed: boolean
  createdAt: string
}

interface TaskCardProps {
  task: Task
  token: string
  onUpdate: () => void
  onEdit: (task: Task) => void
}

export function TaskCard({ task, token, onUpdate, onEdit }: TaskCardProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const toggleComplete = async () => {
    setLoading(true)
    try {
      const newCompletedStatus = !task.completed
      console.log("[v0] Toggling task completion:", { taskId: task.id, newStatus: newCompletedStatus })

      const response = await axios.put(
        `/api/tasks/${task.id}`,
        { completed: newCompletedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("[v0] Task update response:", response.data)

      toast({
        title: "Success",
        description: newCompletedStatus ? "Task marked as complete! 🎉" : "Task marked as incomplete",
      })
      onUpdate()
    } catch (error: any) {
      console.error("[v0] Toggle complete error:", error.response?.data || error.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to update task. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async () => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) return
    setLoading(true)
    try {
      console.log("[v0] Deleting task:", task.id)
      await axios.delete(`/api/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast({
        title: "Deleted",
        description: "Task has been removed",
      })
      onUpdate()
    } catch (error: any) {
      console.error("[v0] Delete error:", error.response?.data || error.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to delete task",
      })
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  return (
    <Card
      className={`${task.completed ? "opacity-60 bg-gray-50 dark:bg-gray-900" : ""} transition-all hover:shadow-md`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={toggleComplete}
              disabled={loading}
              className="mt-1 flex-shrink-0 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 p-1"
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              title={task.completed ? "Click to mark as incomplete" : "Click to mark as complete"}
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className={`w-6 h-6 ${isOverdue ? "text-red-500" : "text-gray-400"}`} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <CardTitle className={`text-base ${task.completed ? "line-through text-gray-500" : ""} break-words`}>
                {task.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.subject}</p>
                {isOverdue && (
                  <div className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    Overdue
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <Button size="sm" variant="ghost" onClick={() => onEdit(task)} disabled={loading} title="Edit task">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={deleteTask}
              disabled={loading}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>}
        {task.dueDate && (
          <p className={`text-xs ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
            Due:{" "}
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
