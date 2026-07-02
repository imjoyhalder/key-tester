"use client"
import { useState, useEffect } from "react"
import { Layout } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { CustomAd } from "@/types/admin"
import { apiGet, apiPatch, apiDelete } from "@/lib/api"
import { SLOTS, SLOT_LABEL } from "./ad-config"
import { AdCreateCard } from "./ad-create-card"
import { AdListCard } from "./ad-list-card"

export const CustomAdsPanel = () => {
  const [ads, setAds] = useState<CustomAd[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchAds = async () => {
    setLoading(true); setFetchError(null)
    try { setAds(await apiGet<CustomAd[]>("/ads")) }
    catch (err) { setFetchError(err instanceof Error ? err.message : "Network failure") }
    finally { setLoading(false) }
  }

  useEffect(() => { void fetchAds() }, [])

  const activePerSlot = ads.reduce<Record<string, number>>((acc, a) => {
    if (a.isActive) acc[a.slot] = (acc[a.slot] ?? 0) + 1
    return acc
  }, {})

  const handleCreated = (created: CustomAd) =>
    setAds((prev) => [created, ...prev.map((a) => a.slot === created.slot && created.isActive ? { ...a, isActive: false } : a)])

  const handleToggle = async (id: number) => {
    const ad = ads.find((a) => a.id === id)
    if (!ad) return
    const updated = await apiPatch<CustomAd>(`/ads/${id}`, { isActive: !ad.isActive })
    setAds((prev) => prev.map((a) => {
      if (a.id === updated.id) return updated
      if (updated.isActive && a.slot === updated.slot) return { ...a, isActive: false }
      return a
    }))
  }

  const handleDelete = async (id: number) => {
    await apiDelete(`/ads/${id}`)
    setAds((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSave = async (id: number, updates: Partial<CustomAd>) => {
    const updated = await apiPatch<CustomAd>(`/ads/${id}`, updates)
    setAds((prev) => prev.map((a) => {
      if (a.id === updated.id) return updated
      if (updates.isActive === true && a.slot === updated.slot) return { ...a, isActive: false }
      return a
    }))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Campaign Manager</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Layout className="w-4 h-4" /> Professional Ad Placement Engine
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <div key={s} className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all",
              activePerSlot[s] ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600" : "bg-secondary/50 border-border text-muted-foreground"
            )}>
              <div className={cn("w-2 h-2 rounded-full", activePerSlot[s] ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40")} />
              {SLOT_LABEL[s]}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <AdCreateCard onCreated={handleCreated} />
        <AdListCard ads={ads} loading={loading} fetchError={fetchError} onRefetch={fetchAds} onToggle={handleToggle} onDelete={handleDelete} onSave={handleSave} />
      </div>
    </div>
  )
}
