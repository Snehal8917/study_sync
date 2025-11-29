"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, X } from "lucide-react"

interface TaskFiltersProps {
  subject: string
  onSubjectChange: (subject: string) => void
  completed: string | null
  onCompletedChange: (completed: string | null) => void
  onReset: () => void
}

export function TaskFilters({ subject, onSubjectChange, completed, onCompletedChange, onReset }: TaskFiltersProps) {
  const isActive = subject !== "" || completed !== null

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <Filter className="w-4 h-4" />
        Filters
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject</label>
          <Input
            placeholder="Filter by subject..."
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
          <div className="flex gap-2 mt-1">
            <Button
              size="sm"
              variant={completed === null ? "default" : "outline"}
              onClick={() => onCompletedChange(null)}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={completed === "false" ? "default" : "outline"}
              onClick={() => onCompletedChange("false")}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={completed === "true" ? "default" : "outline"}
              onClick={() => onCompletedChange("true")}
            >
              Completed
            </Button>
          </div>
        </div>

        {isActive && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
