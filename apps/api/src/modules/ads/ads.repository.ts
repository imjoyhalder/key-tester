import { prisma } from "../../lib/prisma.js"
import type { CustomAdDto, CreateAdDto, UpdateAdDto } from "./ads.types.js"

const toDto = (ad: {
  id: number
  title: string
  imageUrl: string
  cloudinaryPublicId: string | null
  linkUrl: string
  altText: string
  slot: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}): CustomAdDto => ({
  id: ad.id,
  title: ad.title,
  imageUrl: ad.imageUrl,
  cloudinaryPublicId: ad.cloudinaryPublicId,
  linkUrl: ad.linkUrl,
  altText: ad.altText,
  slot: ad.slot,
  isActive: ad.isActive,
  createdAt: ad.createdAt.toISOString(),
  updatedAt: ad.updatedAt.toISOString(),
})

export const findAll = async (): Promise<CustomAdDto[]> => {
  const ads = await prisma.customAd.findMany({ orderBy: { createdAt: "desc" } })
  return ads.map(toDto)
}

export const findActive = async (slot?: string): Promise<CustomAdDto[]> => {
  const ads = await prisma.customAd.findMany({
    where: { isActive: true, ...(slot ? { slot } : {}) },
    orderBy: { createdAt: "desc" },
  })
  return ads.map(toDto)
}

export const findById = async (id: number): Promise<CustomAdDto | null> => {
  const ad = await prisma.customAd.findUnique({ where: { id } })
  return ad ? toDto(ad) : null
}

export const create = async (data: CreateAdDto): Promise<CustomAdDto> => {
  const ad = await prisma.customAd.create({
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl,
      altText: data.altText ?? "",
      slot: data.slot ?? "sidebar",
      isActive: data.isActive ?? true,
      ...(data.cloudinaryPublicId !== undefined ? { cloudinaryPublicId: data.cloudinaryPublicId } : {}),
    },
  })
  return toDto(ad)
}

export const update = async (id: number, data: UpdateAdDto): Promise<CustomAdDto> => {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Record<string, unknown>
  const ad = await prisma.customAd.update({ where: { id }, data: clean })
  return toDto(ad)
}

// Deactivate all active ads in a slot except `excludeId`
export const deactivateSlot = async (slot: string, excludeId: number): Promise<void> => {
  await prisma.customAd.updateMany({
    where: { slot, isActive: true, id: { not: excludeId } },
    data: { isActive: false },
  })
}

export const remove = async (id: number): Promise<void> => {
  await prisma.customAd.delete({ where: { id } })
}
