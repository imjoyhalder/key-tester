"use client"

import { useEffect, useCallback, useRef, useLayoutEffect } from "react"

// useLayoutEffect on the client, useEffect on the server. The keyboard is now
// server-rendered (static, fast first paint), and plain useLayoutEffect would
// log "useLayoutEffect does nothing on the server" during SSR.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect
import { useKeyboardStore } from "@/stores/keyboard-store"
import { ANSI_LAYOUT, isGap, KEY_LABEL_MAP } from "./ansi-layout"
import type { KeyDef, RowItem, KeyboardSection } from "./ansi-layout"
import { ISO_LAYOUT } from "./iso-layout"
import { KeyCap, KEY_UNIT, KEY_GAP } from "./key-cap"
import type { KeyState } from "@/stores/keyboard-store"

// Single shared AudioContext — creating one per keypress (old approach) caused
// TBT > 1 s because each allocation locks the main thread for ~50 ms.
let _audioCtx: AudioContext | null = null

const getAudioCtx = (): AudioContext | null => {
  if (typeof AudioContext === "undefined") return null
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new AudioContext()
  }
  if (_audioCtx.state === "suspended") {
    void _audioCtx.resume()
  }
  return _audioCtx
}

const playSoundEffect = (profile: string, volume: number): void => {
  if (profile === "off" || typeof window === "undefined") return
  const ctx = getAudioCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  const now = ctx.currentTime
  const vol = volume
  if (profile === "blue") {
    osc.type = "square"
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02)
    gain.gain.setValueAtTime(vol * 0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    osc.start(now)
    osc.stop(now + 0.04)
  } else if (profile === "red") {
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.04)
    gain.gain.setValueAtTime(vol * 0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    osc.start(now)
    osc.stop(now + 0.08)
  } else {
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.06)
    gain.gain.setValueAtTime(vol * 0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    osc.start(now)
    osc.stop(now + 0.12)
  }
}

const RowRenderer = ({
  row,
  keyStates,
}: {
  row: RowItem[]
  keyStates: Record<string, { state: KeyState }>
}) => (
  <div className="flex" style={{ gap: KEY_GAP }}>
    {row.map((item, i) => {
      if (isGap(item)) {
        return (
          <div
            key={`gap-${i}`}
            style={{ width: Math.round(item.width * (KEY_UNIT + KEY_GAP)), flexShrink: 0 }}
          />
        )
      }
      const key = item as KeyDef
      return (
        <KeyCap
          key={key.code}
          keyDef={key}
          state={keyStates[key.code]?.state ?? "default"}
        />
      )
    })}
  </div>
)

