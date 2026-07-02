import { Router } from "express"
import { getConfig, updateConfig } from "./config.controller.js"
import { requireAdmin } from "../../middleware/auth.middleware.js"

const router = Router()

router.get("/", requireAdmin, getConfig)
router.patch("/", requireAdmin, updateConfig)

export { router as configRouter }
