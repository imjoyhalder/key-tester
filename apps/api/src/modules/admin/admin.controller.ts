import type { Request, Response, NextFunction } from "express"
import * as adminService from "./admin.service.js"
import { fetchConfig } from "../config/config.service.js"
import type { ApiResponse } from "../../types/api.types.js"
import type { AdminDashboardData, VisitorStats, KeyHealthStats } from "./admin.types.js"
import type { GlobalConfigDto } from "../config/config.types.js"

export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [visitorStats, keyHealthStats, config] = await Promise.all([
      adminService.getVisitorStats(),
      adminService.getKeyHealthStats(),
      fetchConfig(),
    ])
    const data: AdminDashboardData & { config: GlobalConfigDto } = {
      visitorStats,
      keyHealthStats,
      config,
    }
    const response: ApiResponse<typeof data> = { success: true, data }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const getVisitors = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await adminService.getVisitorStats()
    const response: ApiResponse<VisitorStats> = { success: true, data: stats }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const getKeyHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await adminService.getKeyHealthStats()
    const response: ApiResponse<KeyHealthStats> = { success: true, data: stats }
    res.json(response)
  } catch (err) {
    next(err)
  }
}
