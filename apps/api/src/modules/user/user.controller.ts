import type { Request, Response, NextFunction } from "express"
import * as userService from "./user.service.js"
import type { ApiResponse, PaginatedResult } from "../../types/api.types.js"
import type { UserRecord, UpdateUserRoleDto } from "./user.types.js"

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as Request & { user: { id: string } }
    const user = await userService.getUserById(authReq.user.id)
    const response: ApiResponse<UserRecord> = { success: true, data: user }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(String(req.query["page"] ?? "1"), 10))
    const limit = Math.min(
      100,
      Math.max(1, parseInt(String(req.query["limit"] ?? "20"), 10))
    )
    const result = await userService.listUsers(page, limit)
    const response: ApiResponse<PaginatedResult<UserRecord>> = {
      success: true,
      data: result,
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params["userId"]
    const dto: UpdateUserRoleDto = {
      userId: Array.isArray(rawId) ? (rawId[0] ?? "") : (rawId ?? ""),
      role: (req.body as { role: "admin" | "user" }).role,
    }
    const updated = await userService.changeUserRole(dto)
    const response: ApiResponse<UserRecord> = {
      success: true,
      data: updated,
      message: "Role updated",
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
}
