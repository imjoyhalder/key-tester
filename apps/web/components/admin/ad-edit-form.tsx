"use client"
import { useState } from "react"
import { Pencil, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import type { CustomAd } from "@/types/admin"
import { SLOTS, SLOT_LABEL, type Slot } from "./ad-config"

interface Props {
  ad: CustomAd
  onSave: (updates: Partial<CustomAd>) => Promise<void>
  onCancel: () => void
  saving: boolean
  error: string | null
}

export const AdEditForm = ({ ad, onSave, onCancel, saving, error }: Props) => {
  const [title, setTitle] = useState(ad.title)
  const [linkUrl, setLink] = useState(ad.linkUrl)
  const [altText] = useState(ad.altText)
  const [slot, setSlot] = useState<Slot>(ad.slot as Slot)

  return (
    <div className="mt-2 p-5 rounded-xl border border-violet-500/20 bg-violet-500/[0.02] shadow-inner animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-violet-500">
          <Pencil className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">Modify Ad Asset</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8"><X className="w-4 h-4" /></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Display Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background shadow-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Target URL</Label>
          <Input value={linkUrl} onChange={(e) => setLink(e.target.value)} className="bg-background shadow-sm" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Placement Slot</Label>
          <div className="flex flex-wrap gap-2">
            {SLOTS.map((s) => (
              <Button key={s} type="button" variant={slot === s ? "default" : "outline"} size="sm" onClick={() => setSlot(s)}
                className={cn("h-8 px-4 font-medium transition-all", slot === s && "bg-violet-600 hover:bg-violet-700")}>
                {SLOT_LABEL[s]}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 flex items-center gap-2 text-xs text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => void onSave({ title, linkUrl, altText, slot, imageUrl: ad.imageUrl, cloudinaryPublicId: ad.cloudinaryPublicId })} disabled={saving} className="bg-violet-600 hover:bg-violet-700 h-9">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
          Update Asset
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving} className="h-9">Cancel</Button>
      </div>
    </div>
  )
}
