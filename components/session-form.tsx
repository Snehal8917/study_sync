"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface SessionFormProps {
  token: string
  tasks: any[]
  onSuccess: () => void
}

export function SessionForm({ token, tasks, onSuccess }: SessionFormProps) {
  const [taskId, setTaskId] = useState(tasks[0]?.id || "")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!duration || Number.parseInt(duration) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Duration must be greater than 0 minutes",
      })
      return
    }

    setLoading(true)

    try {
      await axios.post(
        "/api/sessions",
        {
          taskId,
          duration: Number.parseInt(duration),
          notes: notes.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      toast({
        title: "Session Logged!",
        description: `${duration} minutes added to your study time`,
      })
      onSuccess()
      setDuration("")
      setNotes("")
    } catch (err: any) {
      console.error("[v0] Session form error:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to log session",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedTask = tasks.find((t) => t.id === taskId)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Select Task *</label>
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
          required
        >
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} • {task.subject}
            </option>
          ))}
        </select>
        {selectedTask && <p className="text-xs text-gray-500 mt-1">Logging time for: {selectedTask.title}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Duration (minutes) *</label>
        <Input
          type="number"
          placeholder="60"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          min="1"
          max="480"
        />
        <p className="text-xs text-gray-500 mt-1">How long did you study?</p>
      </div>

      <div>
        <label className="text-sm font-medium">Notes (optional)</label>
        <Textarea
          placeholder="What did you accomplish? How was your focus?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging Session..." : "Log Session"}
      </Button>
    </form>
  )
}
