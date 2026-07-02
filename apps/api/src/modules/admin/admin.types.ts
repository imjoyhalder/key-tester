import type { FailedKeyEntry } from "../session/session.types.js"

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

export interface FailedKeyRanking extends FailedKeyEntry {
  rank: number
}

export interface AdminDashboardData {
  visitorStats: VisitorStats
  keyHealthStats: KeyHealthStats
}
