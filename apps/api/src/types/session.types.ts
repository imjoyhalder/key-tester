export interface CreateSessionDto {
  failedKeys: string[]
  maxRollover: number
  avgLatency: number
  userAgent: string
  country?: string
  ipHash?: string
}

export interface TestSessionRecord {
  id: string
  createdAt: Date
  failedKeys: string[]
  maxRollover: number
  avgLatency: number
  userAgent: string | null
  country: string | null
  ipHash: string | null
}

export interface SessionStatsResult {
  totalSessions: number
  avgLatency: number
  avgMaxRollover: number
  topFailedKeys: FailedKeyEntry[]
  latencyTrend: LatencyDataPoint[]
}

export interface FailedKeyEntry {
  key: string
  count: number
  percentage: number
}

export interface LatencyDataPoint {
  date: string
  avgLatency: number
  sessionCount: number
}
