"use client"

import { useKeyboardStore } from "@/stores/keyboard-store"

export function TestStatus() {
  const tested = useKeyboardStore((s) => s.testedCount)
  const lastKey = useKeyboardStore((s) => s.inputHistory[0]?.code)
  const held = useKeyboardStore((s) => s.currentlyPressed.size)
  const clear = useKeyboardStore((s) => s.clearAll)
  return (
    <div className="mt-1 flex flex-wrap items-center justify-between gap-4 text-sm">
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-cyan-600" />
          Pressed
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-600" />
          Registered
        </span>
        <span className="font-medium text-foreground" aria-live="polite">
          {tested} keys tested
        </span>
      </div>
      <span className="text-muted-foreground">
        Last key:{" "}
        <span className="font-medium text-foreground">
          {lastKey ?? "None yet"}
        </span>
        {held > 0 && ` · ${held} held`}
      </span>
      <button
        type="button"
        onClick={clear}
        className="rounded-lg border border-border px-3 py-2 font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Reset test
      </button>
    </div>
  )
}
