import prisma from './prisma.js'
import { hashPassword, random, verifyPassword } from './utils.js'

export async function countUsers() {
  return await prisma.user.count()
}

export async function createUser({
  username,
  password
}: {
  username: string
  password: string
}) {
  const { salt, hash } = hashPassword(password)

  const user = await prisma.user.create({
    data: {
      id: random(16),
      username,
      salt,
      hash
    }
  })

  return user
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })

  return user
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  return user
}

export async function updateUser({
  id,
  username,
  password
}: {
  id: string
  username?: string
  password?: string
}) {
  const update: {
    username?: string
    salt?: string
    hash?: string
  } = {}
  if (username) update.username = username
  if (password) {
    const { salt, hash } = hashPassword(password)
    update.salt = salt
    update.hash = hash
  }

  const user = await prisma.user.update({
    where: {
      id
    },
    data: update
  })

  return user
}

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: {
      id
    }
  })

  return user
}

export async function getUsers() {
  const users = await prisma.user.findMany()

  return users
}

export async function authenticate({
  username,
  password
}: {
  username: string
  password: string
}) {
  const user = await getUserByUsername(username)

  if (!user) return false

  const { salt, hash } = user

  if (!verifyPassword(password, salt, hash)) return false

  return user
}
