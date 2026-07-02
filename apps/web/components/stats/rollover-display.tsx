"use client"

import { useKeyboardStore } from "@/stores/keyboard-store"

const MAX_DISPLAY = 14

export const RolloverDisplay = () => {
  const maxRollover = useKeyboardStore((s) => s.maxRollover)
  const currentlyPressed = useKeyboardStore((s) => s.currentlyPressed)

  const dots = Array.from({ length: MAX_DISPLAY }, (_, i) => i + 1)

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-mono font-semibold text-foreground">
          Key Rollover (Ghosting Test)
        </p>
        <p className="text-xs font-mono text-cyan-400">
          Max Detected: {maxRollover} Keys
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {dots.map((n) => {
          const isActive = n <= currentlyPressed.size
          const isMax = n === maxRollover
          const isPossible = n <= maxRollover
          return (
            <div
              key={n}
              className={[
                "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-mono font-bold transition-all",
                isActive
                  ? "bg-cyan-400 border-cyan-400 text-black"
                  : isMax
                  ? "bg-cyan-400/30 border-cyan-400 text-cyan-300"
                  : isPossible
                  ? "bg-cyan-400/10 border-cyan-600 text-cyan-500"
                  : "bg-muted border-border text-muted-foreground",
              ].join(" ")}
            >
              {n}
            </div>
          )
        })}
        <div className="text-[9px] text-muted-foreground font-mono self-center">
          14+
        </div>
      </div>
    </div>
  )
}
