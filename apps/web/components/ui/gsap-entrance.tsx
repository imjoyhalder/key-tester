"use client"

import { useLayoutEffect } from "react"
import { gsap } from "gsap"

// Runs a one-shot cascade entrance animation on page mount.
// CSS initial states (added via inline <style> in layout.tsx) prevent the
// elements from flashing at full opacity before GSAP takes over.
export function GsapEntrance() {
  useLayoutEffect(() => {
    const q = (name: string) => `[data-gsap="${name}"]`

    // Remove CSS class so GSAP takes ownership of the properties
    document.documentElement.classList.remove("kt-loading")

    const ctx = gsap.context(() => {
      // header + statsbar are NOT hidden (removed from kt-loading CSS for LCP).
      // Only animate secondary/decorative sections that were hidden by kt-loading.
      // Some sections (ad slots, keyboard-extras) render conditionally, so each
      // target is guarded — GSAP warns if asked to animate a selector that
      // matches nothing, and empty/absent sections would trigger that.
      const has = (sel: string) => document.querySelector(sel) !== null

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } })

      // keyboard-card is the anchor of the entrance. Guarded — during a dev Fast
      // Refresh the effect can re-run a tick before the card is back in the DOM.
      // Note: only position/scale animate here — never opacity — so the loading
      // skeleton inside the card stays visible while the keyboard chunk loads.
      if (has(q("keyboard-card"))) {
        gsap.set(q("keyboard-card"), { y: 18, scale: 0.972 })
        tl.to(q("keyboard-card"), { y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)" })
      }

      const groups = [
        { sel: q("keyboard-extras") + " > *", from: { opacity: 0, y: 10 },  to: { opacity: 1, y: 0, duration: 0.3,  stagger: 0.07 },  at: "-=0.32" },
        { sel: q("sidebar-left") + " > *",    from: { opacity: 0, x: -18 }, to: { opacity: 1, x: 0, duration: 0.42, stagger: 0.065 }, at: "-=0.38" },
        { sel: q("sidebar-right") + " > *",   from: { opacity: 0, x: 18 },  to: { opacity: 1, x: 0, duration: 0.42, stagger: 0.065 }, at: "-=0.44" },
        { sel: q("footer"),                   from: { opacity: 0, y: 10 },  to: { opacity: 1, y: 0, duration: 0.35 },                 at: "-=0.2"  },
      ] as const

      for (const g of groups) {
        if (!has(g.sel)) continue
        gsap.set(g.sel, g.from)
        tl.to(g.sel, g.to, g.at)
      }
    })

    return () => ctx.revert()
  }, [])

  return null
}
