import { Router } from "express"
import {
  createSession,
  getSessions,
  getSessionStats,
} from "./session.controller.js"
import { requireAdmin } from "../../middleware/auth.middleware.js"

const router = Router()

router.post("/", createSession)
router.get("/", requireAdmin, getSessions)
router.get("/stats", requireAdmin, getSessionStats)

export { router as sessionRouter }
