"use client"

import { useEffect, useCallback, useRef, useLayoutEffect } from "react"

// useLayoutEffect on the client, useEffect on the server. The keyboard is now
// server-rendered (static, fast first paint), and plain useLayoutEffect would
// log "useLayoutEffect does nothing on the server" during SSR.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect
import { useKeyboardStore } from "@/stores/keyboard-store"
import { ANSI_LAYOUT, isGap, KEY_LABEL_MAP } from "./ansi-layout"
import type { KeyDef, RowItem, KeyboardSection } from "./ansi-layout"
import { ISO_LAYOUT } from "./iso-layout"
import styles from "./keyboard.module.css"
import { KeyCap, KEY_UNIT, KEY_GAP } from "./key-cap"
import type { KeyState } from "@/stores/keyboard-store"

import { playKeySound } from "@/lib/key-sound"

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
            style={{
              width: Math.round(item.width * (KEY_UNIT + KEY_GAP)),
              flexShrink: 0,
            }}
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
    const s =
      Math.floor(
        Math.min(
          MAX_SCALE,
          Math.max(760, wrapper.getBoundingClientRect().width) / natural
        ) * 1000
      ) / 1000
    inner.style.zoom = String(s)
  }, [])

  // Runs synchronously before paint on the client — safe to read layout here.
  useIsomorphicLayoutEffect(() => {
    applyScale()
  }, [applyScale])

  useEffect(() => {
    // ResizeObserver fires after paint; wrap in rAF to batch the read/write
    // cycle and avoid forced-reflow from reading offsetWidth after a style change.
    let rafId = 0
    const obs = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(applyScale)
    })
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [applyScale])

  useEffect(() => {
    if (Object.keys(keys).length === 0) pressTimestamps.current.clear()
  }, [keys])

  const handlePress = useCallback(
    (code: string) => {
      if (!isRunning) return
      if (!pressTimestamps.current.has(code)) {
        const start = performance.now()
        pressTimestamps.current.set(code, start)
        pressKey(code, KEY_LABEL_MAP[code] ?? code, Date.now())
        playKeySound(soundProfile, volume, code)
      }
    },
    [isRunning, pressKey, soundProfile, volume]
  )

  const handleRelease = useCallback(
    (code: string) => {
      if (!isRunning) return
      const start = pressTimestamps.current.get(code)
      if (start === undefined) return
      pressTimestamps.current.delete(code)
      releaseKey(code, start)
    },
    [isRunning, releaseKey]
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.target instanceof Element &&
        e.target.closest("input, textarea, select, [contenteditable=true]")
      )
        return
      // Keep navigation and control activation usable while testing letters.
      if (e.code === "Tab") {
        if (!e.repeat) handlePress(e.code)
        return
      }
      if (
        e.target instanceof Element &&
        e.target.closest("button, a, summary") &&
        [
          "Enter",
          "Space",
          "Escape",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.code)
      )
        return
      // capture phase + stopPropagation prevents browser built-ins:
      // F1 (help), F3 (find), F5 (refresh), F11 (fullscreen), CapsLock toggle, etc.
      // Note: MetaLeft/MetaRight (Windows key) is OS-level and cannot be blocked by browsers.
      e.preventDefault()
      e.stopPropagation()
      if (!e.repeat) handlePress(e.code)
    }
    const up = (e: KeyboardEvent) => {
      if (!pressTimestamps.current.has(e.code)) return
      e.preventDefault()
      e.stopPropagation()
      handleRelease(e.code)
    }
    // F10/F11/F12/Win key — browser/OS swallows keyup so it never reaches the page.
    // • blur: window loses focus to another app
    // • focus: window regains focus after F10 menu bar or F11 fullscreen (keyup missed)
    // • visibilitychange: tab hidden/shown
    // Held keys remain pressed until keyup or loss of page focus.
    const releaseAll = () => {
      Array.from(pressTimestamps.current.keys()).forEach((code) => {
        handleRelease(code)
      })
    }
    const onVisibility = () => {
      if (document.hidden) releaseAll()
    }
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

  const sections: KeyboardSection[] =
    layout === "iso" ? ISO_LAYOUT : ANSI_LAYOUT
  const fnSection = sections[0]!
  const mainSection = sections[1]!
  const numpadSection = sections[2]!

  const FN_ROW_HEIGHT = KEY_UNIT + 8

  return (
    // Keep labels readable on small screens with horizontal scrolling.
    <div ref={wrapperRef} className="w-full overflow-x-auto pb-4">
      <div ref={innerRef} className={styles.case}>
        <div
          className={`${styles.plate} inline-flex items-start`}
          style={{ gap: 16 }}
        >
          {/* Left column: function row stacked above main block */}
          <div className="flex flex-col">
            {/* Function row */}
            <div className="mb-2 flex" style={{ gap: KEY_GAP }}>
              {fnSection.rows[0]!.map((item, i) => {
                if (isGap(item)) {
                  return (
                    <div
                      key={`fn-gap-${i}`}
                      style={{
                        width: Math.round(item.width * (KEY_UNIT + KEY_GAP)),
                        flexShrink: 0,
                      }}
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
                <RowRenderer key={i} row={row} keyStates={keys} />
              ))}
            </div>
          </div>

          {/* Numpad — top-aligned with main block, offset by fn row height */}
          <div
            className="flex flex-col"
            style={{ gap: KEY_GAP, marginTop: FN_ROW_HEIGHT }}
          >
            {numpadSection.rows.map((row, i) => (
              <RowRenderer key={i} row={row} keyStates={keys} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
