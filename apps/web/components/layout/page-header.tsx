import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export const PageHeader = () => (
  <header data-gsap="header" className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
      <Link href="/" className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity">
        <Image
          src="/keyboard.png"
          alt="KeyTester.io logo"
          width={36}
          height={36}
          priority
          className="w-9 h-9 shrink-0 select-none"
        />
        {/* Brand mark, not a heading — the homepage's real <h1> lives in
            CenterSection, describing the page rather than the site name. */}
        <span className="text-sm sm:text-base font-bold font-mono tracking-tight leading-none truncate">
          KEYTESTER.IO
        </span>
      </Link>
      <ThemeToggle />
    </div>
  </header>
)
