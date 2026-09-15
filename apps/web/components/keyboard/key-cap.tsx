"use client"

import { memo } from "react"
import type { KeyDef } from "./ansi-layout"
import type { KeyState } from "@/stores/keyboard-store"
import styles from "./keyboard.module.css"

export const KEY_UNIT = 48
export const KEY_GAP = 4

interface KeyCapProps {
  keyDef: KeyDef
  state: KeyState
}

export const KeyCap = memo(({ keyDef, state }: KeyCapProps) => {
  const width = Math.round(keyDef.width * (KEY_UNIT + KEY_GAP) - KEY_GAP)
  const height = Math.round((keyDef.tall ?? 1) * (KEY_UNIT + KEY_GAP) - KEY_GAP)
  const top = keyDef.labels[0] ?? ""
  const bottom = keyDef.labels[1]
  const isMeta = keyDef.code === "MetaLeft" || keyDef.code === "MetaRight"
  const homing = ["KeyF", "KeyJ", "Numpad5"].includes(keyDef.code)
  const modifier = keyDef.width > 1 && keyDef.code !== "Space"

  return (
    <div
      data-code={keyDef.code}
      data-state={state}
      data-modifier={modifier || undefined}
      data-accent={keyDef.code === "Escape" || undefined}
      className={styles.key}
      style={{ width, height: KEY_UNIT, minWidth: width }}
      aria-label={`${isMeta ? "Windows / Command" : keyDef.code === "Space" ? "Space" : keyDef.labels.join(" ")}: ${state}`}
    >
      {/* Tall faces span two rows while their layout slot stays one row high. */}
      <div className={styles.face} style={{ height }}>
        <div className={styles.legend}>
          {isMeta ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              width="19"
              height="19"
              fill="currentColor"
            >
              <path d="M1 1h8v8H1zm10 0h8v8h-8zM1 11h8v8H1zm10 0h8v8h-8z" />
            </svg>
          ) : (
            <span
              style={{
                fontSize: top.length <= 1 ? 17 : top.length <= 6 ? 12 : 10.5,
              }}
            >
              {top}
            </span>
          )}
          {bottom && bottom !== top && (
            <span className={styles.secondary}>{bottom}</span>
          )}
        </div>
        {homing && <span className={styles.homing} aria-hidden="true" />}
      </div>
    </div>
  )
})

KeyCap.displayName = "KeyCap"
