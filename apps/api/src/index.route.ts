import { Router } from "express"
import { userRouter } from "./modules/user/user.route.js"
import { sessionRouter } from "./modules/session/session.route.js"
import { adminRouter } from "./modules/admin/admin.route.js"
import { configRouter } from "./modules/config/config.route.js"
import { uploadRouter } from "./modules/upload/upload.route.js"
import { adsRouter } from "./modules/ads/ads.route.js"

const router: Router = Router()

router.use("/users", userRouter)
router.use("/sessions", sessionRouter)
router.use("/admin", adminRouter)
router.use("/config", configRouter)
router.use("/upload", uploadRouter)
router.use("/ads", adsRouter)

export { router as indexRouter }
