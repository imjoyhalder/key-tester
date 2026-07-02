import { Router } from "express"
import { getDashboard, getVisitors, getKeyHealth } from "./admin.controller.js"
import { requireAdmin } from "../../middleware/auth.middleware.js"

const router = Router()

router.use(requireAdmin)

router.get("/dashboard", getDashboard)
router.get("/visitors", getVisitors)
router.get("/key-health", getKeyHealth)

export { router as adminRouter }
