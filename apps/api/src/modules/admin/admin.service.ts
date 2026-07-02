import * as adminRepo from "./admin.repository.js"
import type {
  VisitorStats,
  KeyHealthStats,
  BrowserStat,
  CountryStat,
  FailedKeyRanking,
} from "./admin.types.js"

const parseBrowser = (userAgent: string | null): string => {
  if (!userAgent) return "Unknown"
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari"
  if (userAgent.includes("Edg")) return "Edge"
  if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera"
  return "Other"
}

export const getVisitorStats = async (): Promise<VisitorStats> => {
  const [sessions, countryStats, dailySessions] = await Promise.all([
    adminRepo.findAllSessionsForAnalytics(),
    adminRepo.findSessionCountByCountry(),
    adminRepo.findDailySessions(30),
  ])

  const total = sessions.length

  const browserMap = sessions.reduce<Record<string, number>>((acc, s) => {
    const browser = parseBrowser(s.userAgent)
    acc[browser] = (acc[browser] ?? 0) + 1
    return acc
  }, {})

  const topBrowsers: BrowserStat[] = Object.entries(browserMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))

  const topCountries: CountryStat[] = countryStats
    .filter((c): c is { country: string; count: number } => c.country !== null)
    .map(({ country, count }) => ({
      country,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))

  const uniqueCountries = new Set(
    countryStats.filter((c) => c.country !== null).map((c) => c.country)
  ).size

  return { totalSessions: total, uniqueCountries, topBrowsers, topCountries, dailySessions }
}

export const getKeyHealthStats = async (): Promise<KeyHealthStats> => {
  const [allFailedKeys, latencyStats, totalSessions] = await Promise.all([
    adminRepo.findAllFailedKeysForAdmin(),
    adminRepo.aggregateLatencyForAdmin(),
    adminRepo.findAllSessionsForAnalytics().then((r) => r.length),
  ])

  const keyCountMap = allFailedKeys.reduce<Record<string, number>>((acc, k) => {
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {})

  const mostFailedKeys: FailedKeyRanking[] = Object.entries(keyCountMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([key, count], index) => ({
      key,
      count,
      percentage:
        totalSessions > 0 ? Math.round((count / totalSessions) * 1000) / 10 : 0,
      rank: index + 1,
    }))

  return {
    mostFailedKeys,
    avgHardwareLatency: Math.round(latencyStats.avg * 100) / 100,
    p95Latency: Math.round(latencyStats.p95 * 100) / 100,
    totalFailedKeyPresses: allFailedKeys.length,
  }
}
