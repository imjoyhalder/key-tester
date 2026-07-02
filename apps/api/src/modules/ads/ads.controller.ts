import type { Request, Response, NextFunction } from "express"
import * as adsService from "./ads.service.js"
import type { ApiResponse } from "../../types/api.types.js"
import type { CustomAdDto } from "./ads.types.js"

export const getAds = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ads = await adsService.listAds()
    res.json({ success: true, data: ads } satisfies ApiResponse<CustomAdDto[]>)
  } catch (err) { next(err) }
}

export const getActiveAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const slot = req.query["slot"] as string | undefined
    const ads = await adsService.listActiveAds(slot)
    res.json({ success: true, data: ads } satisfies ApiResponse<CustomAdDto[]>)
  } catch (err) { next(err) }
}

export const postAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ad = await adsService.createAd(req.body)
    res.status(201).json({ success: true, data: ad } satisfies ApiResponse<CustomAdDto>)
  } catch (err) { next(err) }
}

export const patchAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(Array.isArray(req.params["id"]) ? (req.params["id"][0] ?? "") : (req.params["id"] ?? ""), 10)
    if (isNaN(id)) { res.status(400).json({ success: false, error: "Invalid id" }); return }
    const ad = await adsService.updateAd(id, req.body)
    res.json({ success: true, data: ad } satisfies ApiResponse<CustomAdDto>)
  } catch (err) { next(err) }
}

export const deleteAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(Array.isArray(req.params["id"]) ? (req.params["id"][0] ?? "") : (req.params["id"] ?? ""), 10)
    if (isNaN(id)) { res.status(400).json({ success: false, error: "Invalid id" }); return }
    await adsService.deleteAd(id)
    res.json({ success: true, data: null })
  } catch (err) { next(err) }
}
