"use client"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"

const inputCls = [
  "w-full mt-1 px-3 py-2.5 rounded-lg border bg-muted",
  "font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500",
  "border-border text-foreground placeholder-muted-foreground",
].join(" ")

export const LoginForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const { error: authError } = await signIn.email({ email, password, callbackURL: "/admin" })
      if (authError) {
        setError(authError.message ?? "Invalid credentials")
        setLoading(false)
        return
      }
      router.push("/admin")
    } catch {
      // Network/connection failure — e.g. the API server is unreachable.
      // Without this, signIn.email's rejection surfaces as an uncaught error.
      setError("Cannot reach the server. Please check your connection and try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      <div>
        <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputCls} placeholder="admin@example.com" />
      </div>
      <div>
        <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className={inputCls} />
      </div>
      {error && <p className="text-sm text-red-400 font-mono bg-red-500/10 px-3 py-2 rounded-lg">⚠ {error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  )
}
