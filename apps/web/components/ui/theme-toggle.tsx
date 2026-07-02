"use client"

import { useTheme } from "next-themes"
import { useRef } from "react"
import { gsap } from "gsap"

// Static, flash-free theme toggle. next-themes sets the `dark` class on <html>
// via a blocking inline script before first paint, so the correct icon/label is
// shown purely via CSS `dark:` variants — no `mounted` gate, no placeholder
// skeleton, and no layout shift on hydration.
export const ThemeToggle = () => {
  const { setTheme } = useTheme()
  const btnRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  const handleClick = () => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotation: 0, scale: 0.5 },
        { rotation: 360, scale: 1, duration: 0.48, ease: "back.out(2.2)" }
      )
    }
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 0.88,
        duration: 0.08,
        ease: "power3.in",
        onComplete: () =>
          gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }),
      })
    }
    // Read the current theme straight from the DOM class so the toggle works
    // even before next-themes' resolvedTheme has resolved on the client.
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      aria-label="Toggle color theme"
      className={[
        "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono shrink-0",
        "border border-border bg-card hover:bg-muted transition-colors",
      ].join(" ")}
    >
      <span ref={iconRef} className="inline-block leading-none">
        <span className="hidden dark:inline">🌙</span>
        <span className="inline dark:hidden">☀️</span>
      </span>
      <span className="hidden sm:inline text-muted-foreground">
        <span className="hidden dark:inline">Dark</span>
        <span className="inline dark:hidden">Light</span>
      </span>
    </button>
  )
}
