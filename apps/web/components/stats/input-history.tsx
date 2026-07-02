"use client"

import { useKeyboardStore } from "@/stores/keyboard-store"

export const InputHistory = () => {
  const inputHistory = useKeyboardStore((s) => s.inputHistory)

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <p className="text-xs font-mono font-semibold text-foreground mb-2">
        Input History{" "}
        <span className="text-muted-foreground">(Last 10 Keys)</span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {inputHistory.length === 0 ? (
          <p className="text-[10px] text-muted-foreground font-mono">
            No keys pressed yet
          </p>
        ) : (
          inputHistory.map((item, i) => (
            <div key={`${item.code}-${i}`} className="flex flex-col items-center gap-0.5">
              <div className="px-2.5 py-1.5 bg-green-500/20 border border-green-500/50 rounded-[4px] text-green-300 text-xs font-mono font-bold min-w-[36px] text-center">
                {item.label || item.code.replace("Key", "")}
              </div>
              <span className="text-[9px] text-muted-foreground font-mono">
                {item.latency > 0 ? `${item.latency}ms` : "—"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
