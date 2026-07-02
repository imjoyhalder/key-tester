import { prisma } from "../../lib/prisma.js"
import { Prisma } from "@prisma/client"
import type { GlobalConfigDto, AffiliateLink } from "./config.types.js"

interface RawGlobalConfig {
  id: number
  isAdsEnabled: boolean
  adClientCode: string | null
  affiliateLinks: unknown
  updatedAt: Date
}

const toDto = (raw: RawGlobalConfig): GlobalConfigDto => ({
  isAdsEnabled: raw.isAdsEnabled,
  adClientCode: raw.adClientCode,
  affiliateLinks: Array.isArray(raw.affiliateLinks)
    ? (raw.affiliateLinks as AffiliateLink[])
    : [],
})

export const getConfig = async (): Promise<GlobalConfigDto> => {
  const existing = await prisma.globalConfig.findUnique({ where: { id: 1 } })
  if (existing) return toDto(existing)

  const created = await prisma.globalConfig.create({
    data: { id: 1, isAdsEnabled: false, adClientCode: null, affiliateLinks: [] },
  })
  return toDto(created)
}

export const updateConfig = async (
  updates: Partial<GlobalConfigDto>
): Promise<GlobalConfigDto> => {
  const updated = await prisma.globalConfig.upsert({
    where: { id: 1 },
    update: {
      ...(updates.isAdsEnabled !== undefined && {
        isAdsEnabled: updates.isAdsEnabled,
      }),
      ...(updates.adClientCode !== undefined && {
        adClientCode: updates.adClientCode,
      }),
      ...(updates.affiliateLinks !== undefined && {
        affiliateLinks: updates.affiliateLinks as unknown as Prisma.InputJsonValue,
      }),
    },
    create: {
      id: 1,
      isAdsEnabled: updates.isAdsEnabled ?? false,
      adClientCode: updates.adClientCode ?? null,
      affiliateLinks: (updates.affiliateLinks ?? []) as unknown as Prisma.InputJsonValue,
    },
  })
  return toDto(updated)
}
