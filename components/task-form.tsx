"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"

interface TaskFormProps {
  token: string
  onSuccess: () => void
  editingTask?: any
}

export function TaskForm({ token, onSuccess, editingTask }: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title || "")
  const [subject, setSubject] = useState(editingTask?.subject || "")
  const [description, setDescription] = useState(editingTask?.description || "")
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (editingTask) {
        await axios.put(
          `/api/tasks/${editingTask.id}`,
          { title, subject, description, dueDate },
          { headers: { Authorization: `Bearer ${token}` } },
        )
      } else {
        await axios.post(
          "/api/tasks",
          { title, subject, description, dueDate },
          { headers: { Authorization: `Bearer ${token}` } },
        )
      }
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="text-sm font-medium">Task Title</label>
        <Input placeholder="e.g., Study Chapter 5" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm font-medium">Subject</label>
        <Input placeholder="e.g., Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>

      <div>
        <label className="text-sm font-medium">Description (optional)</label>
        <Textarea
          placeholder="Add details about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Due Date (optional)</label>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
      </Button>
    </form>
  )
}
