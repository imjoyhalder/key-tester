import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import type { BlogPost } from "@/lib/blog-posts"

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] ?? "https://keytester.io"

interface BlogPostLayoutProps {
  post: BlogPost
  children: React.ReactNode
}

export const BlogPostLayout = ({ post, children }: BlogPostLayoutProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "KeyTester.io" },
    publisher: { "@type": "Organization", name: "KeyTester.io" },
    mainEntityOfPage: `${APP_URL}/blog/${post.slug}`,
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader />

      <main className="max-w-180 mx-auto px-4 py-10">
        <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground font-mono">
          ← Blog
        </Link>
        <h1 className="text-2xl font-bold font-mono mt-3 mb-1">{post.title}</h1>
        <p className="text-xs text-muted-foreground font-mono mb-8">
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_strong]:text-foreground [&_a]:text-violet-500 [&_a]:underline">
          {children}
        </div>

        <div className="mt-10 bg-card border border-border rounded-xl p-5 text-center">
          <p className="text-sm mb-3">Want to check your own keyboard right now?</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono font-semibold text-sm transition-colors"
          >
            Open the free keyboard tester →
          </Link>
        </div>
      </main>

      <PageFooter />
    </div>
  )
}
