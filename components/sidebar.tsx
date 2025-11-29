"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, BarChart3, Clock, Flame, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/tasks", label: "Tasks", icon: BookOpen },
  { href: "/sessions", label: "Sessions", icon: Clock },
  { href: "/streak", label: "Streak", icon: Flame },
  { href: "/profile", label: "Profile", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-6">
        <Link href="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          StudySync
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {routes.map((route) => {
          const Icon = route.icon
          const isActive = pathname === route.href

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              <Icon className="w-5 h-5" />
              {route.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
