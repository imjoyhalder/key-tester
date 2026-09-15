import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { getBlogPost } from "@/lib/blog-posts"

const post = getBlogPost("keyboard-latency-test")!
export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: "/blog/keyboard-latency-test" },
}

export default function KeyboardLatencyTestPost() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Keyboard latency is the delay between a physical key actuation and the
        resulting input being received or displayed. The measurement depends on
        where you start and stop the timer. A browser cannot observe the exact
        moment your physical switch actuates.
      </p>
      <h2>Key-hold duration is not input latency</h2>
      <p>
        The time between a keydown event and a keyup event measures how long the
        browser sees a key held down. It mainly reflects your finger movement.
        Averaging that time does not turn it into a measurement of keyboard
        hardware latency.
      </p>
      <p>
        KeyTester.io shows which key events reach your browser. It does not
        provide a hardware latency score, and a green key means an event
        registered—not that its response time meets a performance standard.
      </p>
      <h2>What a browser test can tell you</h2>
      <ul>
        <li>Whether a key press reaches the page.</li>
        <li>Whether several keys register together.</li>
        <li>Whether a key appears to remain held until release.</li>
      </ul>
      <p>
        Operating-system shortcuts, browser focus, and software can affect these
        observations. Repeat a suspicious result in another application before
        treating it as a keyboard fault.
      </p>
      <h2>How hardware latency is measured</h2>
      <p>
        A hardware test needs an independent reference for actuation and a
        defined end point, such as an electrical output or a visible screen
        response. Dedicated measurement equipment or a carefully controlled
        high-speed-camera setup can provide those references. Compare results
        only when the methods and end points match.
      </p>
      <h2>If typing feels delayed</h2>
      <p>
        Try the same keyboard in a simple text editor, close demanding
        background applications, and check its connection and battery. Compare
        another port or connection mode if available. Change one thing at a time
        so you can identify what affects the result.
      </p>
      <p>
        <Link href="/">Check which keys register in your browser →</Link>
      </p>
      <h2>Event documentation</h2>
      <p>
        The browser events used for key detection are documented in the{" "}
        <a href="https://www.w3.org/TR/uievents/#events-keyboardevents">
          W3C UI Events specification
        </a>
        .
      </p>
    </BlogPostLayout>
  )
}
