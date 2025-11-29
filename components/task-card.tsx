"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Trash2, Edit2 } from "lucide-react"
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

  const toggleComplete = async () => {
    setLoading(true)
    try {
      await axios.put(
        `/api/tasks/${task.id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      onUpdate()
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async () => {
    if (!confirm("Are you sure?")) return
    setLoading(true)
    try {
      await axios.delete(`/api/tasks/${task.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      onUpdate()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={task.completed ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={toggleComplete}
              disabled={loading}
              className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {task.completed ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5" />}
            </button>
            <div>
              <CardTitle className={`text-base ${task.completed ? "line-through" : ""}`}>{task.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{task.subject}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(task)} disabled={loading}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={deleteTask}
              disabled={loading}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && <p className="text-sm text-gray-600 mb-3">{task.description}</p>}
        {task.dueDate && <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
      </CardContent>
    </Card>
  )
}
