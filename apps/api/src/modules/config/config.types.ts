export interface AffiliateLink {
  label: string
  url: string
  platform: string
  imageUrl?: string | null | undefined
}

export interface GlobalConfigDto {
  isAdsEnabled: boolean
  adClientCode: string | null
  affiliateLinks: AffiliateLink[]
}

export interface UpdateConfigDto {
  isAdsEnabled?: boolean
  adClientCode?: string | null
  affiliateLinks?: AffiliateLink[]
}
