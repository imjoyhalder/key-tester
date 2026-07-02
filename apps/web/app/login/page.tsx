import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/keyboard.png"
            alt="KeyTester.io logo"
            width={48}
            height={48}
            priority
            className="w-12 h-12 rounded-xl mx-auto mb-3"
          />
          <h1 className="text-lg font-bold font-mono">KeyTester Admin</h1>
          <p className="text-sm text-muted-foreground font-mono">Sign in to access the dashboard</p>
        </div>
        <LoginForm />
        <p className="text-center text-[11px] text-muted-foreground font-mono mt-4">
          <a href="/" className="hover:text-foreground transition-colors">← Back to Keyboard Tester</a>
        </p>
      </div>
    </div>
  )
}
