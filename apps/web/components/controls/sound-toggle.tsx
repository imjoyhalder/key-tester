"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { Volume2, VolumeX } from "lucide-react"
import { useKeyboardStore } from "@/stores/keyboard-store"

const pressTween   = { scale: 0.9, duration: 0.07, ease: "power3.in",    overwrite: true } as const
const releaseTween = { scale: 1,   duration: 0.25, ease: "back.out(2.2)", overwrite: true } as const

export const SoundToggle = () => {
  const soundProfile = useKeyboardStore((s) => s.soundProfile)
  const setSoundProfile = useKeyboardStore((s) => s.setSoundProfile)

  const ref = useRef<HTMLButtonElement>(null)
  const soundOn = soundProfile !== "off"

  const press   = () => ref.current && gsap.to(ref.current, pressTween)
  const release = () => ref.current && gsap.to(ref.current, releaseTween)

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setSoundProfile(soundOn ? "off" : "blue")}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
      aria-label={soundOn ? "Sound on — click to mute key sounds" : "Sound off — click to enable key sounds"}
      aria-pressed={soundOn}
      title={soundOn ? "Key sound: on" : "Key sound: off"}
      className={[
        "flex items-center justify-center w-8 h-8 shrink-0 rounded-lg border transition-colors",
        soundOn
          ? "bg-violet-600/15 border-violet-500/40 text-violet-400 hover:bg-violet-600/25"
          : "bg-card border-border text-muted-foreground hover:bg-muted",
      ].join(" ")}
    >
      {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  )
}
