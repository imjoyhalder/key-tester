"use client"
import { useState } from "react"
import { Pencil, Trash2, Power, PowerOff, Loader2, ExternalLink } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import type { CustomAd } from "@/types/admin"
import { SLOT_LABEL, type Slot } from "./ad-config"
import { AdEditForm } from "./ad-edit-form"

interface Props {
  ad: CustomAd
  onToggle: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onSave: (id: number, updates: Partial<CustomAd>) => Promise<void>
}

export const AdListItem = ({ ad, onToggle, onDelete, onSave }: Props) => {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const doToggle = async () => {
    setToggling(true); setActionError(null)
    try { await onToggle(ad.id) }
    catch { setActionError("Couldn't update the ad status. Please try again.") }
    finally { setToggling(false) }
  }
  const doDelete = async () => {
    setDeleting(true); setActionError(null)
    try { await onDelete(ad.id) }
    catch { setActionError("Couldn't delete the ad. Please try again."); setDeleting(false) }
  }
  const doSave = async (updates: Partial<CustomAd>) => {
    setSaving(true); setSaveError(null)
    try { await onSave(ad.id, updates); setEditing(false) }
    catch { setSaveError("Failed to update database.") }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-3 group">
      <div className={cn("flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
        ad.isActive ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-sm" : "bg-card border-border hover:border-muted-foreground/20")}>
        <div className="relative w-full md:w-28 h-20 rounded-lg overflow-hidden border border-border/50 shrink-0 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          <div className={cn("absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm", ad.isActive ? "bg-emerald-500" : "bg-muted-foreground/30")} />
        </div>
        <div className="flex-1 min-w-0 space-y-1 w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold truncate group-hover:text-violet-600 transition-colors">{ad.title}</span>
            <Badge variant="outline" className="text-[9px] uppercase h-4 px-1.5 font-bold tracking-tight bg-background/50">
              {SLOT_LABEL[ad.slot as Slot] ?? ad.slot}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="w-3 h-3" />
            <span className="truncate max-w-[250px]">{ad.linkUrl}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
          <Button variant="ghost" size="icon" onClick={() => { setEditing(!editing); setConfirming(false) }}
            className={cn("h-9 w-9 rounded-full", editing && "bg-violet-100 text-violet-600")}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => void doToggle()} disabled={toggling}
            className={cn("h-9 flex-1 md:flex-none md:w-28 gap-2 rounded-full font-semibold text-xs",
              ad.isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50")}>
            {toggling ? <Loader2 className="w-3 h-3 animate-spin" /> : ad.isActive ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
            {ad.isActive ? "Kill Switch" : "Enable"}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setConfirming(!confirming); setEditing(false) }}
            className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {actionError && (
        <p className="text-xs text-red-500 font-medium px-1">⚠ {actionError}</p>
      )}
      {editing && <AdEditForm ad={ad} onSave={doSave} onCancel={() => setEditing(false)} saving={saving} error={saveError} />}
      {confirming && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/[0.03] flex flex-col md:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-full text-white"><Trash2 className="w-4 h-4" /></div>
            <div className="text-center md:text-left">
              <p className="text-sm font-bold">Permanently delete campaign?</p>
              <p className="text-xs text-muted-foreground">This will remove analytics and creative assets.</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="destructive" size="sm" onClick={() => void doDelete()} disabled={deleting} className="h-8 shadow-sm">
              {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm Delete"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirming(false)} className="h-8">Keep It</Button>
          </div>
        </div>
      )}
      <Separator className="opacity-50" />
    </div>
  )
}
