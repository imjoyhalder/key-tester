import { prisma } from "../../lib/prisma.js"
import type { UserRecord } from "./user.types.js"

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export const findUserById = async (id: string): Promise<UserRecord | null> =>
  prisma.user.findUnique({ where: { id }, select: USER_SELECT })

export const findUserByEmail = async (
  email: string
): Promise<UserRecord | null> =>
  prisma.user.findUnique({ where: { email }, select: USER_SELECT })

export const findAllUsers = async (
  skip: number,
  take: number
): Promise<UserRecord[]> =>
  prisma.user.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
    select: USER_SELECT,
  })

export const countUsers = async (): Promise<number> =>
  prisma.user.count()

export const updateUserRole = async (
  id: string,
  role: string
): Promise<UserRecord> =>
  prisma.user.update({
    where: { id },
    data: { role, updatedAt: new Date() },
    select: USER_SELECT,
  })

export const countAdmins = async (): Promise<number> =>
  prisma.user.count({ where: { role: "admin" } })
