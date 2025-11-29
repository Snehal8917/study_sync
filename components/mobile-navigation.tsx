"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, BarChart3, Clock, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const pathname = usePathname()

  const routes = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/tasks", label: "Tasks", icon: BookOpen },
    { href: "/sessions", label: "Sessions", icon: Clock },
    { href: "/streak", label: "Streak", icon: Flame },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around">
        {routes.map((route) => {
          const Icon = route.icon
          const isActive = pathname === route.href

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-4 text-xs font-medium transition-colors flex-1",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400",
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span>{route.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
