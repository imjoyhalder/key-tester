export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
}

// Single source of truth for post metadata — the blog index and sitemap.ts
// both read from this so a new post only needs to be added here once.
export const blogPosts: BlogPost[] = [
  {
    slug: "keyboard-not-working",
    title: "Keyboard Not Working? How to Find Out Which Keys Are Broken",
    description:
      "A step-by-step guide to diagnosing unresponsive, stuck, or intermittent keyboard keys, and how to tell a hardware fault from a software one.",
    date: "2026-07-15",
  },
  {
    slug: "what-is-nkro",
    title: "What Is N-Key Rollover (NKRO) and Why It Matters",
    description:
      "NKRO explained in plain terms: what it means, why gamers and fast typists care about it, and how to check how many keys your keyboard can register at once.",
    date: "2026-07-15",
  },
  {
    slug: "keyboard-ghosting-explained",
    title: "What Is Keyboard Ghosting? Causes and How to Test for It",
    description:
      "Why some key combinations silently fail to register, what \"ghosting\" actually means, and how to check whether your keyboard suffers from it.",
    date: "2026-07-15",
  },
  {
    slug: "keyboard-latency-test",
    title: "How to Test Keyboard Input Latency (and What Counts as Good)",
    description:
      "What keyboard input latency actually measures, typical numbers for membrane vs. mechanical keyboards, and how to test yours for free.",
    date: "2026-07-15",
  },
]

export const getBlogPost = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug)
