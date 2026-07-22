import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { blogPosts } from "@/lib/blog-posts"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides on diagnosing keyboard problems: stuck keys, N-Key Rollover, ghosting, and input latency.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/blog" },
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />

      <main className="max-w-[900px] mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold font-mono mb-1">Blog</h1>
        <p className="text-sm text-muted-foreground font-mono mb-8">
          Guides on diagnosing and understanding keyboard problems.
        </p>

        <div className="flex flex-col gap-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-card border border-border rounded-xl p-5 hover:border-violet-500/50 transition-colors"
            >
              <h2 className="text-base font-semibold mb-1.5">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <PageFooter />
    </div>
  )
}
