export const SLOTS = ["sidebar-left", "sidebar", "banner"] as const
export type Slot = (typeof SLOTS)[number]
export const SLOT_LABEL: Record<Slot, string> = {
  "sidebar-left": "Sidebar (Left)",
  "sidebar":      "Sidebar (Right)",
  "banner":       "Top Banner",
}
