import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"
import * as repo from "./ads.repository.js"
import { AppError } from "../../middleware/error.middleware.js"
import { env } from "../../env.js"
import type { CustomAdDto } from "./ads.types.js"

// Ask the web app to rebuild the pages that render ads so the public site
// reflects create/update/delete/toggle changes immediately (best-effort — the
// mutation still succeeds if the web app is unreachable).
const revalidateWeb = async (): Promise<void> => {
  try {
    await fetch(
      `${env.WEB_URL}/api/revalidate?secret=${encodeURIComponent(env.REVALIDATE_SECRET)}`,
      { method: "POST" }
    )
  } catch (err) {
    console.error("[ads] revalidation request failed:", err)
  }
}

const createSchema = z.object({
  title: z.string().min(1).max(200),
  imageUrl: z.string().url(),
  cloudinaryPublicId: z.string().nullable().optional(),
  linkUrl: z.string().url(),
  altText: z.string().max(300).optional().default(""),
  slot: z.enum(["sidebar-left", "sidebar", "banner"]).optional().default("sidebar-left"),
  isActive: z.boolean().optional().default(true),
})

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  imageUrl: z.string().url().optional(),
  cloudinaryPublicId: z.string().nullable().optional(),
  linkUrl: z.string().url().optional(),
  altText: z.string().max(300).optional(),
  slot: z.enum(["sidebar-left", "sidebar", "banner"]).optional(),
  isActive: z.boolean().optional(),
})

export const listAds = (): Promise<CustomAdDto[]> => repo.findAll()

export const listActiveAds = (slot?: string): Promise<CustomAdDto[]> =>
  repo.findActive(slot)

export const createAd = async (input: unknown): Promise<CustomAdDto> => {
  const parsed = createSchema.safeParse(input)
  if (!parsed.success) throw new AppError(`Validation: ${parsed.error.message}`, 400)

  // Enforce slot limit: if this ad starts active, deactivate the existing one in same slot
  const ad = await repo.create(parsed.data)
  if (ad.isActive) {
    await repo.deactivateSlot(ad.slot, ad.id)
  }
  await revalidateWeb()
  return ad
}

export const updateAd = async (id: number, input: unknown): Promise<CustomAdDto> => {
  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) throw new AppError(`Validation: ${parsed.error.message}`, 400)

  const existing = await repo.findById(id)
  if (!existing) throw new AppError("Ad not found", 404)

  const updated = await repo.update(id, parsed.data)

  // If activating this ad, enforce one-per-slot: deactivate others in same slot
  if (parsed.data.isActive === true) {
    await repo.deactivateSlot(updated.slot, id)
  }

  await revalidateWeb()
  return updated
}

export const deleteAd = async (id: number): Promise<void> => {
  const ad = await repo.findById(id)
  if (!ad) throw new AppError("Ad not found", 404)

  // Delete from DB first so UI reflects change even if Cloudinary fails
  await repo.remove(id)

  // Best-effort Cloudinary cleanup
  if (ad.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(ad.cloudinaryPublicId, { resource_type: "image" })
    } catch {
      // Log but don't throw — DB record is already gone
      console.error(`[ads] Failed to delete Cloudinary asset: ${ad.cloudinaryPublicId}`)
    }
  }

  await revalidateWeb()
}
