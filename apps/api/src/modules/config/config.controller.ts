import type { Request, Response, NextFunction } from "express"
import * as configService from "./config.service.js"
import type { ApiResponse } from "../../types/api.types.js"
import type { GlobalConfigDto } from "./config.types.js"

export const getConfig = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const config = await configService.fetchConfig()
    const response: ApiResponse<GlobalConfigDto> = { success: true, data: config }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const updateConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await configService.patchConfig(req.body)
    const response: ApiResponse<GlobalConfigDto> = {
      success: true,
      data: updated,
      message: "Config updated",
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
}
