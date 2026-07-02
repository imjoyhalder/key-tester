export interface CustomAdDto {
  id: number
  title: string
  imageUrl: string
  cloudinaryPublicId: string | null
  linkUrl: string
  altText: string
  slot: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAdDto {
  title: string
  imageUrl: string
  cloudinaryPublicId?: string | null | undefined
  linkUrl: string
  altText?: string | undefined
  slot?: string | undefined
  isActive?: boolean | undefined
}

export interface UpdateAdDto {
  title?: string | undefined
  imageUrl?: string | undefined
  cloudinaryPublicId?: string | null | undefined
  linkUrl?: string | undefined
  altText?: string | undefined
  slot?: string | undefined
  isActive?: boolean | undefined
}
