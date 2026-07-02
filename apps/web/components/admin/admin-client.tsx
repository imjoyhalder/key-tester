"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { apiGet } from "@/lib/api"
import type { AdminDashboardData } from "@/types/admin"
import { KeyHealthStatsPanel } from "./key-health-stats"
import { CustomAdsPanel } from "./custom-ads"
import { AdminSidebar } from "./admin-sidebar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"

type AdminSection = "key-health" | "custom-ads"
const LABELS: Record<AdminSection, string> = {
  "key-health": "Key Health",
  "custom-ads": "Custom Ads",
}

const SkeletonContent = () => (
  <div className="flex flex-col gap-4 p-4 lg:p-6">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
)

export const AdminClient = () => {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [section, setSection] = useState<AdminSection>("key-health")
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isPending) return
    if (!session) { router.push("/login"); return }
    const role = (session.user as { role?: string }).role
    if (role && role !== "admin") router.push("/")
  }, [session, isPending, router])

  useEffect(() => {
    const id = session?.user?.id
    if (!id) return
    let gone = false
    setLoading(true); setError(null)
    apiGet<AdminDashboardData>("/admin/dashboard")
      .then((d) => { if (!gone) setData(d) })
      .catch((e) => { if (!gone) setError(e instanceof Error ? e.message : "Failed to load") })
      .finally(() => { if (!gone) setLoading(false) })
    return () => { gone = true }
  }, [session?.user?.id])

  if (isPending) return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 min-h-screen border-r border-border bg-card" />
      <div className="flex-1"><div className="h-12 border-b bg-card/50" /><SkeletonContent /></div>
    </div>
  )
  if (!session) return null

  const handleSignOut = async () => {
    const { authClient } = await import("@/lib/auth-client")
    await authClient.signOut()
    router.push("/login")
  }

  const user = { name: session.user.name ?? session.user.email ?? "Admin", email: session.user.email ?? "" }

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 64)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AdminSidebar variant="inset" activeSection={section} onSelect={setSection} user={user} onSignOut={handleSignOut} />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-2 px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
            <span className="text-sm font-medium font-mono">{LABELS[section]}</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col @container/main">
          {loading ? <SkeletonContent /> : (
            <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
              {error && <p className="text-red-400 font-mono text-sm">⚠ {error}</p>}
              {section === "key-health" && data && <KeyHealthStatsPanel stats={data.keyHealthStats} />}
              {section === "custom-ads" && <CustomAdsPanel />}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
