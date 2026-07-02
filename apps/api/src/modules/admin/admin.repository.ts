import { prisma } from "../../lib/prisma.js"

export const findAllSessionsForAnalytics = async (): Promise<
  Array<{ userAgent: string | null; country: string | null; avgLatency: number }>
> =>
  prisma.testSession.findMany({
    select: { userAgent: true, country: true, avgLatency: true },
  })

export const findSessionCountByCountry = async (): Promise<
  Array<{ country: string | null; count: number }>
> => {
  const grouped = await prisma.testSession.groupBy({
    by: ["country"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  })
  return grouped.map((g) => ({ country: g.country, count: g._count.id }))
}

export const findDailySessions = async (
  days: number
): Promise<Array<{ date: string; count: number }>> => {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const sessions = await prisma.testSession.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  const grouped = sessions.reduce<Record<string, number>>((acc, s) => {
    const date = s.createdAt.toISOString().split("T")[0] ?? ""
    acc[date] = (acc[date] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}

export const findAllFailedKeysForAdmin = async (): Promise<string[]> => {
  const sessions = await prisma.testSession.findMany({
    select: { failedKeys: true },
  })
  return sessions.flatMap((s) => s.failedKeys)
}

export const aggregateLatencyForAdmin = async (): Promise<{
  avg: number
  p95: number
}> => {
  const [agg, allLatencies] = await Promise.all([
    prisma.testSession.aggregate({ _avg: { avgLatency: true } }),
    prisma.testSession.findMany({
      select: { avgLatency: true },
      orderBy: { avgLatency: "asc" },
    }),
  ])

  const values = allLatencies.map((r) => r.avgLatency)
  const p95 = values[Math.floor(values.length * 0.95)] ?? 0

  return { avg: agg._avg.avgLatency ?? 0, p95 }
}
