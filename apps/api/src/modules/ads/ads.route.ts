import { Router } from "express"
import { getAds, getActiveAds, postAd, patchAd, deleteAd } from "./ads.controller.js"
import { requireAdmin } from "../../middleware/auth.middleware.js"

const router = Router()

// Public — frontend fetches active ads without auth
router.get("/active", getActiveAds)

// Admin-only CRUD
router.get("/", requireAdmin, getAds)
router.post("/", requireAdmin, postAd)
router.patch("/:id", requireAdmin, patchAd)
router.delete("/:id", requireAdmin, deleteAd)

export { router as adsRouter }
