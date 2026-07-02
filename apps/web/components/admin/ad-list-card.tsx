import { RefreshCw, AlertCircle, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import type { CustomAd } from "@/types/admin"
import { LoadingSkeleton } from "./ad-loading-skeleton"
import { AdListItem } from "./ad-list-item"

interface Props {
  ads: CustomAd[]
  loading: boolean
  fetchError: string | null
  onRefetch: () => void
  onToggle: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onSave: (id: number, updates: Partial<CustomAd>) => Promise<void>
}

export const AdListCard = ({ ads, loading, fetchError, onRefetch, onToggle, onDelete, onSave }: Props) => (
  <Card className="xl:col-span-8 border-muted-foreground/10 shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
      <div>
        <CardTitle className="text-base font-bold">Campaign Inventory</CardTitle>
        <CardDescription className="text-xs">Manage active and archived creative assets.</CardDescription>
      </div>
      <Badge variant="secondary" className="font-mono">{ads.length} Total</Badge>
    </CardHeader>
    <CardContent className="pt-6">
      {loading ? <LoadingSkeleton /> : fetchError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <h3 className="font-semibold text-lg">Loading Error</h3>
          <p className="text-muted-foreground text-sm mb-6">{fetchError}</p>
          <Button onClick={onRefetch} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </Button>
        </div>
      ) : ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
          <ImageIcon className="w-12 h-12 mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium">No campaigns found in history.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => <AdListItem key={ad.id} ad={ad} onToggle={onToggle} onDelete={onDelete} onSave={onSave} />)}
        </div>
      )}
    </CardContent>
  </Card>
)
