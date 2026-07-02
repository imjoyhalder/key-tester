import type { KeyboardSection } from "./ansi-layout"
import { ANSI_LAYOUT } from "./ansi-layout"

const gap = (w: number) => ({ type: "gap" as const, width: w })
const k = (
  code: string,
  labels: string[],
  width = 1,
  tall?: number
) => ({ code, labels, width, ...(tall ? { tall } : {}) })

export const ISO_LAYOUT: KeyboardSection[] = [
  ANSI_LAYOUT[0]!,
  {
    id: "main-block",
    rows: [
      // Number row — identical to ANSI
      ANSI_LAYOUT[1]!.rows[0]!,
      // QWERTY row — Tab is 1.5u, no backslash at end (moved to home row)
      [
        k("Tab", ["Tab"], 1.5),
        k("KeyQ", ["Q"]),
        k("KeyW", ["W"]),
        k("KeyE", ["E"]),
        k("KeyR", ["R"]),
        k("KeyT", ["T"]),
        k("KeyY", ["Y"]),
        k("KeyU", ["U"]),
        k("KeyI", ["I"]),
        k("KeyO", ["O"]),
        k("KeyP", ["P"]),
        k("BracketLeft", ["{", "["]),
        k("BracketRight", ["}", "]"]),
        gap(0.5),
        k("Delete", ["Del"]),
        k("End", ["End"]),
        k("PageDown", ["PgDn"]),
      ],
      // Home row — ISO Enter is tall (2-row), backslash added
      [
        k("CapsLock", ["Caps Lock"], 1.75),
        k("KeyA", ["A"]),
        k("KeyS", ["S"]),
        k("KeyD", ["D"]),
        k("KeyF", ["F"]),
        k("KeyG", ["G"]),
        k("KeyH", ["H"]),
        k("KeyJ", ["J"]),
        k("KeyK", ["K"]),
        k("KeyL", ["L"]),
        k("Semicolon", [":", ";"]),
        k("Quote", ['"', "'"]),
        k("Backslash", ["|", "\\"]),
        k("Enter", ["Enter"], 1.25, 2),
        gap(3.5),
      ],
      // Shift row — ISO left shift is 1.25u, IntlBackslash added
      [
        k("ShiftLeft", ["Shift"], 1.25),
        k("IntlBackslash", ["\\", "|"]),
        k("KeyZ", ["Z"]),
        k("KeyX", ["X"]),
        k("KeyC", ["C"]),
        k("KeyV", ["V"]),
        k("KeyB", ["B"]),
        k("KeyN", ["N"]),
        k("KeyM", ["M"]),
        k("Comma", ["<", ","]),
        k("Period", [">", "."]),
        k("Slash", ["?", "/"]),
        k("ShiftRight", ["Shift"], 2.75),
        gap(0.5),
        gap(1),
        k("ArrowUp", ["↑"]),
        gap(1),
      ],
      // Bottom row — identical to ANSI
      ANSI_LAYOUT[1]!.rows[4]!,
    ],
  },
  ANSI_LAYOUT[2]!,
]
