import type { Metadata } from "next"
export const metadata: Metadata = { robots: { index: false, follow: false } }
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/logo.svg"
            alt="KeyTester.io logo"
            width={48}
            height={48}
            priority
            className="mx-auto mb-3 h-12 w-12 rounded-xl"
          />
          <h1 className="font-mono text-lg font-bold">KeyTester Admin</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Sign in to access the dashboard
          </p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← Back to Keyboard Tester
          </Link>
        </p>
      </div>
    </div>
  )
}
