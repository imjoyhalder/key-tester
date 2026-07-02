"use client"

import { useKeyboardStore } from "@/stores/keyboard-store"

const MAX_POINTS = 20
const CHART_HEIGHT = 60
const MAX_LATENCY_DISPLAY = 30

export const LatencyTracker = () => {
  const latencyHistory = useKeyboardStore((s) => s.latencyHistory)
  const avgLatency = useKeyboardStore((s) => s.avgLatency)

  const points = latencyHistory.slice(-MAX_POINTS)
  const maxVal = Math.max(
    ...points.map((p) => p.value),
    MAX_LATENCY_DISPLAY
  )

  const toSvgY = (val: number): number =>
    CHART_HEIGHT - (val / maxVal) * CHART_HEIGHT

  const pathD = points
    .map((p, i) => {
      const x = (i / (MAX_POINTS - 1)) * 100
      const y = toSvgY(p.value)
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const labels = ["-10", "-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "Now"]

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-mono font-semibold text-foreground">
          Latency Tracker
        </p>
        <p className="text-xs font-mono text-cyan-400">
          Avg: {avgLatency.toFixed(1)}ms
        </p>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 100 ${CHART_HEIGHT}`}
          className="w-full"
          style={{ height: CHART_HEIGHT }}
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1="0"
              y1={frac * CHART_HEIGHT}
              x2="100"
              y2={frac * CHART_HEIGHT}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          ))}
          {/* Fill */}
          {points.length > 1 && (
            <path
              d={`${pathD} L 100 ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`}
              fill="rgba(168,85,247,0.1)"
            />
          )}
          {/* Line */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="rgb(168,85,247)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* Dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={(i / (MAX_POINTS - 1)) * 100}
              cy={toSvgY(p.value)}
              r="1.5"
              fill="rgb(168,85,247)"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-1">
        {labels.map((l) => (
          <span key={l} className="text-[9px] text-muted-foreground font-mono">
            {l}
          </span>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <span className="text-[10px] text-muted-foreground font-mono">
          0ms
        </span>
        <span className="text-[10px] text-muted-foreground font-mono ml-auto">
          {maxVal}ms
        </span>
      </div>
    </div>
  )
}
