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
  const ref = useRef<HTMLDivElement>(null)
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

  return (
    <div
      ref={ref}
      className={[
        "min-h-[90px] flex items-center justify-center",
        "rounded-lg border border-border bg-muted/30",
        className,
      ].join(" ")}
      aria-label="Advertisement"
    >
      {isEnabled && adClientCode ? (
        <ins
          className="adsbygoogle block"
          data-ad-client={adClientCode}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
          style={{ display: "block" }}
        />
      ) : (
        <p className="text-[10px] text-muted-foreground font-mono">
          Advertisement
        </p>
      )}
    </div>
  )
}
