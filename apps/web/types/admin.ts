export interface VisitorStats {
  totalSessions: number
  uniqueCountries: number
  topBrowsers: BrowserStat[]
  topCountries: CountryStat[]
  dailySessions: DailySessionStat[]
}

export interface BrowserStat {
  browser: string
  count: number
  percentage: number
}

export interface CountryStat {
  country: string
  count: number
  percentage: number
}

export interface DailySessionStat {
  date: string
  count: number
}

export interface KeyHealthStats {
  mostFailedKeys: FailedKeyRanking[]
  avgHardwareLatency: number
  p95Latency: number
  totalFailedKeyPresses: number
}

export interface FailedKeyRanking {
  key: string
  count: number
  percentage: number
  rank: number
}

export interface AffiliateLink {
  label: string
  url: string
  platform: string
  imageUrl?: string | null
}

export interface GlobalConfigDto {
  isAdsEnabled: boolean
  adClientCode: string | null
  affiliateLinks: AffiliateLink[]
}

export interface AdminDashboardData {
  visitorStats: VisitorStats
  keyHealthStats: KeyHealthStats
  config: GlobalConfigDto
}

export interface CustomAd {
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
