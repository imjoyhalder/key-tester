"use client"
import { useRef, useState } from "react"
import { Plus, CloudUpload, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import type { CustomAd } from "@/types/admin"
import { apiPost, apiUpload } from "@/lib/api"
import { SLOTS, SLOT_LABEL, type Slot } from "./ad-config"

interface UploadResult { url: string; publicId: string }
interface Props { onCreated: (ad: CustomAd) => void }

export const AdCreateCard = ({ onCreated }: Props) => {
  const [form, setForm] = useState({ title: "", imageUrl: "", cloudinaryPublicId: null as string | null, linkUrl: "", altText: "", slot: "sidebar-left" as Slot })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true); setCreateError(null)
    try { const r = await apiUpload<UploadResult>("/upload", file); setForm((f) => ({ ...f, imageUrl: r.url, cloudinaryPublicId: r.publicId })) }
    catch { setCreateError("Cloudinary upload failed. Check connection.") }
    finally { setUploading(false) }
  }

  const handleCreate = async () => {
    if (!form.title || !form.imageUrl || !form.linkUrl) { setCreateError("All fields marked with * are required."); return }
    setCreating(true); setCreateError(null)
    try {
      const created = await apiPost<CustomAd>("/ads", form)
      onCreated(created)
      setForm({ title: "", imageUrl: "", cloudinaryPublicId: null, linkUrl: "", altText: "", slot: "sidebar-left" })
    } catch { setCreateError("Failed to save ad to database.") }
    finally { setCreating(false) }
  }

  return (
    <Card className="xl:col-span-4 border-muted-foreground/10 shadow-lg">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-violet-500" />New Campaign</CardTitle>
        <CardDescription className="text-xs">Upload creative assets and define targeting.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Creative Asset *</Label>
          <div className="group relative h-32 w-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 hover:border-violet-500/50 transition-all cursor-pointer overflow-hidden"
            onClick={() => fileRef.current?.click()}>
            {form.imageUrl
              ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={form.imageUrl} className="w-full h-full object-cover" alt="Ad Preview" />
              : <><CloudUpload className="w-6 h-6 text-muted-foreground group-hover:text-violet-500 transition-colors" /><span className="text-[10px] font-medium mt-2 text-muted-foreground">PNG, JPG up to 5MB</span></>}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleUpload(f); e.target.value = "" }} />
            {uploading && <div className="absolute inset-0 bg-background/80 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-violet-600" /></div>}
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ad-title" className="text-xs font-semibold">Title *</Label>
            <Input id="ad-title" placeholder="Summer Refresh 2024" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ad-url" className="text-xs font-semibold">Destination URL *</Label>
            <Input id="ad-url" placeholder="https://store.com/..." value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Placement Slot</Label>
            <div className="grid grid-cols-1 gap-1.5">
              {SLOTS.map((s) => (
                <Button key={s} variant={form.slot === s ? "secondary" : "outline"} size="sm" onClick={() => setForm({ ...form, slot: s })}
                  className={cn("justify-start h-8 px-3 text-xs", form.slot === s && "border-violet-500/50 bg-violet-500/5")}>
                  {SLOT_LABEL[s]}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {createError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 text-xs border border-red-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />{createError}
          </div>
        )}
        <Button onClick={() => void handleCreate()} disabled={creating || uploading} className="w-full bg-violet-600 hover:bg-violet-700 shadow-md">
          {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Publish Campaign
        </Button>
      </CardContent>
    </Card>
  )
}
