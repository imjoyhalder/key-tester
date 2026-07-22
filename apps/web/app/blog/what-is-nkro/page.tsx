import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { getBlogPost } from "@/lib/blog-posts"

const post = getBlogPost("what-is-nkro")!

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  robots: { index: true, follow: true },
  alternates: { canonical: "/blog/what-is-nkro" },
}

export default function WhatIsNkroPost() {
  return (
    <BlogPostLayout post={post}>
      <p>
        N-Key Rollover, or NKRO, describes how many keys a keyboard can register at exactly the
        same time without dropping any of them. A keyboard with full NKRO can report every key
        you&apos;re physically holding down simultaneously — press all 104 keys at once, and all
        104 register. Most keyboards can&apos;t do that, and for the vast majority of typing,
        they don&apos;t need to.
      </p>

      <h2>Why this matters at all</h2>
      <p>
        You rarely press more than two or three keys at once while typing a sentence. But games
        routinely require four, five, or more keys held down together — movement keys plus a
        modifier, plus an ability key, plus a mouse-adjacent key like Shift or Ctrl. If your
        keyboard can&apos;t register that many simultaneous presses, one of those inputs simply
        gets dropped, and in a fast-paced game that can mean missing a jump or failing to sprint
        at the moment it mattered.
      </p>

      <h2>NKRO vs. 6-key rollover vs. ghosting</h2>
      <p>
        Keyboards are commonly rated at 6-key rollover (6KRO) — meaning at least 6 keys can be
        held simultaneously and register correctly, which covers almost every real typing and
        gaming scenario. Full NKRO goes further and guarantees <em>every</em> key, which mostly
        matters for competitive gaming setups with unusual key combinations.
      </p>
      <p>
        Rollover and <Link href="/blog/keyboard-ghosting-explained">ghosting</Link> are related
        but not the same thing: rollover is about how many keys register at once, while ghosting
        is about a specific wiring side effect that causes an unpressed key to falsely register
        (or a pressed one to silently fail) in certain three-key combinations.
      </p>

      <h2>How to check your own keyboard&apos;s rollover</h2>
      <p>
        Hold down as many keys as you comfortably can across the keyboard and watch which ones
        register. An online tester makes this easy to see at a glance — pressed keys light up
        immediately, so you can tell exactly where the rollover limit sits without needing any
        software installed.
      </p>
      <p>
        <Link href="/">Test your keyboard&apos;s rollover now →</Link>
      </p>

      <h2>Does your keyboard need full NKRO?</h2>
      <p>
        For office work, writing, and casual browsing: no — 6-key rollover is already more than
        enough headroom. For competitive gaming, especially genres with dense keybinds (fighting
        games, MMOs, fast-paced shooters with movement tech), full NKRO removes one more variable
        that could cost you an input at the wrong moment. It&apos;s a nice-to-have for most
        people and a real requirement for a smaller group of serious gamers.
      </p>
    </BlogPostLayout>
  )
}
