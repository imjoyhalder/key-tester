import { KeyboardLayout } from "@/components/keyboard/keyboard-layout"
import { CustomAdSidebar } from "@/components/ads/custom-ad-sidebar"
import { CustomAdBanner } from "@/components/ads/custom-ad-banner"
import { SponsorCta } from "@/components/ads/sponsor-cta"
import { SoundToggle } from "@/components/controls/sound-toggle"
import type { CustomAd } from "@/types/admin"

interface CenterSectionProps {
  sponsorAds: CustomAd[]
  bannerAds: CustomAd[]
}

export const CenterSection = ({ sponsorAds, bannerAds }: CenterSectionProps) => {
  const ctaAd = sponsorAds[0] ?? bannerAds[0]
  const hasBelow = sponsorAds.length > 0 || bannerAds.length > 0

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div data-gsap="keyboard-card" className="bg-card border border-border rounded-xl px-4 pt-4 pb-6 shadow-sm">
        {/* Card header — sound toggle sits right by the keyboard so it's within
            easy reach while testing */}
        <div className="flex items-center justify-between mb-3">
          {/* The page's real <h1> — describes what the tool does, not the
              brand name, so Google has something to match "keyboard
              tester" / "keyboard checker" searches against. Visual size
              is unchanged; only the semantics and text changed. */}
          <h1 className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            Free Online Keyboard Tester &amp; Key Checker
          </h1>
          <SoundToggle />
        </div>
        <KeyboardLayout />
      </div>

      {hasBelow && (
        <div data-gsap="keyboard-extras" className="flex flex-col gap-3">
          {/* Intent-triggered CTA — appears on a faulty key / engaged session */}
          {ctaAd && <SponsorCta ad={ctaAd} />}
          {/* Primary sponsor — the prominent image ad, placed directly below the
              keyboard where user attention naturally lands after testing */}
          {sponsorAds.length > 0 && <CustomAdSidebar ads={sponsorAds} />}
          {bannerAds.length > 0 && <CustomAdBanner ads={bannerAds} />}
        </div>
      )}
    </div>
  )
}
