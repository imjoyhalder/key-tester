import { z } from "zod"
import * as configRepo from "./config.repository.js"
import { AppError } from "../../middleware/error.middleware.js"
import type { GlobalConfigDto, UpdateConfigDto } from "./config.types.js"

const affiliateLinkSchema = z.object({
  label: z.string().min(1).max(100),
  url: z.string().url(),
  platform: z.string().min(1).max(50),
  imageUrl: z.string().url().nullable().optional(),
})

const updateConfigSchema = z.object({
  isAdsEnabled: z.boolean().optional(),
  adClientCode: z.string().max(200).nullable().optional(),
  affiliateLinks: z.array(affiliateLinkSchema).max(20).optional(),
})

export const fetchConfig = async (): Promise<GlobalConfigDto> =>
  configRepo.getConfig()

export const patchConfig = async (input: unknown): Promise<GlobalConfigDto> => {
  const parsed = updateConfigSchema.safeParse(input)
  if (!parsed.success) {
    throw new AppError(`Validation: ${parsed.error.message}`, 400)
  }

  const updates: UpdateConfigDto = {
    ...(parsed.data.isAdsEnabled !== undefined && { isAdsEnabled: parsed.data.isAdsEnabled }),
    ...(parsed.data.adClientCode !== undefined && { adClientCode: parsed.data.adClientCode }),
    ...(parsed.data.affiliateLinks !== undefined && { affiliateLinks: parsed.data.affiliateLinks }),
  }

  return configRepo.updateConfig(updates)
}
