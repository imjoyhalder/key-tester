export const revalidate = 60

import { PageHeader } from "@/components/layout/page-header"
import { PageFooter } from "@/components/layout/page-footer"
import { CenterSection } from "@/components/layout/center-section"
import { RightSidebar } from "@/components/layout/right-sidebar"
import type { CustomAd } from "@/types/admin"

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:4000"

const getActiveAds = async (slot: string): Promise<CustomAd[]> => {
  try {
    const res = await fetch(`${API_URL}/api/ads/active?slot=${slot}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { success: boolean; data: CustomAd[] }
    return json.success ? json.data : []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [leftAds, rightAds, bannerAds] = await Promise.all([
    getActiveAds("sidebar-left"),
    getActiveAds("sidebar"),
    getActiveAds("banner"),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />

      <main className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_230px] gap-4">
          <CenterSection sponsorAds={leftAds} bannerAds={bannerAds} />
          <RightSidebar ads={rightAds} />
        </div>
      </main>

      <PageFooter />
    </div>
  )
}
