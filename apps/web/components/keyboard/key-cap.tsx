"use client"

import { memo, useRef, useEffect } from "react"
import { gsap } from "gsap"
import type { KeyDef } from "./ansi-layout"
import type { KeyState } from "@/stores/keyboard-store"
import { cn } from "@workspace/ui/lib/utils"

export const KEY_UNIT = 48
export const KEY_GAP = 4

const kw = (u: number) => Math.round(u * (KEY_UNIT + KEY_GAP) - KEY_GAP)
const kh = (u: number) => (u > 1 ? Math.round(u * (KEY_UNIT + KEY_GAP) - KEY_GAP) : KEY_UNIT)

// Adaptive label size by character count
const labelSize = (s: string): string => {
  if (s.length <= 1) return "text-[17px]"
  if (s.length <= 3) return "text-[12px]"
  if (s.length <= 6) return "text-[10.5px]"
  return "text-[8.5px]"
}

// CSS face colors only — no shadow (GSAP owns all shadow/depth)
const FACE_CLASS: Record<KeyState, string> = {
  default:  "bg-key-default  border-key-default-border  text-key-default-text",
  pressed:  "bg-cyan-500/15  border-cyan-400/70          text-cyan-300",
  verified: "bg-emerald-500/10 border-emerald-500/50     text-emerald-400",
  failed:   "bg-red-500/10   border-red-500/60           text-red-400",
}

// GSAP-driven depth shadow per state.
// Layer 1: "0 Npx 0 color" = the 3D bottom-face of the keycap
// Layer 2: glow / drop shadow
const DEPTH: Record<KeyState, string> = {
  default:  "0 5px 0 rgba(0,0,0,0.55),        0 8px 16px rgba(0,0,0,0.30)",
  pressed:  "0 1px 0 rgba(0,0,0,0.40),        0 0px  8px rgba(34,211,238,0.35)",
  verified: "0 5px 0 rgba(16,185,129,0.60),   0 0px 28px rgba(16,185,129,0.80)",
  failed:   "0 5px 0 rgba(239, 68, 68,0.60),  0 0px 20px rgba(239, 68, 68,0.70)",
}
// Settled glow after the verified flash fades
const DEPTH_VERIFIED_SETTLE = "0 5px 0 rgba(16,185,129,0.45), 0 0px 10px rgba(16,185,129,0.30)"
const DEPTH_FAILED_SETTLE   = "0 5px 0 rgba(239,68,68,0.45),  0 0px 10px rgba(239,68,68,0.28)"

interface KeyCapProps {
  keyDef: KeyDef
  state:  KeyState
}

export const KeyCap = memo(({ keyDef, state }: KeyCapProps) => {
  const w = kw(keyDef.width)
  // Face height (48px for 1u, ~100px for a 2u tall key). The *container* stays
  // 1u tall so a tall key does not inflate its flex row and push the rows below
  // it down; the face is absolutely positioned and overflows downward into the
  // empty column of the next row (correct numpad +/Enter behaviour).
  const faceH = kh(keyDef.tall ?? 1)
  const top    = keyDef.labels[0] ?? ""
  const bottom = keyDef.labels[1]

  const faceRef  = useRef<HTMLDivElement>(null)
  const prevState = useRef<KeyState>("default")

  // Kill tweens on unmount
  useEffect(() => () => { if (faceRef.current) gsap.killTweensOf(faceRef.current) }, [])

  useEffect(() => {
    const el = faceRef.current
    if (!el) return
    const prev = prevState.current
    prevState.current = state

    if (state === "pressed") {
      // ── Fast snap down ──────────────────────────────────────
      gsap.to(el, {
        y: 3,
        boxShadow: DEPTH.pressed,
        duration: 0.045,
        ease: "power3.out",
        overwrite: true,
      })

    } else if (state === "verified") {
      // ── Spring back + green flash then settle ────────────────
      gsap.timeline({ overwrite: true })
        .to(el, {
          y: 0,
          boxShadow: DEPTH.verified,
          duration: 0.20,
          ease: "back.out(2.5)",
        })
        .to(el, {
          boxShadow: DEPTH_VERIFIED_SETTLE,
          duration: 0.45,
          ease: "power2.out",
        })

    } else if (state === "failed" && prev !== "failed") {
      // ── Lateral shake + red flash ────────────────────────────
      gsap.timeline({ overwrite: true })
        .to(el, { x: -5, duration: 0.05, ease: "power2.out" })
        .to(el, { x:  5, duration: 0.05, ease: "power2.inOut" })
        .to(el, { x: -3, duration: 0.04, ease: "power2.inOut" })
        .to(el, {
          x: 0, y: 0,
          boxShadow: DEPTH.failed,
          duration: 0.06,
          ease: "power2.out",
        })
        .to(el, {
          boxShadow: DEPTH_FAILED_SETTLE,
          duration: 0.5,
          ease: "power2.out",
        })

    } else {
      // ── Return to default (test reset / clear) ───────────────
      gsap.to(el, {
        x: 0, y: 0,
        boxShadow: DEPTH.default,
        duration: 0.18,
        ease: "power2.out",
        overwrite: true,
      })
    }
  }, [state])

  return (
    <div
      data-code={keyDef.code}
      style={{ width: w, height: KEY_UNIT, minWidth: w, flexShrink: 0 }}
      className="relative pointer-events-none select-none"
    >
      {/* Face: GSAP animates y, x, boxShadow — CSS handles colors.
          Height is the full (possibly 2u) key height; it overflows the 1u
          container downward for tall keys. */}
      <div
        ref={faceRef}
        style={{ boxShadow: DEPTH.default, height: faceH }}
        className={cn(
          "absolute inset-x-0 top-0 rounded-[5px] border",
          "flex flex-col items-center justify-center font-mono",
          // Top-edge highlight stripe (simulates studio light on keycap)
          "before:absolute before:inset-x-[2px] before:top-0 before:h-[2px]",
          "before:rounded-t-[5px] before:bg-white/[0.13] before:pointer-events-none",
          FACE_CLASS[state]
        )}
      >
        {bottom && bottom !== top ? (
          <div className="flex flex-col items-center gap-[3px] leading-none">
            <span className={cn("font-bold", top.length <= 1 ? "text-[13px]" : "text-[11px]")}>
              {top}
            </span>
            <span className={cn("opacity-60", bottom.length <= 4 ? "text-[10px]" : "text-[8.5px]")}>
              {bottom}
            </span>
          </div>
        ) : (
          <span className={cn("font-bold leading-none text-center w-full px-1 truncate", labelSize(top))}>
            {top}
          </span>
        )}
      </div>
    </div>
  )
})

KeyCap.displayName = "KeyCap"
