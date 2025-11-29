"use client"

import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  if (!user) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            StudySync
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/tasks" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Tasks
            </Link>
            <Link href="/sessions" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Sessions
            </Link>
            <Link href="/streak" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
              Streak
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button size="sm" variant="outline" onClick={handleLogout} className="hidden sm:inline bg-transparent">
              Logout
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/tasks"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
            >
              Tasks
            </Link>
            <Link
              href="/sessions"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
            >
              Sessions
            </Link>
            <Link
              href="/streak"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
            >
              Streak
            </Link>
            <Button size="sm" variant="outline" onClick={handleLogout} className="w-full mt-2 bg-transparent">
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
