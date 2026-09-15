import Link from "next/link"
import { Brand } from "./brand"

export const PageFooter = () => (
  <footer data-gsap="footer" className="mt-12 border-t border-border">
    <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center">
      <div>
        <Link href="/" aria-label="KeyTester.io home">
          <Brand compact />
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          Know every key works.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          © {new Date().getFullYear()} KeyTester.io
        </p>
      </div>
      <nav
        aria-label="Footer navigation"
        className="flex flex-wrap gap-5 text-sm text-muted-foreground"
      >
        <Link href="/blog" className="hover:text-foreground">
          Keyboard guides
        </Link>
        <Link href="/privacy" className="hover:text-foreground">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-foreground">
          Terms
        </Link>
      </nav>
    </div>
  </footer>
)
