import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
}

interface MeResponse {
  success: boolean
  data: { role: string }
}

// Verify the request has an active admin session by forwarding the incoming
// cookie to the API. Called on every server render of the admin layout.
async function getAdminRole(): Promise<string | null> {
  const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:4000"
  const reqHeaders = await headers()
  const cookie = reqHeaders.get("cookie") ?? ""
  if (!cookie) return null
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: { cookie },
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = (await res.json()) as MeResponse
    return json.success ? (json.data.role ?? null) : null
  } catch {
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getAdminRole()

  if (!role) redirect("/login")
  if (role !== "admin") redirect("/")

  return <>{children}</>
}
