"use client"

import dynamic from "next/dynamic"

// Client-only loader for the GSAP entrance animation. The dynamic import with
// { ssr: false } must live in a Client Component — Next.js 16 disallows it in
// Server Components (e.g. the root layout). Deferring it keeps GSAP (~100 KB)
// out of the critical JS bundle.
const GsapEntrance = dynamic(
  () => import("@/components/ui/gsap-entrance").then((m) => ({ default: m.GsapEntrance })),
  { ssr: false }
)

export function GsapEntranceLoader() {
  return <GsapEntrance />
}
