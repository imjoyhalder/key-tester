import { Router } from "express"
import { getMe, listUsers, updateRole } from "./user.controller.js"
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js"

const router = Router()

router.get("/me", requireAuth, getMe)
router.get("/", requireAdmin, listUsers)
router.patch("/:userId/role", requireAdmin, updateRole)

export { router as userRouter }
