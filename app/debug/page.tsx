"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function DebugPage() {
  const { token, user } = useAuth()
  const [logs, setLogs] = useState<string[]>([])
  const [taskData, setTaskData] = useState<any>(null)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testInit = async () => {
    addLog("Testing init endpoint...")
    try {
      const response = await fetch("/api/init")
      if (response.ok) {
        addLog("Init successful")
      } else {
        addLog(`Init failed: ${response.status}`)
      }
    } catch (error: any) {
      addLog(`Init error: ${error.message}`)
    }
  }

  const testCreateTask = async () => {
    if (!token) {
      addLog("No token available")
      return
    }

    addLog("Creating test task...")
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Debug Task",
          subject: "Testing",
          description: "This is a test task",
        }),
      })

      const data = await response.json()
      if (response.ok) {
        addLog(`Task created: ${data.id}`)
        setTaskData(data)
      } else {
        addLog(`Failed to create task: ${data.error}`)
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`)
    }
  }

  const testCompleteTask = async () => {
    if (!token || !taskData) {
      addLog("No token or task data")
      return
    }

    addLog(`Attempting to complete task ${taskData.id}...`)
    try {
      const response = await fetch(`/api/tasks/${taskData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      })

      const data = await response.json()
      if (response.ok) {
        addLog(`Task completed successfully`)
        setTaskData(data)
      } else {
        addLog(`Failed to complete task: ${data.error}`)
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`)
    }
  }

  const testFetchTasks = async () => {
    if (!token) {
      addLog("No token available")
      return
    }

    addLog("Fetching all tasks...")
    try {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (response.ok) {
        addLog(`Found ${data.tasks.length} tasks`)
      } else {
        addLog(`Failed to fetch tasks: ${data.error}`)
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-4">Debug Panel</h1>

        <Alert className="mb-4">
          <AlertDescription>
            <strong>User:</strong> {user?.name} ({user?.email})<br />
            <strong>Token:</strong> {token ? "✓ Present" : "✗ Missing"}
          </AlertDescription>
        </Alert>

        <div className="space-y-2 mb-6">
          <Button onClick={testInit} className="w-full">
            Test Initialize Data
          </Button>
          <Button onClick={testFetchTasks} className="w-full">
            Fetch All Tasks
          </Button>
          <Button onClick={testCreateTask} className="w-full">
            Create Test Task
          </Button>
          {taskData && (
            <Button onClick={testCompleteTask} className="w-full" variant="default">
              Complete Test Task
            </Button>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">Logs will appear here...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-gray-700 dark:text-gray-300">
                {log}
              </div>
            ))
          )}
        </div>

        {taskData && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="font-semibold mb-2">Current Task Data:</p>
            <pre className="text-xs overflow-x-auto">{JSON.stringify(taskData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
