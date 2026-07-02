import Image from "next/image"
import Link from "next/link"

const linkCls =
  "text-[12px] text-muted-foreground hover:text-foreground transition-colors font-mono"

export const PageFooter = () => (
  <footer data-gsap="footer" className="mt-8 border-t border-border bg-card/30">
    <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Image
          src="/keyboard.png"
          alt="KeyTester.io logo"
          width={22}
          height={22}
          className="rounded-md"
        />
        <span className="text-[12px] text-muted-foreground font-mono">
          © 2026 KeyTester.io
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/privacy" className={linkCls}>Privacy Policy</Link>
        <Link href="/terms" className={linkCls}>Terms of Service</Link>
      </div>
    </div>
  </footer>
)
