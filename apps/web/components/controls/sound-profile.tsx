"use client"

import { useKeyboardStore } from "@/stores/keyboard-store"
import type { SoundProfile } from "@/stores/keyboard-store"

interface ProfileOption {
  id: SoundProfile
  label: string
  icon: string
  bars: number[]
}

const PROFILES: ProfileOption[] = [
  { id: "off", label: "Off", icon: "🔇", bars: [] },
  {
    id: "blue",
    label: "Blue Switch",
    icon: "🔵",
    bars: [2, 4, 3, 5, 2, 4, 3],
  },
  {
    id: "red",
    label: "Red Switch",
    icon: "🔴",
    bars: [1, 3, 2, 4, 2, 3, 1],
  },
  {
    id: "creamy",
    label: "Creamy Switch",
    icon: "🟡",
    bars: [1, 2, 2, 3, 2, 2, 1],
  },
]

const WaveIcon = ({ bars }: { bars: number[] }) => (
  <svg viewBox="0 0 28 12" className="w-7 h-3" fill="currentColor">
    {bars.map((h, i) => (
      <rect
        key={i}
        x={i * 4}
        y={6 - h}
        width="3"
        height={h * 2}
        rx="1"
        className="opacity-70"
      />
    ))}
  </svg>
)

export const SoundProfileSelector = () => {
  const soundProfile = useKeyboardStore((s) => s.soundProfile)
  const volume = useKeyboardStore((s) => s.volume)
  const setSoundProfile = useKeyboardStore((s) => s.setSoundProfile)
  const setVolume = useKeyboardStore((s) => s.setVolume)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
        Sound Profile
      </p>
      <div className="flex flex-col gap-1">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSoundProfile(p.id)}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left",
              "font-mono text-xs transition-all",
              soundProfile === p.id
                ? "bg-violet-600/20 border border-violet-500/50 text-violet-300"
                : "bg-card border border-border hover:bg-muted text-foreground",
            ].join(" ")}
          >
            <span>{p.icon}</span>
            <span className="flex-1">{p.label}</span>
            {p.bars.length > 0 && <WaveIcon bars={p.bars} />}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-muted-foreground text-xs">🔈</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1.5 accent-violet-500 cursor-pointer"
        />
        <span className="text-muted-foreground text-xs">🔊</span>
      </div>
    </div>
  )
}
