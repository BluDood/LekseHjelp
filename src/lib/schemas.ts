import { AssignmentStatus } from '@prisma/client'
import { z } from 'zod'

export const username = z.string().min(3).max(32)
export const password = z.string().min(8)
export const id = z.string().length(16)

export const loginSchema = z.object({
  username,
  password
})

export const registerSchema = z.object({
  username,
  password
})

export const updateUserSchema = z.object({
  username
})

export const createAssignmentSchema = z.object({
  title: z.string().min(3).max(64),
  description: z.string().min(3).max(512),
  dueDate: z
    .number()
    .int()
    .min(Date.now())
    .transform(v => new Date(v!)),
  status: z.enum([
    AssignmentStatus.PENDING,
    AssignmentStatus.IN_PROGRESS,
    AssignmentStatus.COMPLETED
  ])
})

export const updateAssignmentSchema = z.object({
  title: z.string().min(3).max(64).optional(),
  description: z.string().min(3).max(256).optional(),
  dueDate: z
    .number()
    .int()
    .min(Date.now())
    .transform(v => new Date(v!))
    .optional(),
  status: z
    .enum([
      AssignmentStatus.PENDING,
      AssignmentStatus.IN_PROGRESS,
      AssignmentStatus.COMPLETED
    ])
    .optional(),
  archived: z.boolean().optional(),
  trashed: z.boolean().optional(),
  resources: z
    .array(z.object({ name: z.string(), url: z.string().url() }))
    .optional()
})
