import { CustomAdSidebar } from "@/components/ads/custom-ad-sidebar"
import { GoogleAd } from "@/components/ads/google-ad"
import type { CustomAd } from "@/types/admin"

const ADSENSE_ID = process.env["NEXT_PUBLIC_ADSENSE_CLIENT_ID"] ?? ""

export const RightSidebar = ({ ads }: { ads: CustomAd[] }) => (
  <aside data-gsap="sidebar-right" className="flex flex-col gap-3">
    {ads.length > 0 ? (
      <CustomAdSidebar ads={ads} />
    ) : (
      <GoogleAd isEnabled={!!ADSENSE_ID} adClientCode={ADSENSE_ID || null} />
    )}
  </aside>
)
