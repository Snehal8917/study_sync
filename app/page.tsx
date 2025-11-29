"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Target, TrendingUp, Zap } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) {
    return null
  }

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold gradient-blue bg-clip-text text-transparent">StudySync</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Your smart study planner to organize tasks, track progress, and stay motivated
          </p>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/auth/login">
            <Button size="lg" className="gradient-blue text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 space-y-12">
        <h2 className="text-4xl font-bold text-center">Why Choose StudySync?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold text-lg">Task Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create, organize, and track all your study tasks in one place
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-3">
            <Target className="w-8 h-8 text-green-600" />
            <h3 className="font-semibold text-lg">Study Sessions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Log your study time and track productivity metrics
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h3 className="font-semibold text-lg">Progress Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visualize your progress with interactive charts and insights
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-3">
            <Zap className="w-8 h-8 text-orange-600" />
            <h3 className="font-semibold text-lg">Streaks & Badges</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build consistency with daily streaks and achievement badges
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 dark:bg-gray-900 rounded-2xl p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to supercharge your studying?</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Join thousands of students using StudySync to stay organized, focused, and motivated
        </p>
        <Link href="/auth/register">
          <Button size="lg" className="gradient-blue text-white">
            Start Your Free Account
          </Button>
        </Link>
      </section>
    </div>
  )
}
