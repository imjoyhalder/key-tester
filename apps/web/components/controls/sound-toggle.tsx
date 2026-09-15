"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useKeyboardStore } from "@/stores/keyboard-store"
import { SoundProfileSelector } from "./sound-profile"

export const SoundToggle = () => {
  const profile = useKeyboardStore((s) => s.soundProfile)
  const soundOn = profile !== "off"
  return (
    <details className="relative z-20 shrink-0">
      <summary
        aria-label="Sound settings"
        className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden"
      >
        {soundOn ? (
          <Volume2 aria-hidden="true" className="size-4" />
        ) : (
          <VolumeX aria-hidden="true" className="size-4" />
        )}
        <span className="hidden sm:inline">Sound {soundOn ? "on" : "off"}</span>
      </summary>
      <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-border bg-card p-4 shadow-xl">
        <SoundProfileSelector />
      </div>
    </details>
  )
}
