import type { Request, Response, NextFunction } from "express"
import { auth } from "../lib/auth.js"
import { AppError } from "./error.middleware.js"

export interface AuthenticatedRequest extends Request {
  user: {
    id: string
    email: string
    role: string
    name: string
  }
  session: {
    id: string
    token: string
    userId: string
    expiresAt: Date
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    })

    if (!session?.user || !session.session) {
      throw new AppError("Unauthorized: No valid session", 401)
    }

    const authReq = req as AuthenticatedRequest
    authReq.user = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user as { role?: string }).role ?? "user",
      name: session.user.name,
    }
    authReq.session = {
      id: session.session.id,
      token: session.session.token,
      userId: session.session.userId,
      expiresAt: session.session.expiresAt,
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await requireAuth(req, res, async (err?: unknown) => {
    if (err) return next(err)

    const authReq = req as AuthenticatedRequest
    if (authReq.user.role !== "admin") {
      return next(new AppError("Forbidden: Admin access required", 403))
    }
    next()
  })
}
