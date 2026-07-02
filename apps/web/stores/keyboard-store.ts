"use client"

import { create } from "zustand"

export type KeyState = "default" | "pressed" | "verified" | "failed"
export type SoundProfile = "off" | "blue" | "red" | "creamy"
export type KeyboardLayout = "ansi" | "iso"

export interface KeyEntry {
  state: KeyState
  pressCount: number
  pressTimestamp: number
  latency: number
}

export interface InputHistoryItem {
  code: string
  label: string
  latency: number
  timestamp: number
}

export interface LatencyPoint {
  offset: number
  value: number
}

interface KeyboardState {
  keys: Record<string, KeyEntry>
  isRunning: boolean
  startTime: number | null
  testedCount: number
  failedKeys: Set<string>
  maxRollover: number
  currentlyPressed: Set<string>
  avgLatency: number
  allLatencies: number[]
  soundProfile: SoundProfile
  volume: number
  layout: KeyboardLayout
  inputHistory: InputHistoryItem[]
  latencyHistory: LatencyPoint[]
  testDuration: number
}

interface KeyboardActions {
  startTest: () => void
  clearAll: () => void
  pressKey: (code: string, label: string, timestamp: number) => void
  releaseKey: (code: string, timestamp: number) => void
  markFailed: (code: string) => void
  setSoundProfile: (profile: SoundProfile) => void
  setVolume: (volume: number) => void
  setLayout: (layout: KeyboardLayout) => void
  tickDuration: () => void
  exportResult: () => void
}

type KeyboardStore = KeyboardState & KeyboardActions

const initialState: KeyboardState = {
  keys: {},
  isRunning: true,
  startTime: null,
  testedCount: 0,
  failedKeys: new Set(),
  maxRollover: 0,
  currentlyPressed: new Set(),
  avgLatency: 0,
  allLatencies: [],
  soundProfile: "blue",
  volume: 0.5,
  layout: "ansi",
  inputHistory: [],
  latencyHistory: [],
  testDuration: 0,
}

export const useKeyboardStore = create<KeyboardStore>((set, get) => ({
  ...initialState,

  startTest: () => {
    set({
      ...initialState,
      isRunning: true,
      startTime: Date.now(),
      soundProfile: get().soundProfile,
      volume: get().volume,
      layout: get().layout,
    })
  },

  clearAll: () => {
    set({
      ...initialState,
      soundProfile: get().soundProfile,
      volume: get().volume,
      layout: get().layout,
    })
  },

  pressKey: (code: string, label: string, timestamp: number) => {
    set((state) => {
      if (!state.isRunning) return state

      const newPressed = new Set(state.currentlyPressed)
      newPressed.add(code)

      const rollover = newPressed.size
      const newMax = Math.max(state.maxRollover, rollover)

      const existingKey = state.keys[code]
      const updatedKeys = {
        ...state.keys,
        [code]: {
          state: "pressed" as KeyState,
          pressCount: (existingKey?.pressCount ?? 0) + 1,
          pressTimestamp: timestamp,
          latency: existingKey?.latency ?? 0,
        },
      }

      return {
        keys: updatedKeys,
        currentlyPressed: newPressed,
        maxRollover: newMax,
        // Timer starts on the first real keypress since the tester is always-on
        // (no explicit Start step) — until then startTime stays null and the
        // duration counter reads 0.
        startTime: state.startTime ?? Date.now(),
      }
    })

    const startTime = performance.now()
    const releaseCallback = () => {
      get().releaseKey(code, startTime)
    }

    const newHistory = [
      { code, label, latency: 0, timestamp },
      ...get().inputHistory,
    ].slice(0, 10)

    set({ inputHistory: newHistory })
  },

  releaseKey: (code: string, pressStart: number) => {
    const latency = Math.round(performance.now() - pressStart)

    set((state) => {
      if (!state.isRunning) return state

      const existingKey = state.keys[code]
      if (!existingKey) return state

      const newPressed = new Set(state.currentlyPressed)
      newPressed.delete(code)

      const isFirstTime = existingKey.pressCount === 1
      const newTestedCount = isFirstTime
        ? state.testedCount + 1
        : state.testedCount

      const newLatencies = [...state.allLatencies, latency]
      const avgLatency =
        Math.round(
          (newLatencies.reduce((a, b) => a + b, 0) / newLatencies.length) * 10
        ) / 10

      const newLatencyHistory = [
        ...state.latencyHistory,
        { offset: -state.latencyHistory.length, value: latency },
      ].slice(-20)

      const newHistory = state.inputHistory.map((item) =>
        item.code === code && item.latency === 0
          ? { ...item, latency }
          : item
      )

      const updatedKeys = {
        ...state.keys,
        [code]: {
          ...existingKey,
          state: "verified" as KeyState,
          latency,
        },
      }

      return {
        keys: updatedKeys,
        currentlyPressed: newPressed,
        testedCount: newTestedCount,
        allLatencies: newLatencies,
        avgLatency,
        latencyHistory: newLatencyHistory,
        inputHistory: newHistory,
      }
    })
  },

  markFailed: (code: string) => {
    set((state) => {
      const newFailed = new Set(state.failedKeys)
      newFailed.add(code)

      const updatedKeys = {
        ...state.keys,
        [code]: {
          state: "failed" as KeyState,
          pressCount: state.keys[code]?.pressCount ?? 0,
          pressTimestamp: state.keys[code]?.pressTimestamp ?? 0,
          latency: state.keys[code]?.latency ?? 0,
        },
      }

      return { keys: updatedKeys, failedKeys: newFailed }
    })
  },

  setSoundProfile: (profile: SoundProfile) => set({ soundProfile: profile }),
  setVolume: (volume: number) => set({ volume }),
  setLayout: (layout: KeyboardLayout) => set({ layout }),

  tickDuration: () => {
    const { startTime, isRunning } = get()
    if (isRunning && startTime) {
      set({ testDuration: Math.floor((Date.now() - startTime) / 1000) })
    }
  },

  exportResult: () => {
    const state = get()
    const data = {
      testedAt: new Date().toISOString(),
      keysVerified: state.testedCount,
      failedKeys: Array.from(state.failedKeys),
      maxRollover: state.maxRollover,
      avgLatency: state.avgLatency,
      duration: state.testDuration,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `keyboard-test-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  },
}))
