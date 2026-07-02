import type { KeyHealthStats } from "@/types/admin"

interface KeyHealthStatsProps {
  stats: KeyHealthStats
}

const RANK_MEDALS = ["🥇", "🥈", "🥉"]

export const KeyHealthStatsPanel = ({ stats }: KeyHealthStatsProps) => (
  <div className="flex flex-col gap-4">
    {/* Metric cards */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {[
        {
          label: "Avg Hardware Latency",
          value: `${stats.avgHardwareLatency}ms`,
          accent: "text-orange-400",
        },
        {
          label: "P95 Latency",
          value: `${stats.p95Latency}ms`,
          accent: "text-yellow-400",
        },
        {
          label: "Total Failed Key Presses",
          value: stats.totalFailedKeyPresses.toLocaleString(),
          accent: "text-red-400",
        },
      ].map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-lg p-4"
        >
          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
            {card.label}
          </p>
          <p className={`text-2xl font-bold font-mono ${card.accent}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>

    {/* Most Failed Keys Leaderboard */}
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm font-mono font-semibold mb-3">
        Most Failed Keys Leaderboard
      </p>
      {stats.mostFailedKeys.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono">
          No failed key data yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {stats.mostFailedKeys.map((entry) => (
            <div
              key={entry.key}
              className="flex items-center gap-3"
            >
              <span className="text-base w-6 text-center">
                {RANK_MEDALS[entry.rank - 1] ?? `#${entry.rank}`}
              </span>
              <div className="w-20 px-2 py-1 bg-muted rounded font-mono text-xs text-center font-semibold truncate">
                {entry.key.replace(/^Key|^Digit/, "")}
              </div>
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-red-500 transition-all"
                  style={{ width: `${Math.min(entry.percentage, 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-red-400 w-12 text-right shrink-0">
                {entry.percentage}%
              </span>
              <span className="text-[11px] font-mono text-muted-foreground w-12 text-right shrink-0">
                {entry.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)
