import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { getBlogPost } from "@/lib/blog-posts"

const post = getBlogPost("keyboard-ghosting-explained")!

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  robots: { index: true, follow: true },
  alternates: { canonical: "/blog/keyboard-ghosting-explained" },
}

export default function KeyboardGhostingExplainedPost() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Keyboard ghosting is when pressing a specific combination of keys causes a key you
        didn&apos;t press to register anyway — or causes a key you are pressing to silently drop.
        It&apos;s not a broken switch and it&apos;s not a software bug; it&apos;s a side effect of
        how cheaper keyboards wire their keys internally.
      </p>

      <h2>Why it happens</h2>
      <p>
        Most keyboards don&apos;t give every single key its own dedicated wire back to the
        controller — that would need far too many connections. Instead, keys are arranged in a
        grid, and the controller scans rows and columns to figure out which keys are pressed. The
        problem: if three specific keys that share rows and columns in a particular pattern are
        all held down at once, the electrical signal can complete a path through a fourth key in
        that same rectangle of the grid, even though nobody pressed it. That&apos;s a &ldquo;ghost&rdquo;
        key press.
      </p>

      <h2>Ghosting vs. rollover limits</h2>
      <p>
        It&apos;s easy to confuse ghosting with simply hitting a keyboard&apos;s{" "}
        <Link href="/blog/what-is-nkro">rollover limit</Link>, but they&apos;re different
        problems. Rollover limits mean the keyboard silently ignores extra key presses past a
        certain count. Ghosting is more specific — it&apos;s a particular three-or-four key
        combination, tied to the physical grid layout of that exact keyboard, that either drops a
        real press or invents a fake one.
      </p>

      <h2>Key blocking: the safer failure mode</h2>
      <p>
        Better keyboards avoid ghosting with diodes on every key, which prevent the signal from
        completing the wrong path. When manufacturers add diodes but don&apos;t go all the way to
        full NKRO, you get &ldquo;key blocking&rdquo; instead of ghosting: the ambiguous key combination is
        simply ignored rather than triggering a phantom input. It&apos;s still a limitation, but
        a much safer one than a key registering that you never touched.
      </p>

      <h2>How to test for it</h2>
      <p>
        Ghosting only shows up with specific combinations, so the practical way to check is to
        hold down clusters of keys — especially ones that are physically close together — and
        watch for anything lighting up that you didn&apos;t press, or a key that stays dark while
        you&apos;re clearly holding it. An on-screen keyboard tester that shows live press state
        makes this immediately visible.
      </p>
      <p>
        <Link href="/">Check your keyboard for ghosting →</Link>
      </p>

      <h2>Does it actually matter for you?</h2>
      <p>
        For typing, essentially never — you don&apos;t hold three unrelated keys down together
        while writing an email. It mostly matters in gaming, where diagonal movement plus an
        ability key plus a modifier is a completely normal combination to hold at once. If that
        exact combination happens to line up with a weak spot in your keyboard&apos;s grid,
        you&apos;ll feel it as an input that &ldquo;just doesn&apos;t work sometimes&rdquo; — which is exactly
        the kind of intermittent issue worth testing for directly instead of guessing at.
      </p>
    </BlogPostLayout>
  )
}
