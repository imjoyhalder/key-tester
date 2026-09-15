"use client"

import { useId } from "react"
import { useKeyboardStore, type SoundProfile } from "@/stores/keyboard-store"
import { playKeySound } from "@/lib/key-sound"

export const SoundProfileSelector = () => {
  const id = useId()
  const soundProfile = useKeyboardStore((s) => s.soundProfile)
  const volume = useKeyboardStore((s) => s.volume)
  const setSoundProfile = useKeyboardStore((s) => s.setSoundProfile)
  const setVolume = useKeyboardStore((s) => s.setVolume)
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor={`${id}-profile`}
          className="mb-2 block text-sm font-medium"
        >
          Key sound
        </label>
        <select
          id={`${id}-profile`}
          value={soundProfile}
          onChange={(e) => {
            const profile = e.target.value as SoundProfile
            setSoundProfile(profile)
            playKeySound(profile, volume)
          }}
          className="min-h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="off">Off</option>
          <option value="blue">Clicky — sharp click</option>
          <option value="red">Clacky — crisp tap</option>
          <option value="creamy">Thocky — deeper tap</option>
        </select>
      </div>
      <div>
        <label
          htmlFor={`${id}-volume`}
          className="mb-2 flex justify-between text-sm"
        >
          Volume <span>{Math.round(volume * 100)}%</span>
        </label>
        <input
          id={`${id}-volume`}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-sky-600"
        />
      </div>
      <button
        type="button"
        disabled={soundProfile === "off" || volume === 0}
        onClick={() => playKeySound(soundProfile, volume)}
        className="min-h-10 rounded-md border border-border text-sm font-medium hover:bg-muted disabled:opacity-50"
      >
        Preview sound
      </button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Synthesized mechanical key sounds. Choose Off for silent testing.
      </p>
    </div>
  )
}
