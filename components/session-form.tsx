"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await axios.post(
        "/api/sessions",
        { taskId, duration: Number.parseInt(duration), notes },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      onSuccess()
      setDuration("")
      setNotes("")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log session")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="text-sm font-medium">Select Task</label>
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} - {task.subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Duration (minutes)</label>
        <Input
          type="number"
          placeholder="60"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          min="1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notes (optional)</label>
        <Textarea
          placeholder="How was your study session?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging..." : "Log Session"}
      </Button>
    </form>
  )
}
