import type { Request, Response, NextFunction } from "express"
import * as sessionService from "./session.service.js"
import type { ApiResponse, PaginatedResult } from "../../types/api.types.js"
import type { TestSessionRecord, SessionStatsResult } from "./session.types.js"

export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ipHash = req.ip
      ? Buffer.from(req.ip).toString("base64").slice(0, 32)
      : undefined

    const session = await sessionService.saveSession({
      ...(req.body as Record<string, unknown>),
      userAgent: req.headers["user-agent"] ?? "",
      ipHash,
    })

    const response: ApiResponse<TestSessionRecord> = {
      success: true,
      data: session,
      message: "Session saved",
    }
    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export const getSessions = async (
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
    const result = await sessionService.listSessions(page, limit)
    const response: ApiResponse<PaginatedResult<TestSessionRecord>> = {
      success: true,
      data: result,
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const getSessionStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await sessionService.getSessionStats()
    const response: ApiResponse<SessionStatsResult> = {
      success: true,
      data: stats,
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
}
