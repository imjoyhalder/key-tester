import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { getBlogPost } from "@/lib/blog-posts"

const post = getBlogPost("keyboard-latency-test")!

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  robots: { index: true, follow: true },
  alternates: { canonical: "/blog/keyboard-latency-test" },
}

export default function KeyboardLatencyTestPost() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Keyboard input latency is the time between physically pressing a key and your computer
        actually registering that press. It&apos;s measured in milliseconds, and while it sounds
        like a tiny number to obsess over, it&apos;s the same category of delay that makes a
        gaming mouse feel more &ldquo;connected&rdquo; than a cheap one — it&apos;s not about whether you can
        consciously perceive a single keystroke&apos;s delay, it&apos;s about consistency under load.
      </p>

      <h2>What actually causes the delay</h2>
      <p>A key press goes through several stages before your computer sees it, including:</p>
      <ul>
        <li>The physical switch actuating and the debounce delay that filters out electrical noise</li>
        <li>The keyboard&apos;s internal scan rate — how often its controller checks for pressed keys</li>
        <li>USB polling rate — how often the keyboard reports its state to the computer</li>
        <li>Whatever the operating system and the app in focus do with that input</li>
      </ul>
      <p>
        Each stage adds a small amount of time, and they stack. A wireless keyboard on a slow
        connection or a cheap USB polling rate can add noticeably more latency than a wired
        mechanical keyboard with a fast scan rate.
      </p>

      <h2>What counts as good vs. bad</h2>
      <p>
        Rough figures to calibrate against: a responsive mechanical keyboard typically lands
        somewhere around 5–15ms of input latency. Membrane keyboards and budget wireless boards
        are commonly in the 20–40ms range. Above that, on a mainstream board, something is
        usually working against you — an outdated driver, a laggy wireless connection, or a very
        old debounce implementation.
      </p>
      <p>
        These numbers matter far more in competitive gaming than in everyday typing — nobody
        notices 20ms while writing a document, but it&apos;s a real, measurable difference in a
        game where reaction time itself is being measured in a similar range.
      </p>

      <h2>How to measure it yourself</h2>
      <p>
        The simplest self-test is a press-to-release timer: press a key, release it, and measure
        the time between the two events across a running average rather than a single press,
        since any individual keystroke can be thrown off by normal human timing variance. Doing
        this for a dozen or more keys gives a much more reliable picture than one measurement.
      </p>
      <p>
        <Link href="/">Measure your keyboard&apos;s latency now →</Link>
      </p>

      <h2>If your numbers look worse than expected</h2>
      <p>
        Before assuming the keyboard itself is slow, rule out the easy culprits: a wireless
        dongle plugged into a rear USB port instead of one near you, a USB hub adding overhead,
        or background software polling the keyboard for hotkeys. Wired, direct-to-motherboard
        connections consistently test faster than wireless or hubbed setups, so that&apos;s the
        first thing worth changing if latency is higher than you&apos;d expect for the hardware
        you own.
      </p>
    </BlogPostLayout>
  )
}
