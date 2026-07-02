import { z } from "zod"
import * as userRepo from "./user.repository.js"
import { AppError } from "../../middleware/error.middleware.js"
import type { UserRecord, UpdateUserRoleDto, UserListResult } from "./user.types.js"
import type { PaginatedResult } from "../../types/api.types.js"

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "user"]),
})

export const getUserById = async (id: string): Promise<UserRecord> => {
  const user = await userRepo.findUserById(id)
  if (!user) throw new AppError(`User not found: ${id}`, 404)
  return user
}

export const listUsers = async (
  page: number,
  limit: number
): Promise<PaginatedResult<UserRecord>> => {
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    userRepo.findAllUsers(skip, limit),
    userRepo.countUsers(),
  ])
  return { items: users, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export const changeUserRole = async (
  input: UpdateUserRoleDto
): Promise<UserRecord> => {
  const parsed = updateRoleSchema.safeParse(input)
  if (!parsed.success) {
    throw new AppError(`Validation: ${parsed.error.message}`, 400)
  }

  const user = await userRepo.findUserById(parsed.data.userId)
  if (!user) throw new AppError("User not found", 404)

  if (parsed.data.role === "user") {
    const adminCount = await userRepo.countAdmins()
    if (adminCount <= 1 && user.role === "admin") {
      throw new AppError("Cannot demote the last admin", 400)
    }
  }

  return userRepo.updateUserRole(parsed.data.userId, parsed.data.role)
}
