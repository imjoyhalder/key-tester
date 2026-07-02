export interface KeyDef {
  code: string
  labels: string[]
  width: number
  tall?: number
}

export interface GapDef {
  type: "gap"
  width: number
}

export type RowItem = KeyDef | GapDef

export interface KeyboardSection {
  id: string
  rows: RowItem[][]
}

export const isGap = (item: RowItem): item is GapDef =>
  (item as GapDef).type === "gap"

const gap = (w: number): GapDef => ({ type: "gap", width: w })

const k = (
  code: string,
  labels: string[],
  width = 1,
  tall?: number
): KeyDef => ({ code, labels, width, ...(tall ? { tall } : {}) })

export const ANSI_LAYOUT: KeyboardSection[] = [
  // ── Section 0: Function row + nav cluster ──────────────────────────────────
  {
    id: "function-row",
    rows: [
      [
        k("Escape", ["Esc"]),
        gap(0.5),
        k("F1", ["F1"]),
        k("F2", ["F2"]),
        k("F3", ["F3"]),
        k("F4", ["F4"]),
        gap(0.5),
        k("F5", ["F5"]),
        k("F6", ["F6"]),
        k("F7", ["F7"]),
        k("F8", ["F8"]),
        gap(0.5),
        k("F9", ["F9"]),
        k("F10", ["F10"]),
        k("F11", ["F11"]),
        k("F12", ["F12"]),
        gap(0.5),
        k("PrintScreen", ["PrtSc"]),
        k("ScrollLock", ["ScrLk"]),
        k("Pause", ["Pause"]),
      ],
    ],
  },

  // ── Section 1: Main block ──────────────────────────────────────────────────
  {
    id: "main-block",
    rows: [
      // Number row
      [
        k("Backquote", ["~", "`"]),
        k("Digit1", ["!", "1"]),
        k("Digit2", ["@", "2"]),
        k("Digit3", ["#", "3"]),
        k("Digit4", ["$", "4"]),
        k("Digit5", ["%", "5"]),
        k("Digit6", ["^", "6"]),
        k("Digit7", ["&", "7"]),
        k("Digit8", ["*", "8"]),
        k("Digit9", ["(", "9"]),
        k("Digit0", [")", "0"]),
        k("Minus", ["_", "-"]),
        k("Equal", ["+", "="]),
        k("Backspace", ["Backspace"], 2),
        gap(0.5),
        k("Insert", ["Ins"]),
        k("Home", ["Home"]),
        k("PageUp", ["PgUp"]),
      ],
      // QWERTY row
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
        k("Backslash", ["|", "\\"], 1.5),
        gap(0.5),
        k("Delete", ["Del"]),
        k("End", ["End"]),
        k("PageDown", ["PgDn"]),
      ],
      // Home row
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
        k("Enter", ["Enter"], 2.25),
        gap(3.5),
      ],
      // Shift row
      [
        k("ShiftLeft", ["Shift"], 2.25),
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
      // Bottom row
      [
        k("ControlLeft", ["Ctrl"], 1.25),
        k("MetaLeft", ["⊞"], 1.25),
        k("AltLeft", ["Alt"], 1.25),
        k("Space", [""], 6.25),
        k("AltRight", ["Alt"], 1.25),
        k("MetaRight", ["⊞"], 1.25),
        k("ContextMenu", ["☰"], 1.25),
        k("ControlRight", ["Ctrl"], 1.25),
        gap(0.5),
        k("ArrowLeft", ["←"]),
        k("ArrowDown", ["↓"]),
        k("ArrowRight", ["→"]),
      ],
    ],
  },

  // ── Section 2: Numpad ──────────────────────────────────────────────────────
  {
    id: "numpad",
    rows: [
      [
        k("NumLock", ["Num", "Lk"]),
        k("NumpadDivide", ["/"]),
        k("NumpadMultiply", ["*"]),
        k("NumpadSubtract", ["-"]),
      ],
      [
        k("Numpad7", ["7", "Home"]),
        k("Numpad8", ["8", "↑"]),
        k("Numpad9", ["9", "PgUp"]),
        k("NumpadAdd", ["+"], 1, 2),
      ],
      [
        k("Numpad4", ["4", "←"]),
        k("Numpad5", ["5"]),
        k("Numpad6", ["6", "→"]),
      ],
      [
        k("Numpad1", ["1", "End"]),
        k("Numpad2", ["2", "↓"]),
        k("Numpad3", ["3", "PgDn"]),
        k("NumpadEnter", ["Enter"], 1, 2),
      ],
      [k("Numpad0", ["0", "Ins"], 2), k("NumpadDecimal", [".", "Del"])],
    ],
  },
]

export const ALL_KEY_CODES: string[] = ANSI_LAYOUT.flatMap((section) =>
  section.rows.flatMap((row) =>
    row.filter((item): item is KeyDef => !isGap(item)).map((k) => k.code)
  )
)

export const KEY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ANSI_LAYOUT.flatMap((section) =>
    section.rows.flatMap((row) =>
      row
        .filter((item): item is KeyDef => !isGap(item))
        .map((k) => [k.code, k.labels[0] ?? k.code])
    )
  )
)
