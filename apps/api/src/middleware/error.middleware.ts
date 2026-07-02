import type { Request, Response, NextFunction } from "express"
import type { ApiError } from "../types/api.types.js"
import { env } from "../env.js"

export class AppError extends Error {
  readonly statusCode: number
  readonly isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const errorMiddleware = (
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err instanceof AppError ? err.message : "Internal Server Error"

  const response: ApiError = { success: false, error: message, statusCode }

  if (env.NODE_ENV === "development" && !(err instanceof AppError)) {
    response.details = [err.stack ?? "No stack trace"]
  }

  res.status(statusCode).json(response)
}

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
    statusCode: 404,
  } satisfies ApiError)
}
