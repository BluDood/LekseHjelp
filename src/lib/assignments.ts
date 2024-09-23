import { Assignment, AssignmentStatus } from '@prisma/client'
import prisma from './prisma.js'
import { InputJsonValue } from '@prisma/client/runtime/library.js'

export async function createAssignment({
  title,
  description,
  dueDate,
  userId,
  status
}: {
  title: string
  description: string
  dueDate: Date
  userId: string
  status: AssignmentStatus
}) {
  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      dueDate,
      userId,
      status
    }
  })

  return assignment
}

export async function getAssignments(userId: string) {
  const assignments = await prisma.assignment.findMany({
    where: {
      userId
    }
  })

  return assignments
}

export async function getAssignment(id: string) {
  const assignment = await prisma.assignment.findUnique({
    where: {
      id
    }
  })

  return assignment
}

export async function updateAssignment(
  id: string,
  data: Partial<Omit<Assignment, 'resources'>> & {
    resources?: InputJsonValue[]
  }
) {
  const assignment = await prisma.assignment.update({
    where: {
      id
    },
    data
  })

  return assignment
}

export async function deleteAssignment(id: string) {
  const assignment = await prisma.assignment.delete({
    where: {
      id
    }
  })

  return assignment
}
