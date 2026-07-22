import type { Metadata } from "next"
import Link from "next/link"
import { BlogPostLayout } from "@/components/blog/blog-post-layout"
import { getBlogPost } from "@/lib/blog-posts"

const post = getBlogPost("keyboard-not-working")!

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  robots: { index: true, follow: true },
  alternates: { canonical: "/blog/keyboard-not-working" },
}

export default function KeyboardNotWorkingPost() {
  return (
    <BlogPostLayout post={post}>
      <p>
        A keyboard key that doesn&apos;t work usually falls into one of three buckets: it never
        registers at all, it registers sometimes but not reliably, or it registers the wrong
        character. Each points to a different cause, and figuring out which one you have is the
        fastest way to know whether you need a new keyboard or just need to fix a setting.
      </p>

      <h2>Step 1: Confirm it&apos;s the key, not the app</h2>
      <p>
        Before assuming your keyboard is broken, rule out software. Open a plain text field
        (Notepad, a browser address bar, anything with no keyboard shortcuts bound to it) and
        press the key there. If it still doesn&apos;t type anything, it&apos;s not an app-specific
        shortcut conflict — move on to testing the hardware itself.
      </p>

      <h2>Step 2: Test every key at once</h2>
      <p>
        The quickest way to map out exactly which keys are affected is to use an online keyboard
        tester and press every key on your board once. Working keys turn green; anything that
        doesn&apos;t respond stays gray, and you get a complete picture in under a minute instead
        of guessing key by key.
      </p>
      <p>
        <Link href="/">Try the free keyboard tester →</Link>
      </p>

      <h2>Step 3: Look at the pattern</h2>
      <p>A single dead key almost always points to one of these:</p>
      <ul>
        <li>
          <strong>Debris under the keycap</strong> — dust, crumbs, or a hair caught under the
          switch. Removing the keycap and blowing it out with compressed air fixes this more
          often than people expect.
        </li>
        <li>
          <strong>A worn-out switch</strong> — common on keyboards that are several years old,
          especially on frequently-used keys like spacebar or the letter keys in your dominant
          hand&apos;s home row.
        </li>
        <li>
          <strong>Liquid damage</strong> — if several adjacent keys stopped working around the
          same time, a spill is the likely cause, even a small one from weeks ago.
        </li>
      </ul>
      <p>
        If instead <em>several keys in a specific combination</em> fail only when pressed
        together — but work fine individually — that&apos;s a different problem called{" "}
        <Link href="/blog/keyboard-ghosting-explained">keyboard ghosting</Link>, not a broken key.
      </p>

      <h2>Step 4: Try a different USB port or a different computer</h2>
      <p>
        If every key seems unresponsive at once, the fault is more likely the cable, the USB
        port, or a driver issue than every switch failing simultaneously. Testing on a second
        computer (or a different port) takes thirty seconds and immediately tells you whether
        the keyboard itself is the problem.
      </p>

      <h2>When it&apos;s time to replace the keyboard</h2>
      <p>
        Mechanical switches are individually replaceable on many keyboards, and a single dead
        switch is often a cheap, straightforward repair. On membrane keyboards (most laptops and
        budget boards), a dead key usually means the membrane layer itself has failed at that
        point, and replacing the whole keyboard is typically more practical than repairing it.
      </p>
    </BlogPostLayout>
  )
}
