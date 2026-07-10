"use client"

import { useEffect, useRef } from "react"

interface GoogleAdProps {
  isEnabled: boolean
  adClientCode: string | null
  slot?: string
  format?: "auto" | "rectangle" | "horizontal"
  className?: string
}

export const GoogleAd = ({
  isEnabled,
  adClientCode,
  slot = "auto",
  format = "auto",
  className = "",
}: GoogleAdProps) => {
  const pushed = useRef(false)

  useEffect(() => {
    if (!isEnabled || !adClientCode || pushed.current) return
    if (typeof window === "undefined") return

    const win = window as typeof window & {
      adsbygoogle: Array<Record<string, unknown>>
    }
    win.adsbygoogle = win.adsbygoogle ?? []
    try {
      win.adsbygoogle.push({})
      pushed.current = true
    } catch {
      // AdSense push can fail silently in dev
    }
  }, [isEnabled, adClientCode])

  // No wrapper box, no placeholder text — AdSense's own script collapses
  // the <ins> tag to zero height when it has nothing to fill the slot
  // with. Wrapping it in a bordered/min-height div (the old behavior)
  // defeated that, leaving a visibly empty box whenever no ad filled.
  if (!isEnabled || !adClientCode) return null

  return (
    <ins
      className={["adsbygoogle block", className].join(" ")}
      data-ad-client={adClientCode}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      style={{ display: "block" }}
      aria-label="Advertisement"
    />
  )
}
