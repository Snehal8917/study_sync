import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
})

export const taskSchema = z.object({
  title: z.string().min(1, "Title required"),
  subject: z.string().min(1, "Subject required"),
  dueDate: z.string().optional(),
  description: z.string().optional(),
})

export const sessionSchema = z.object({
  taskId: z.string().min(1, "Task ID required"),
  duration: z.number().min(1, "Duration must be positive"),
  notes: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TaskInput = z.infer<typeof taskSchema>
export type SessionInput = z.infer<typeof sessionSchema>
