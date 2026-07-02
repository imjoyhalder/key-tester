import { CustomAdSidebar } from "@/components/ads/custom-ad-sidebar"
import type { CustomAd } from "@/types/admin"

export const RightSidebar = ({ ads }: { ads: CustomAd[] }) => (
  <aside data-gsap="sidebar-right" className="flex flex-col gap-3">
    {ads.length > 0 && <CustomAdSidebar ads={ads} />}
  </aside>
)