export const KeyboardLayout = () => {
  // Atomic selectors: this component must not re-render on unrelated store
  // changes (e.g. the 1 s duration tick or input-history updates) — that would
  // reconcile all ~104 keys needlessly. It re-renders only when `keys` changes.
  const keys = useKeyboardStore((s) => s.keys)
  const isRunning = useKeyboardStore((s) => s.isRunning)
  const layout = useKeyboardStore((s) => s.layout)
  const soundProfile = useKeyboardStore((s) => s.soundProfile)
  const volume = useKeyboardStore((s) => s.volume)
  const pressKey = useKeyboardStore((s) => s.pressKey)
  const releaseKey = useKeyboardStore((s) => s.releaseKey)
  const pressTimestamps = useRef<Map<string, number>>(new Map())
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Direct DOM zoom — avoids a setState re-render cycle so there is no visible
  // flash between the unscaled first paint and the correctly-scaled second paint.
  // The natural width is re-measured on every call (zoom reset to 1 first) rather
  // than cached: the keyboard is server-rendered, and during hydration a cached
  // width could lock in the wrong (unscaled) value, leaving the keyboard at full
  // size and overflowing its container.
  const applyScale = useCallback(() => {
    const inner = innerRef.current
    const wrapper = wrapperRef.current
    if (!inner || !wrapper) return
    inner.style.zoom = "1"
    // getBoundingClientRect (sub-pixel) instead of scrollWidth/offsetWidth
    // (both integer, each rounded independently). Dividing two independently
    // rounded integers drifts by up to a full CSS px, and — because that
    // rounding happens post browser-zoom — the drift direction changes with
    // the page's zoom level, so the same layout can end up very slightly
    // under- or over-scaled depending on whether the browser is at 100%,
    // 110%, etc. Sub-pixel values are unaffected by that snapping.
    const natural = inner.getBoundingClientRect().width
    if (natural === 0) return
    // Scale both up and down to fill the wrapper — capping at 1 meant the
    // keyboard stayed at its natural (~900px) size on wide screens, leaving
    // the rest of the card empty. MAX_SCALE is just a sanity ceiling (the
    // page's own max-w-6xl already keeps the wrapper from growing without
    // bound); floor (not round) so any drift errs toward slightly-too-small
    // rather than overflowing the wrapper.
    const MAX_SCALE = 1.6
    const s = Math.floor(Math.min(MAX_SCALE, wrapper.getBoundingClientRect().width / natural) * 1000) / 1000
    inner.style.zoom = String(s)
  }, [])

  // Runs synchronously before paint on the client — safe to read layout here.
  useIsomorphicLayoutEffect(() => { applyScale() }, [applyScale])

  useEffect(() => {
    // ResizeObserver fires after paint; wrap in rAF to batch the read/write
    // cycle and avoid forced-reflow from reading offsetWidth after a style change.
    let rafId = 0
    const obs = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(applyScale)
    })
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => { obs.disconnect(); cancelAnimationFrame(rafId) }
  }, [applyScale])

  const handlePress = useCallback(
    (code: string) => {
      if (!isRunning) return
      if (!pressTimestamps.current.has(code)) {
        const start = performance.now()
        pressTimestamps.current.set(code, start)
        pressKey(code, KEY_LABEL_MAP[code] ?? code, Date.now())
        playSoundEffect(soundProfile, volume)
        // F10 (menu bar), F11 (fullscreen), F12 (DevTools), Win key — the browser/OS
        // swallows the keyup event so it never reaches JavaScript. Auto-release after
        // 1.2 s if keyup hasn't fired, so the key still counts as verified.
        setTimeout(() => {
          if (pressTimestamps.current.has(code)) {
            pressTimestamps.current.delete(code)
            releaseKey(code, start)
          }
        }, 1200)
      }
    },
    [isRunning, pressKey, releaseKey, soundProfile, volume]
  )

  const handleRelease = useCallback(
    (code: string) => {
      if (!isRunning) return
      const start = pressTimestamps.current.get(code) ?? performance.now()
      pressTimestamps.current.delete(code)
      releaseKey(code, start)
    },
    [isRunning, releaseKey]
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // capture phase + stopPropagation prevents browser built-ins:
      // F1 (help), F3 (find), F5 (refresh), F11 (fullscreen), CapsLock toggle, etc.
      // Note: MetaLeft/MetaRight (Windows key) is OS-level and cannot be blocked by browsers.
      e.preventDefault()
      e.stopPropagation()
      if (!e.repeat) handlePress(e.code)
    }
    const up = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleRelease(e.code)
    }
    // F10/F11/F12/Win key — browser/OS swallows keyup so it never reaches the page.
    // • blur: window loses focus to another app
    // • focus: window regains focus after F10 menu bar or F11 fullscreen (keyup missed)
    // • visibilitychange: tab hidden/shown
    // The per-key 1.2 s timeout in handlePress is the final safety net.
    const releaseAll = () => {
      Array.from(pressTimestamps.current.keys()).forEach((code) => {
        handleRelease(code)
      })
    }
    const onVisibility = () => { if (document.hidden) releaseAll() }
    window.addEventListener("keydown", down, { capture: true })
    window.addEventListener("keyup", up, { capture: true })
    window.addEventListener("blur", releaseAll)
    window.addEventListener("focus", releaseAll)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("keydown", down, { capture: true })
      window.removeEventListener("keyup", up, { capture: true })
      window.removeEventListener("blur", releaseAll)
      window.removeEventListener("focus", releaseAll)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [handlePress, handleRelease])

  const sections: KeyboardSection[] = layout === "iso" ? ISO_LAYOUT : ANSI_LAYOUT
  const fnSection = sections[0]!
  const mainSection = sections[1]!
  const numpadSection = sections[2]!

  const FN_ROW_HEIGHT = KEY_UNIT + 8

  return (
    // overflow-x-clip contains the natural-width keyboard horizontally during
    // the brief window between SSR paint and the client scale being applied
    // (prevents a flash of horizontal overflow) WITHOUT clipping the keys'
    // downward 3D drop-shadow at the bottom edge (overflow-y stays visible).
    <div ref={wrapperRef} className="w-full overflow-x-clip">
      <div
        ref={innerRef}
        className="inline-block"
      >
        <div className="inline-flex items-start" style={{ gap: 16 }}>

          {/* Left column: function row stacked above main block */}
          <div className="flex flex-col">
            {/* Function row */}
            <div className="flex mb-2" style={{ gap: KEY_GAP }}>
              {fnSection.rows[0]!.map((item, i) => {
                if (isGap(item)) {
                  return (
                    <div
                      key={`fn-gap-${i}`}
                      style={{ width: Math.round(item.width * (KEY_UNIT + KEY_GAP)), flexShrink: 0 }}
                    />
                  )
                }
                const key = item as KeyDef
                return (
                  <KeyCap
                    key={key.code}
                    keyDef={key}
                    state={keys[key.code]?.state ?? "default"}
                  />
                )
              })}
            </div>

            {/* Main block */}
            <div className="flex flex-col" style={{ gap: KEY_GAP }}>
              {mainSection.rows.map((row, i) => (
                <RowRenderer
                  key={i}
                  row={row}
                  keyStates={keys}
                />
              ))}
            </div>
          </div>

          {/* Numpad — top-aligned with main block, offset by fn row height */}
          <div
            className="flex flex-col"
            style={{ gap: KEY_GAP, marginTop: FN_ROW_HEIGHT }}
          >
            {numpadSection.rows.map((row, i) => (
              <RowRenderer
                key={i}
                row={row}
                keyStates={keys}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
