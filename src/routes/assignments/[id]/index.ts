import { Request, Response } from 'express'
import {
  deleteAssignment,
  getAssignment,
  updateAssignment
} from '../../../lib/assignments.js'
import { updateAssignmentSchema } from '../../../lib/schemas.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const assignment = await getAssignment(req.params.id)

  if (!assignment) return res.sendStatus(404)

  if (assignment.userId !== req.user.id) return res.sendStatus(404)

  res.json(assignment)
}

export async function patch(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = updateAssignmentSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const {
    title,
    description,
    dueDate,
    status,
    archived,
    trashed,
    resources
  } = parsed.data

  const assignment = await getAssignment(req.params.id)

  if (!assignment) return res.sendStatus(404)

  if (assignment.userId !== req.user.id) return res.sendStatus(404)

  const updated = await updateAssignment(req.params.id, {
    title,
    description,
    dueDate,
    status,
    archived,
    trashed,
    resources
  })

  res.json(updated)
}

export async function del(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const assignment = await getAssignment(req.params.id)

  if (!assignment) return res.sendStatus(404)

  if (assignment.userId !== req.user.id) return res.sendStatus(404)

  await deleteAssignment(req.params.id)

  res.sendStatus(204)
}
