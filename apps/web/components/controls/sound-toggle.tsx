"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useKeyboardStore } from "@/stores/keyboard-store"

export const SoundToggle = () => {
  const soundProfile = useKeyboardStore((s) => s.soundProfile)
  const setSoundProfile = useKeyboardStore((s) => s.setSoundProfile)
  const soundOn = soundProfile !== "off"
  return (
    <button
      type="button"
      onClick={() => setSoundProfile(soundOn ? "off" : "blue")}
      aria-label="Key sounds"
      aria-pressed={soundOn}
      className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {soundOn ? (
        <Volume2 aria-hidden="true" className="size-4" />
      ) : (
        <VolumeX aria-hidden="true" className="size-4" />
      )}
      <span className="hidden sm:inline">Sound {soundOn ? "on" : "off"}</span>
    </button>
  )
}
