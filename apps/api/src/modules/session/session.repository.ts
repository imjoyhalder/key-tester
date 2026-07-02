import { prisma } from "../../lib/prisma.js"
import type { CreateSessionDto, TestSessionRecord } from "./session.types.js"

export const createSession = async (
  dto: CreateSessionDto
): Promise<TestSessionRecord> =>
  prisma.testSession.create({
    data: {
      visitorId: dto.visitorId ?? null,
      failedKeys: dto.failedKeys,
      maxRollover: dto.maxRollover,
      avgLatency: dto.avgLatency,
      userAgent: dto.userAgent,
      country: dto.country ?? null,
      ipHash: dto.ipHash ?? null,
    },
  })

export const findAllSessions = async (
  skip: number,
  take: number
): Promise<TestSessionRecord[]> =>
  prisma.testSession.findMany({
    skip,
    take,
    orderBy: { createdAt: "desc" },
  })

export const countSessions = async (): Promise<number> =>
  prisma.testSession.count()

export const findSessionsByDate = async (
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

export const aggregateLatencyStats = async (): Promise<{
  avg: number
  p95: number
  total: number
}> => {
  const [agg, sorted] = await Promise.all([
    prisma.testSession.aggregate({
      _avg: { avgLatency: true },
      _count: { id: true },
    }),
    prisma.testSession.findMany({
      select: { avgLatency: true },
      orderBy: { avgLatency: "asc" },
    }),
  ])

  const values = sorted.map((r) => r.avgLatency)
  const p95 = values[Math.floor(values.length * 0.95)] ?? 0

  return {
    avg: agg._avg.avgLatency ?? 0,
    p95,
    total: agg._count.id,
  }
}

export const findAllFailedKeys = async (): Promise<string[]> => {
  const sessions = await prisma.testSession.findMany({
    select: { failedKeys: true },
  })
  return sessions.flatMap((s) => s.failedKeys)
}

export const findSessionsByCountry = async (): Promise<
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

export const findLatencyTrend = async (
  days: number
): Promise<Array<{ date: string; avgLatency: number; sessionCount: number }>> => {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const sessions = await prisma.testSession.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, avgLatency: true },
    orderBy: { createdAt: "asc" },
  })

  const grouped = sessions.reduce<
    Record<string, { sum: number; count: number }>
  >((acc, s) => {
    const date = s.createdAt.toISOString().split("T")[0] ?? ""
    if (!acc[date]) acc[date] = { sum: 0, count: 0 }
    acc[date]!.sum += s.avgLatency
    acc[date]!.count++
    return acc
  }, {})

  return Object.entries(grouped).map(([date, { sum, count }]) => ({
    date,
    avgLatency: Math.round((sum / count) * 100) / 100,
    sessionCount: count,
  }))
}
