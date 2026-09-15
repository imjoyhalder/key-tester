import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Brand } from "./brand"

export const PageHeader = () => (
  <header
    data-gsap="header"
    className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm"
  >
    <nav
      aria-label="Main navigation"
      className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4"
    >
      <Link
        href="/"
        aria-label="KeyTester.io home"
        className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <Brand />
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/blog"
          className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
        >
          Keyboard guides
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  </header>
)
