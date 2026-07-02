import { z } from "zod"
import * as sessionRepo from "./session.repository.js"
import { AppError } from "../../middleware/error.middleware.js"
import type {
  CreateSessionDto,
  TestSessionRecord,
  SessionStatsResult,
  FailedKeyEntry,
} from "./session.types.js"
import type { PaginatedResult } from "../../types/api.types.js"

const createSessionSchema = z.object({
  visitorId: z.string().uuid().optional(),
  failedKeys: z.array(z.string().max(64)).max(200),
  maxRollover: z.number().int().min(0).max(200),
  avgLatency: z.number().min(0).max(10000),
  userAgent: z.string().max(512),
  country: z.string().max(100).optional(),
  ipHash: z.string().max(128).optional(),
})

export const saveSession = async (
  input: unknown
): Promise<TestSessionRecord> => {
  const parsed = createSessionSchema.safeParse(input)
  if (!parsed.success) {
    throw new AppError(`Validation: ${parsed.error.message}`, 400)
  }

  const dto: CreateSessionDto = {
    ...(parsed.data.visitorId !== undefined && { visitorId: parsed.data.visitorId }),
    failedKeys: parsed.data.failedKeys,
    maxRollover: parsed.data.maxRollover,
    avgLatency: parsed.data.avgLatency,
    userAgent: parsed.data.userAgent,
    ...(parsed.data.country !== undefined && { country: parsed.data.country }),
    ...(parsed.data.ipHash !== undefined && { ipHash: parsed.data.ipHash }),
  }

  return sessionRepo.createSession(dto)
}

export const listSessions = async (
  page: number,
  limit: number
): Promise<PaginatedResult<TestSessionRecord>> => {
  const skip = (page - 1) * limit
  const [items, total] = await Promise.all([
    sessionRepo.findAllSessions(skip, limit),
    sessionRepo.countSessions(),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export const getSessionStats = async (): Promise<SessionStatsResult> => {
  const [totalSessions, allFailedKeys, latencyStats, latencyTrend] =
    await Promise.all([
      sessionRepo.countSessions(),
      sessionRepo.findAllFailedKeys(),
      sessionRepo.aggregateLatencyStats(),
      sessionRepo.findLatencyTrend(30),
    ])

  const keyCountMap = allFailedKeys.reduce<Record<string, number>>((acc, k) => {
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {})

  const topFailedKeys: FailedKeyEntry[] = Object.entries(keyCountMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([key, count]) => ({
      key,
      count,
      percentage:
        totalSessions > 0
          ? Math.round((count / totalSessions) * 1000) / 10
          : 0,
    }))

  return {
    totalSessions,
    avgLatency: latencyStats.avg,
    avgMaxRollover: 0,
    topFailedKeys,
    latencyTrend,
  }
}
