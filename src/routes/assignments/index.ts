import { Request, Response } from 'express'
import { createAssignment, getAssignments } from '../../lib/assignments.js'
import { createAssignmentSchema } from '../../lib/schemas.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const assignments = await getAssignments(req.user.id)

  res.json(assignments)
}

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = createAssignmentSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { title, description, dueDate, status } = parsed.data

  const assignment = await createAssignment({
    title,
    description,
    dueDate,
    userId: req.user.id,
    status
  })

  return res.status(201).json(assignment)
}
