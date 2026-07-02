"use client"

import { ArrowRight } from "lucide-react"
import { useKeyboardStore } from "@/stores/keyboard-store"
import { ALL_KEY_CODES } from "@/components/keyboard/ansi-layout"
import type { CustomAd } from "@/types/admin"

// Threshold of distinct keys verified before we treat the visit as an engaged
// "test session" worth surfacing a soft upgrade CTA.
const ENGAGED_THRESHOLD = 20

interface SponsorCtaProps {
  ad: CustomAd
}

// Intent-triggered sponsor card. A keyboard-tester visitor is high purchase
// intent — especially the moment a key is detected as faulty — so we surface a
// contextual, relevant CTA exactly then (and a softer one once they've tested a
// meaningful chunk of the board). Stays hidden during early testing so it never
// competes with the core tool.
export const SponsorCta = ({ ad }: SponsorCtaProps) => {
  const failedCount = useKeyboardStore((s) => s.failedKeys.size)
  const testedCount = useKeyboardStore((s) => s.testedCount)

  const hasFailure = failedCount > 0
  const isComplete = testedCount >= ALL_KEY_CODES.length
  const isEngaged = testedCount >= ENGAGED_THRESHOLD

  if (!hasFailure && !isEngaged) return null

  const headline = hasFailure
    ? `Found ${failedCount} faulty ${failedCount === 1 ? "key" : "keys"}? Time for an upgrade.`
    : isComplete
      ? "All keys check out — keep your setup sharp."
      : "Testing your gear? Grab a deal while you're here."

  const accent = hasFailure
    ? "border-red-500/50 bg-red-500/5 hover:border-red-500/70"
    : "border-violet-500/40 bg-violet-500/5 hover:border-violet-500/60"

  const badge = hasFailure ? "text-red-500 dark:text-red-400" : "text-violet-500 dark:text-violet-400"

  return (
    <a
      href={ad.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={ad.altText || ad.title}
      className={[
        "group flex items-center gap-3 w-full rounded-xl border px-4 py-3 transition-all duration-200",
        accent,
      ].join(" ")}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={["text-[9px] font-mono font-semibold uppercase tracking-wider", badge].join(" ")}>
            Sponsored
          </span>
        </div>
        <p className="text-[13px] font-mono font-semibold text-foreground line-clamp-1 mt-0.5">
          {headline}
        </p>
        <p className="text-[11px] text-muted-foreground font-mono truncate">
          {ad.title}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground transition-all" />
    </a>
  )
}
